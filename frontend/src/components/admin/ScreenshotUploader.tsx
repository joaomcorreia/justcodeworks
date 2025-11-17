'use client';

import { useState, useEffect } from 'react';
import { getDictionary } from '@/i18n/index';

// UI Components
import { CloudArrowUpIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SiteProject {
  id: string;
  name: string;
  slug: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface SectionDraft {
  id: string;
  image_url: string;
  project: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  section_name: string;
  locale: string;
  created_at: string;
  ai_output_json?: {
    sections?: Array<{
      type: string;
      title: string;
      content?: string;
      image_url?: string;
      cta_text?: string;
      cta_url?: string;
    }>;
    overall_theme?: string;
    color_scheme?: string;
    business_type?: string;
  };
}

interface ScreenshotUploaderProps {
  locale: string;
}

export default function ScreenshotUploader({ locale }: ScreenshotUploaderProps) {
  const [dictionary, setDictionary] = useState<any>(null);

  // UI State
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [sectionName, setSectionName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<SectionDraft | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Step 3 State
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [creatingSection, setCreatingSection] = useState(false);
  const [sectionCreated, setSectionCreated] = useState(false);

  // Load dictionary
  useEffect(() => {
    getDictionary(locale).then(setDictionary);
  }, [locale]);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/me/', {
        credentials: 'include',
      });
      console.log('[AUTH] Authentication status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTH] Authentication data:', data);
        
        if (!data.authenticated) {
          setError('Please log in to access this feature. Go to http://localhost:8000/admin/ to log in first, then return here.');
          return false;
        }
        return true;
      } else {
        setError('Please log in to access this feature. Go to http://localhost:8000/admin/ to log in first, then return here.');
        return false;
      }
    } catch (error) {
      console.error('[AUTH] Authentication check failed:', error);
      setError('Cannot connect to server. Make sure the backend is running on http://localhost:8000/');
      return false;
    }
  };

  // Fetch user projects and CSRF token
  useEffect(() => {
    const init = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        fetchProjects();
        fetchCsrfToken();
      }
    };
    init();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      console.log('[SCREENSHOT] Fetching CSRF token...');
      const response = await fetch('http://localhost:8000/api/csrf/', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log('[SCREENSHOT] CSRF token fetched successfully');
      } else {
        console.error('[SCREENSHOT] Failed to fetch CSRF token:', response.status);
      }
    } catch (err) {
      console.error('[SCREENSHOT] CSRF fetch error:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      console.log('[SCREENSHOT] Fetching projects from API...');
      const response = await fetch('http://localhost:8000/api/admin/user-sites/', {
        credentials: 'include',
      });

      console.log('[SCREENSHOT] API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[SCREENSHOT] API Response data:', data);
        
        // Handle both list and object responses
        const projectsList = Array.isArray(data) ? data : (data.results || []);
        
        setProjects(projectsList);
        if (projectsList.length > 0) {
          setSelectedProjectId(projectsList[0].id);
        }
        
        console.log('[SCREENSHOT] Loaded projects:', projectsList.length);
      } else {
        console.error('[SCREENSHOT] API Error:', response.status, response.statusText);
        setError(`Failed to load projects (${response.status})`);
      }
    } catch (err) {
      console.error('[SCREENSHOT] Fetch error:', err);
      setError('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a PNG, JPG, or SVG file.');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Simulate input change
      const input = document.getElementById('file-input') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // Trigger file selection
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };



  // Upload screenshot
  const handleUpload = async () => {
    if (!selectedFile || !selectedProjectId) {
      setError('Please select a file and project');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('project', selectedProjectId);
      formData.append('locale', locale);
      if (sectionName.trim()) {
        formData.append('section_name', sectionName.trim());
      }

      console.log('[SCREENSHOT] Uploading with CSRF token:', csrfToken ? 'Present' : 'Missing');

      const response = await fetch('http://localhost:8000/api/sections/upload-screenshot/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        setSelectedFile(null);
        setPreviewUrl('');
        setSectionName('');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  // Process with AI
  const handleAIProcess = async () => {
    if (!uploadResult) {
      setError('No upload result to process');
      return;
    }

    if (!csrfToken) {
      setError('CSRF token not available. Please refresh the page.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      console.log('[AI] Processing section draft:', uploadResult.id);
      console.log('[AI] Using CSRF token:', csrfToken ? 'Available' : 'Missing');

      const response = await fetch(`http://localhost:8000/api/sections/${uploadResult.id}/process/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      console.log('[AI] Processing response status:', response.status);
      console.log('[AI] Processing response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        console.log('[AI] Processing completed successfully:', result);
      } else {
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        try {
          // Clone the response so we can read it multiple times if needed
          const responseText = await response.text();
          console.error('[AI] Processing error response:', responseText);
          
          // Try to parse as JSON first
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.detail || errorMessage;
          } catch (jsonParseError) {
            // If JSON parsing fails, use the raw text
            errorMessage = responseText || errorMessage;
          }
        } catch (readError) {
          console.error('[AI] Failed to read error response:', readError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('[AI] Processing network error:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the backend server. Please ensure the Django server is running on port 8000.');
      } else {
        setError(`Network error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  // Step 3: Fetch pages for the current project
  const fetchPages = async (projectId: string) => {
    try {
      console.log('[STEP3] Fetching pages for project:', projectId);
      const response = await fetch(`http://localhost:8000/api/pages/?project=${projectId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
        console.log('[STEP3] Pages fetched:', data);
      } else {
        console.error('[STEP3] Failed to fetch pages:', response.status);
        setPages([]);
      }
    } catch (error) {
      console.error('[STEP3] Error fetching pages:', error);
      setPages([]);
    }
  };

  // Step 3: Create sections from AI data
  const handleCreateSections = async () => {
    if (!uploadResult || !selectedPageId) {
      setError('Please select a page first');
      return;
    }

    setCreatingSection(true);
    setError('');

    try {
      console.log('[STEP3] Creating sections for page:', selectedPageId);

      const response = await fetch(`http://localhost:8000/api/sections/drafts/${uploadResult.id}/create-section/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          page_id: selectedPageId
        }),
      });

      console.log('[STEP3] Create sections response:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('[STEP3] Sections created successfully:', result);
        setSectionCreated(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create sections');
        console.error('[STEP3] Create sections error:', errorData);
      }
    } catch (error) {
      console.error('[STEP3] Create sections network error:', error);
      setError('Network error while creating sections');
    } finally {
      setCreatingSection(false);
    }
  };

  // Effect to fetch pages when project is selected and AI processing is complete
  useEffect(() => {
    if (uploadResult && uploadResult.status === 'ready' && uploadResult.ai_output_json && selectedProjectId) {
      fetchPages(selectedProjectId);
    }
  }, [uploadResult, selectedProjectId]);

  // Loading state
  if (loading || !dictionary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Section from Screenshot</h1>
          <p className="mt-2 text-gray-600">
            Upload a screenshot to generate website sections with AI. Step 1: Upload and store the image.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          
          {/* Project Selection */}
          <div className="mb-6">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
              Select Project
            </label>
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {!csrfToken && (
              <p className="text-xs text-gray-500 mt-1">Loading authentication...</p>
            )}
          </div>

          {/* Section Name (Optional) */}
          <div className="mb-6">
            <label htmlFor="section-name" className="block text-sm font-medium text-gray-700 mb-2">
              Section Name (Optional)
            </label>
            <input
              type="text"
              id="section-name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g., Hero Section, About Us, Services..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Screenshot
            </label>
            
            {/* Drop Zone */}
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded border"
                  />
                  <p className="text-sm text-gray-600">
                    File: {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drop your screenshot here</p>
                    <p className="text-sm text-gray-600">or click to browse files</p>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, or SVG files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
              {error.includes('log in') && (
                <div className="mt-2">
                  <a 
                    href="http://localhost:8000/admin/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    → Open Django Admin Login
                  </a>
                  <p className="text-xs text-gray-500 mt-1">
                    After logging in, refresh this page to continue.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedProjectId || uploading || !csrfToken}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-4 w-4" />
                  <span>Upload Screenshot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckIcon className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium text-green-900">Screenshot Uploaded Successfully!</h3>
            </div>
            
            <div className="space-y-2 text-sm text-green-700">
              <p><strong>Draft ID:</strong> {uploadResult.id}</p>
              <p><strong>Status:</strong> {uploadResult.status}</p>
              {uploadResult.section_name && (
                <p><strong>Section Name:</strong> {uploadResult.section_name}</p>
              )}
              <p><strong>Created:</strong> {new Date(uploadResult.created_at).toLocaleString()}</p>
            </div>

            {uploadResult.image_url && (
              <div className="mt-4">
                <img
                  src={uploadResult.image_url}
                  alt="Uploaded screenshot"
                  className="max-h-48 rounded border"
                />
              </div>
            )}

            {/* AI Processing Actions */}
            {uploadResult.status === 'pending' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700 mb-3">
                  <strong>Ready for Step 2:</strong> Process this screenshot with AI to extract website sections.
                </p>
                <button
                  onClick={handleAIProcess}
                  disabled={processing || !csrfToken}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <PhotoIcon className="h-4 w-4" />
                      <span>Process with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Processing Status */}
            {uploadResult.status === 'processing' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                  <p className="text-sm text-yellow-700">
                    <strong>AI Processing:</strong> Analyzing your screenshot to extract website sections...
                  </p>
                </div>
              </div>
            )}

            {/* Error Status */}
            {uploadResult.status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>Processing Error:</strong> AI analysis failed. Please try again or contact support.
                </p>
                <button
                  onClick={handleAIProcess}
                  disabled={processing}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Retry AI Processing
                </button>
              </div>
            )}

            {/* Success - Show AI Results */}
            {uploadResult.status === 'ready' && uploadResult.ai_output_json && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="text-lg font-medium text-green-900 mb-3">🧠 AI Analysis Complete!</h4>
                
                {/* Business Analysis */}
                {(uploadResult.ai_output_json.business_type || uploadResult.ai_output_json.overall_theme || uploadResult.ai_output_json.color_scheme) && (
                  <div className="mb-4 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-2">Website Analysis</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {uploadResult.ai_output_json.business_type && (
                        <div>
                          <span className="font-medium text-gray-700">Business Type:</span>
                          <p className="text-gray-600 capitalize">{uploadResult.ai_output_json.business_type}</p>
                        </div>
                      )}
                      {uploadResult.ai_output_json.overall_theme && (
                        <div>
                          <span className="font-medium text-gray-700">Theme:</span>
                          <p className="text-gray-600 capitalize">{uploadResult.ai_output_json.overall_theme}</p>
                        </div>
                      )}
                      {uploadResult.ai_output_json.color_scheme && (
                        <div>
                          <span className="font-medium text-gray-700">Colors:</span>
                          <p className="text-gray-600 capitalize">{uploadResult.ai_output_json.color_scheme}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Extracted Sections */}
                {uploadResult.ai_output_json.sections && uploadResult.ai_output_json.sections.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Extracted Sections ({uploadResult.ai_output_json.sections.length})</h5>
                    <div className="space-y-3">
                      {uploadResult.ai_output_json.sections.map((section, index) => (
                        <div key={index} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="font-medium text-gray-900 capitalize">
                              {section.type} Section
                            </h6>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Section {index + 1}
                            </span>
                          </div>
                          
                          {section.title && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Title:</span>
                              <p className="text-sm text-gray-900 font-medium">{section.title}</p>
                            </div>
                          )}
                          
                          {section.content && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Content:</span>
                              <p className="text-sm text-gray-600 line-clamp-3">{section.content}</p>
                            </div>
                          )}
                          
                          {section.cta_text && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Call to Action:</span>
                              <p className="text-sm text-blue-600">{section.cta_text}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Create Sections */}
                {!sectionCreated ? (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h5 className="font-medium text-blue-900 mb-3">🚀 Step 3: Create Sections</h5>
                    <p className="text-sm text-blue-700 mb-4">
                      Select a page to add these AI-extracted sections to your website.
                    </p>
                    
                    {/* Page Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Page:
                      </label>
                      <select
                        value={selectedPageId}
                        onChange={(e) => setSelectedPageId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={creatingSection}
                      >
                        <option value="">Choose a page...</option>
                        {pages.map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.title}
                          </option>
                        ))}
                      </select>
                      {pages.length === 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Loading pages...
                        </p>
                      )}
                    </div>

                    {/* Create Button */}
                    <button
                      onClick={handleCreateSections}
                      disabled={!selectedPageId || creatingSection}
                      className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                        !selectedPageId || creatingSection
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      }`}
                    >
                      {creatingSection ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Sections...
                        </span>
                      ) : (
                        'Create Sections on Page'
                      )}
                    </button>
                  </div>
                ) : (
                  /* Success Message */
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-green-900 mb-1">✅ Sections Created Successfully!</h5>
                        <p className="text-sm text-green-700 mb-3">
                          Your AI-extracted sections have been added to the selected page. You can now edit and customize them in the page editor.
                        </p>
                        <button
                          onClick={() => {
                            // Reset for another upload
                            setUploadResult(null);
                            setSelectedFile(null);
                            setPreviewUrl('');
                            setSectionCreated(false);
                            setSelectedPageId('');
                          }}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          Upload Another Screenshot
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}