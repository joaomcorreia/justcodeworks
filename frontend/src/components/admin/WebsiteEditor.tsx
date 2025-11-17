"use client";

import { useState, useRef, useEffect } from "react";
import { PencilIcon, EyeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// [TYPES] Component interfaces
interface WebsiteEditorProps {
  siteData: SiteProject;
  locale: string;
}

interface SiteProject {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  is_active: boolean;
  site_template?: {
    key: string;
    name: string;
  };
  pages: SitePage[];
}

interface SitePage {
  id: string;
  title: string;
  slug: string;
  is_homepage: boolean;
  sections: SiteSection[];
}

interface SiteSection {
  id: string;
  name: string;
  section_type: string;
  order: number;
  is_active: boolean;
  fields: SectionField[];
}

interface SectionField {
  id: string;
  field_key: string;
  field_type: string;
  content: any;
}

interface SectionOverlay {
  id: string;
  rect: DOMRect;
  section: SiteSection;
  element: HTMLElement;
}

// [MAIN] Website Editor Component
export default function WebsiteEditor({ siteData, locale }: WebsiteEditorProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [currentPage, setCurrentPage] = useState<SitePage | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SiteSection | null>(null);
  const [sectionOverlays, setSectionOverlays] = useState<SectionOverlay[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with homepage
  useEffect(() => {
    const homepage = siteData.pages?.find(page => page.is_homepage) || siteData.pages?.[0];
    if (homepage) {
      setCurrentPage(homepage);
    }
  }, [siteData]);

  // [PREVIEW] Get website URL
  const getWebsiteUrl = (pageSlug?: string): string => {
    const baseUrl = `http://localhost:3001/sites/${siteData.slug}`;
    return pageSlug && pageSlug !== 'home' ? `${baseUrl}/${pageSlug}` : baseUrl;
  };

  // [OVERLAY] Detect sections in preview frame
  const detectSections = () => {
    if (!previewFrameRef.current?.contentDocument || !isEditMode || !currentPage) return;

    const frameDoc = previewFrameRef.current.contentDocument;
    const frameRect = previewFrameRef.current.getBoundingClientRect();
    
    // Find section elements in the iframe
    const sectionElements = frameDoc.querySelectorAll(
      'section, [data-section], .section, [class*="section-"], .hero, .features, .testimonials, .contact, .about, .gallery, .menu'
    );
    
    const overlays: SectionOverlay[] = [];

    sectionElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      
      // Only include visible elements with significant size
      if (rect.width > 100 && rect.height > 50) {
        // Adjust coordinates relative to the iframe container
        const adjustedRect = new DOMRect(
          rect.left + frameRect.left,
          rect.top + frameRect.top,
          rect.width,
          rect.height
        );

        // Try to match with actual site sections
        const sectionId = htmlElement.getAttribute('data-section-id') || 
                         htmlElement.getAttribute('data-section') ||
                         htmlElement.getAttribute('id') ||
                         `section-${index}`;

        // Find matching section from site data
        const matchingSection = currentPage.sections.find(s => 
          s.id === sectionId || 
          s.section_type === htmlElement.className.split(' ')[0] ||
          s.name.toLowerCase().includes(htmlElement.tagName.toLowerCase())
        ) || currentPage.sections[index % currentPage.sections.length];

        if (matchingSection) {
          overlays.push({
            id: sectionId,
            rect: adjustedRect,
            section: matchingSection,
            element: htmlElement
          });
        }
      }
    });

    setSectionOverlays(overlays);
  };

  // [EVENTS] Handle iframe load and resize
  useEffect(() => {
    const handleIframeLoad = () => {
      setTimeout(detectSections, 1500); // Wait for content to fully render
    };

    const handleResize = () => {
      if (isEditMode) {
        setTimeout(detectSections, 100);
      }
    };

    const iframe = previewFrameRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isEditMode, currentPage]);

  // [INTERACTION] Handle section hover and click
  const handleSectionHover = (sectionId: string | null) => {
    setHoveredSection(sectionId);
  };

  const handleSectionClick = (section: SiteSection) => {
    setSelectedSection(section);
    setIsEditModalOpen(true);
  };

  // [RENDER] Section overlays with hover effects and edit buttons
  const renderSectionOverlays = () => {
    if (!isEditMode) return null;

    return sectionOverlays.map((overlay) => {
      const isHovered = hoveredSection === overlay.id;
      const isSelected = selectedSection?.id === overlay.section.id;
      
      return (
        <div
          key={overlay.id}
          className={`absolute border-2 transition-all duration-200 pointer-events-auto cursor-pointer ${
            isHovered || isSelected
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-transparent hover:border-blue-300'
          }`}
          style={{
            left: overlay.rect.left,
            top: overlay.rect.top,
            width: overlay.rect.width,
            height: overlay.rect.height,
            zIndex: 1000,
          }}
          onMouseEnter={() => handleSectionHover(overlay.id)}
          onMouseLeave={() => handleSectionHover(null)}
          onClick={() => handleSectionClick(overlay.section)}
        >
          {/* [UI] Section label and edit button */}
          {(isHovered || isSelected) && (
            <div className="absolute -top-8 left-0 flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow-lg">
              <span>{overlay.section.name}</span>
              <span className="text-xs opacity-75">({overlay.section.section_type})</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionClick(overlay.section);
                }}
                className="p-1 hover:bg-blue-700 rounded"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* [HEADER] Website editor controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href={`/${locale}/admin/edit-website`}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </a>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {siteData.name}
              </h2>
              <p className="text-sm text-gray-500">
                /{siteData.slug} • {currentPage?.title || 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Page selector */}
            {siteData.pages && siteData.pages.length > 1 && (
              <select
                value={currentPage?.id || ''}
                onChange={(e) => {
                  const page = siteData.pages.find(p => p.id === e.target.value);
                  if (page) setCurrentPage(page);
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {siteData.pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} {page.is_homepage ? '(Home)' : ''}
                  </option>
                ))}
              </select>
            )}

            {/* Edit mode toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Edit Mode</span>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isEditMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEditMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Preview link */}
            <a
              href={getWebsiteUrl(currentPage?.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 hover:bg-blue-50 rounded-lg"
            >
              <EyeIcon className="w-4 h-4 inline mr-1" />
              Preview
            </a>
          </div>
        </div>
      </div>

      {/* [PREVIEW] Website preview with editing overlays */}
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
        {/* [IFRAME] Website preview */}
        <iframe
          ref={previewFrameRef}
          src={getWebsiteUrl(currentPage?.slug)}
          className="w-full h-full border-0"
          title={`Preview of ${siteData.name}`}
        />
        
        {/* [OVERLAY] Section editing overlays */}
        {isEditMode && (
          <div
            ref={overlayContainerRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 999 }}
          >
            {renderSectionOverlays()}
          </div>
        )}

        {/* [UI] Edit mode indicator */}
        {isEditMode && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 z-50">
            <PencilIcon className="w-4 h-4" />
            <span>Edit Mode</span>
          </div>
        )}
      </div>

      {/* [MODAL] Section Edit Modal */}
      {isEditModalOpen && selectedSection && (
        <SectionEditModal
          section={selectedSection}
          siteData={siteData}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSection(null);
          }}
          onSave={(updatedSection) => {
            // TODO: Implement save functionality
            console.log('Saving section:', updatedSection);
            setIsEditModalOpen(false);
            setSelectedSection(null);
          }}
        />
      )}
    </div>
  );
}

// [COMPONENT] Section Edit Modal
interface SectionEditModalProps {
  section: SiteSection;
  siteData: SiteProject;
  onClose: () => void;
  onSave: (section: SiteSection) => void;
}

function SectionEditModal({ section, siteData, onClose, onSave }: SectionEditModalProps) {
  const [editedSection, setEditedSection] = useState(section);
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});

  // Initialize field values
  useEffect(() => {
    const fieldValues: Record<string, any> = {};
    section.fields.forEach(field => {
      fieldValues[field.field_key] = field.content;
    });
    setEditedFields(fieldValues);
  }, [section]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Section: {section.name}</h3>
        
        <div className="space-y-4">
          {/* Section type info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Type
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              {section.section_type}
            </div>
          </div>

          {/* Section fields */}
          {section.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.field_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              
              {field.field_type === 'text' || field.field_type === 'string' ? (
                <input
                  type="text"
                  value={editedFields[field.field_key] || ''}
                  onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : field.field_type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={editedFields[field.field_key] || ''}
                  onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : field.field_type === 'image' ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={editedFields[field.field_key] || ''}
                    onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editedFields[field.field_key] && (
                    <img
                      src={editedFields[field.field_key]}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
                  {JSON.stringify(field.content)}
                </div>
              )}
            </div>
          ))}

          {/* Section status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="section-active"
              checked={editedSection.is_active}
              onChange={(e) => setEditedSection({...editedSection, is_active: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="section-active" className="text-sm text-gray-700">
              Section is active
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Update section with new field values
              const updatedSection = {
                ...editedSection,
                fields: section.fields.map(field => ({
                  ...field,
                  content: editedFields[field.field_key] || field.content
                }))
              };
              onSave(updatedSection);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}