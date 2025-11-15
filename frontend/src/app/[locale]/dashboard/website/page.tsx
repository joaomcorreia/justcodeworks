"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// [RMOD]
import { RestaurantModernPage } from "@/components/templates/restaurant-modern/Page";
import type { SiteProjectPublic, PageJson, SectionJson, PageSeoUpdatePayload, SectionContentUpdatePayload } from "@/lib/types/sitePublic";
// [SEO]
import { PageSeoPanel } from "@/components/seo/PageSeoPanel";
import { updatePageSeo } from "@/lib/api/pages";
// [CONTENT]
import { updateSectionContent } from "@/lib/api/sections";

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
  const [siteData, setSiteData] = useState<SiteProjectPublic | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  
  // For now, use Mary's Restaurant slug as example
  const projectSlug = "marys-restaurant";
  
  // Fetch site data - unified for all sections
  const fetchSiteData = async () => {
    try {
      setSiteLoading(true);
      setSiteError(null);
      
      const response = await fetch(`http://127.0.0.1:8000/api/sites/${projectSlug}/public/`);
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
  
  useEffect(() => {
    fetchSiteData();
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

  // SEO save handler
  const handleSeoSave = async (payload: any) => {
    const selectedPage = siteData?.pages?.find(p => p.slug === currentPageSlug);
    if (!selectedPage) return;
    
    await updatePageSeo(selectedPage.id, payload);
    // Refresh site data to show updated SEO values
    await fetchSiteData();
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
  const selectedPage = siteData.pages?.find(p => p.slug === currentPageSlug);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Website Editor</h1>
          <p className="text-sm text-slate-600">
            Edit your website pages and preview changes in real-time.
          </p>
        </div>

        {/* SEO Panel - Top Priority */}
        <section className="mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <header className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Page SEO Settings</h2>
              <p className="text-sm text-slate-600">
                Currently editing: <span className="font-medium">{selectedPage?.title || currentPageSlug}</span>
              </p>
            </header>
            
            {selectedPage ? (
              <PageSeoPanel
                page={selectedPage}
                isAdmin={user?.is_staff === true}
                onSave={handleSeoSave}
              />
            ) : (
              <div className="text-center py-8 text-slate-500">
                Select a page to edit its SEO settings.
              </div>
            )}
          </div>
        </section>

        {/* Main editing area - Website Preview */}
        <div className="max-w-7xl mx-auto">
          {/* Preview Area - Full Width */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-slate-900">Website Preview</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Editing:</span>
                  <select
                    value={currentPageSlug}
                    onChange={(e) => setCurrentPageSlug(e.target.value)}
                    className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {siteData.pages.map((page) => (
                      <option key={page.slug} value={page.slug}>
                        {page.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
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
                  className="inline-flex items-center px-3 py-1 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Live ↗
                </a>
              </div>
            </div>
            
            <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-4">
              <div 
                className="w-full overflow-hidden rounded-lg border border-slate-300 bg-white shadow-lg transition-all duration-300"
                style={{
                  width: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                  maxWidth: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                  height: previewMode === 'desktop' ? '1200px' : `${Math.min(currentModeInfo.height, 1200)}px`,
                  margin: previewMode !== 'desktop' ? '0 auto' : '0',
                }}
              >
                  {siteData.site_template_key === "restaurant-modern" ? (
                    <div className="h-full overflow-y-auto">
                      <RestaurantModernPage
                        project={siteData}
                        mode="dashboard"
                        currentPageSlug={currentPageSlug}
                        onNavigatePage={handleNavigatePage}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      <div className="text-center">
                        <svg className="w-12 h-12 mb-3 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p className="mb-1">Template not implemented</p>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {siteData.site_template_key}
                        </code>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}