"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// [RMOD]
import { RestaurantModernPage } from "@/components/templates/restaurant-modern/Page";
import TireCenterPremiumRenderer from "@/app/sites/[slug]/render-tire-center-premium";
import type { SiteProjectPublic, PageJson, SectionJson, PageSeoUpdatePayload, SectionContentUpdatePayload } from "@/lib/types/sitePublic";
// [SEO]
import { PageSeoPanel } from "@/components/seo/PageSeoPanel";
import { updatePageSeo } from "@/lib/api/pages";
// [CONTENT]
import { updateSectionContent } from "@/lib/api/sections";
// [JCW] Builder v1 - Structure Panel
import { WebsiteStructurePanel } from "@/components/jcw/builder/WebsiteStructurePanel";
// [JCW] Builder v2 - Field Editor
import { SectionFieldEditor } from "@/components/jcw/builder/SectionFieldEditor";

type Props = {
  params: { locale: string };
};

// [RESPONSIVE] Preview modes for device simulation
type PreviewMode = 'desktop' | 'tablet' | 'mobile';

interface PreviewModeInfo {
  name: string;
  icon: JSX.Element;
  width: number;
  height: number;
  description: string;
}

const PREVIEW_MODES: Record<PreviewMode, PreviewModeInfo> = {
  desktop: {
    name: 'Desktop',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    width: 1920,
    height: 1080,
    description: '1920 × 1080'
  },
  tablet: {
    name: 'Tablet',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
      </svg>
    ),
    width: 768,
    height: 1024,
    description: '768 × 1024'
  },
  mobile: {
    name: 'Mobile',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    width: 375,
    height: 667,
    description: '375 × 667'
  }
};

// [RESPONSIVE] Preview mode switcher component
function PreviewModeSwitch({ 
  currentMode, 
  onModeChange 
}: { 
  currentMode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
      {(Object.keys(PREVIEW_MODES) as PreviewMode[]).map((mode) => {
        const modeInfo = PREVIEW_MODES[mode];
        const isActive = currentMode === mode;
        
        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`
              flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all
              ${isActive 
                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
            title={`${modeInfo.name} (${modeInfo.description})`}
          >
            {modeInfo.icon}
            <span className="hidden sm:inline">{modeInfo.name}</span>
            <span className="text-xs text-slate-500 hidden md:inline">
              {modeInfo.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}



// [JCW] Dashboard website page
export default function WebsitePage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Unified state management for all sections
  const [currentPageSlug, setCurrentPageSlug] = useState("home");
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
  const [siteData, setSiteData] = useState<SiteProjectPublic | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  
  // Dynamically determine user's site - get first site owned by logged-in user
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [userSites, setUserSites] = useState<any[]>([]);
  
  // Real-time editing state
  const [liveFieldUpdates, setLiveFieldUpdates] = useState<Record<string, Record<string, string>>>({});
  
  // SEO panel state
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'seo'>('content');
  const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);
  
  // Fetch user's sites and determine which one to show
  const fetchUserSites = async () => {
    if (!user) return;
    
    try {
      // Fetch user's projects via authenticated API - correct endpoint is /api/projects/
      const response = await fetch("http://localhost:8000/api/projects/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load user projects: ${response.status}`);
      }
      
      const projects = await response.json();
      setUserSites(projects);
      
      // Select the first project (prioritize Joe's Tire Center if available)
      if (projects.length > 0) {
        const joesSite = projects.find((project: any) => project.slug === "joes-garage");
        const selectedProject = joesSite || projects[0];
        setProjectSlug(selectedProject.slug);
      } else {
        setSiteError("No websites found for your account");
        setSiteLoading(false);
      }
    } catch (err) {
      setSiteError(err instanceof Error ? err.message : "Failed to load user projects");
      setSiteLoading(false);
    }
  };

  // Fetch site data - unified for all sections
  const fetchSiteData = async () => {
    if (!projectSlug) return;
    
    try {
      setSiteLoading(true);
      setSiteError(null);
      
      const response = await fetch(`http://localhost:8000/api/sites/${projectSlug}/public/`);
      if (!response.ok) {
        throw new Error(`Failed to load site: ${response.status}`);
      }
      
      const data = await response.json();
      setSiteData(data);
    } catch (err) {
      setSiteError(err instanceof Error ? err.message : "Failed to load site data");
    } finally {
      setSiteLoading(false);
    }
  };
  
  // First, get user's sites when user is loaded
  useEffect(() => {
    if (user && !isLoading) {
      fetchUserSites();
    }
  }, [user, isLoading]);

  // Then, fetch site data when projectSlug is determined
  useEffect(() => {
    if (projectSlug) {
      fetchSiteData();
    }
  }, [projectSlug]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

  // Navigation callback for preview clicks
  const handleNavigatePage = (pageSlug: string) => {
    setCurrentPageSlug(pageSlug);
  };

  // Create live site data that includes real-time field updates
  const liveSiteData = siteData ? {
    ...siteData,
    pages: siteData.pages?.map(page => ({
      ...page,
      sections: page.sections?.map(section => {
        const liveUpdates = liveFieldUpdates[section.id.toString()];
        if (liveUpdates) {
          return {
            ...section,
            fields: section.fields?.map(field => ({
              ...field,
              value: liveUpdates[field.key] ?? field.value
            }))
          };
        }
        return section;
      })
    }))
  } : null;

  // Get selected section object from live data
  const selectedSection = selectedSectionId ? 
    liveSiteData?.pages
      ?.flatMap(p => p.sections || [])
      ?.find(s => s.id.toString() === selectedSectionId) 
    : null;

  // Get current page object for SEO editing
  const selectedPage = liveSiteData?.pages?.find(p => p.slug === currentPageSlug);

  // Handle real-time field changes for live preview
  const handleFieldChange = (sectionId: string, fieldKey: string, value: string) => {
    setLiveFieldUpdates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldKey]: value
      }
    }));
  };

  // Handle field editor save - refresh preview
  const handleFieldSave = () => {
    setPreviewRefreshKey(prev => prev + 1);
    // Clear live updates since they're now saved
    setLiveFieldUpdates({});
    // Optionally refetch site data to keep structure panel in sync
    fetchSiteData();
  };

  // Handle SEO save
  const handleSeoSave = async (payload: PageSeoUpdatePayload) => {
    if (!selectedPage?.id) {
      throw new Error("No page selected");
    }
    
    await updatePageSeo(selectedPage.id, payload);
    // Refresh site data to get updated SEO
    fetchSiteData();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-sm text-slate-600">Loading website...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (siteError || !siteData) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-red-600">Error loading website data: {siteError || "Unknown error"}</div>
          </div>
        </div>
      </div>
    );
  }

  const currentModeInfo = PREVIEW_MODES[previewMode];

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Website Builder</h1>
            <p className="text-sm text-slate-600">
              Editing: <span className="font-medium">{siteData.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Site Switcher (if user has multiple sites) */}
            {userSites.length > 1 && (
              <select
                value={projectSlug || ""}
                onChange={(e) => setProjectSlug(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                {userSites.map((site: any) => (
                  <option key={site.slug} value={site.slug}>
                    {site.name}
                  </option>
                ))}
              </select>
            )}
            
            {/* Device Mode Controls */}
            <PreviewModeSwitch 
              currentMode={previewMode} 
              onModeChange={setPreviewMode} 
            />
            
            {/* Quick Actions */}
            <a
              href={`/sites/${projectSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Live ↗
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Structure Panel */}
        <div className="w-80 flex-shrink-0">
          <WebsiteStructurePanel
            project={siteData}
            currentPageSlug={currentPageSlug}
            selectedSectionId={selectedSectionId}
            onPageSelect={setCurrentPageSlug}
            onSectionSelect={setSelectedSectionId}
          />
        </div>

        {/* Right Area - Editor + Preview */}
        <div className="flex-1 flex flex-col bg-slate-100">
          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-900">
                    Editing: {siteData.name}
                  </span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600 capitalize">
                  {currentPageSlug} page
                </span>
                {selectedSection && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-600">
                      {selectedSection.section_type || 'Section'} #{selectedSection.order}
                    </span>
                  </>
                )}
              </div>
              
              <div className="text-xs text-slate-500">
                {previewMode === 'desktop' ? 'Desktop View' : `${currentModeInfo.name} (${currentModeInfo.description})`}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Collapsible Editor Panel */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200">
              {/* Header with Toggle Button */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditorPanelOpen(!isEditorPanelOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isEditorPanelOpen ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{isEditorPanelOpen ? 'Hide' : 'Show'} Editor</span>
                  </button>
                  <div className="text-xs text-slate-500">
                    {selectedSection && activeEditorTab === 'content' ? 
                      `Editing: ${selectedSection.internal_name}` : 
                      activeEditorTab === 'seo' ? 
                      `SEO: ${currentPageSlug} page` :
                      'Select a section or switch to SEO tab'
                    }
                  </div>
                </div>
                
                {isEditorPanelOpen && (
                  <div className="flex">
                    <button
                      onClick={() => setActiveEditorTab('content')}
                      className={`px-3 py-1 text-xs font-medium rounded-l-md transition-colors ${
                        activeEditorTab === 'content'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setActiveEditorTab('seo')}
                      className={`px-3 py-1 text-xs font-medium rounded-r-md transition-colors ${
                        activeEditorTab === 'seo'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      SEO
                    </button>
                  </div>
                )}
              </div>
              
              {/* Collapsible Tab Content */}
              {isEditorPanelOpen && (
                <div className="p-4 max-h-80 overflow-y-auto">
                  {activeEditorTab === 'content' ? (
                    <SectionFieldEditor 
                      section={selectedSection} 
                      onSave={handleFieldSave}
                      onFieldChange={handleFieldChange}
                    />
                  ) : (
                    selectedPage && (
                      <PageSeoPanel
                        page={selectedPage}
                        isAdmin={true}
                        onSave={handleSeoSave}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* Preview Area - Full Width Below */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="flex justify-center">
                <div 
                  key={previewRefreshKey}
                  className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-lg transition-all duration-300"
                  style={{
                    width: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                    maxWidth: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                    height: previewMode === 'desktop' ? '800px' : `${Math.min(currentModeInfo.height, 800)}px`,
                    minHeight: '600px',
                  }}
                >
                  {liveSiteData?.site_template_key === "restaurant-modern" ? (
                    <div className="h-full overflow-y-auto">
                      <RestaurantModernPage
                        key={previewRefreshKey}
                        project={liveSiteData}
                        mode="dashboard"
                        currentPageSlug={currentPageSlug}
                        onNavigatePage={handleNavigatePage}
                      />
                    </div>
                  ) : liveSiteData?.site_template_key === "tire-center-premium" ? (
                    <div className="h-full overflow-y-auto">
                      <TireCenterPremiumRenderer
                        key={previewRefreshKey}
                        site={liveSiteData}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <div className="text-center">
                        <svg className="w-12 h-12 mb-3 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p className="mb-1 text-sm">Template not implemented</p>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {liveSiteData?.site_template_key || 'unknown'}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Continue to Print Materials Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => router.push(`/${params.locale}/dashboard/printing`)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Everything looks good – continue to Print Studio →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}