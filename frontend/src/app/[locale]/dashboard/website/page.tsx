"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// [RMOD]
import { useSitePublic } from "@/hooks/useSitePublic";
import { RestaurantModernPage } from "@/components/templates/restaurant-modern/Page";
import type { SiteProjectPublic } from "@/lib/types/sitePublic";

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

// [RMOD] Website Preview Section Component
function WebsitePreviewSection() {
  // For now, use Mary's Restaurant slug as example
  // In production, this would come from the current user's project
  const projectSlug = "marys-restaurant";
  
  // [RESPONSIVE] Preview mode state
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const currentModeInfo = PREVIEW_MODES[previewMode];
  
  const {
    data: previewSite,
    loading: previewLoading,
    error: previewError,
  } = useSitePublic(projectSlug);

  return (
    <section className="mt-8">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Website Preview</h2>
        {projectSlug && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Slug: <code className="bg-slate-100 px-1 rounded">{projectSlug}</code>
            </span>
            <a
              href={`/en/sites/${projectSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              View Live Site ↗
            </a>
          </div>
        )}
      </header>

      {/* [RESPONSIVE] Preview mode controls */}
      <div className="mb-4 flex items-center justify-between">
        <PreviewModeSwitch 
          currentMode={previewMode} 
          onModeChange={setPreviewMode} 
        />
        <div className="text-xs text-slate-500">
          Preview: {currentModeInfo.name} ({currentModeInfo.description})
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        {!projectSlug ? (
          <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
            No project configured
          </div>
        ) : previewLoading ? (
          <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Loading preview…
            </div>
          </div>
        ) : previewError || !previewSite ? (
          <div className="flex h-[320px] flex-col items-center justify-center text-sm text-slate-400">
            <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="mb-1">Preview unavailable</span>
            <span className="text-xs text-slate-400">
              {previewError || "Check if this site is active and has pages configured"}
            </span>
          </div>
        ) : previewSite.pages.length === 0 ? (
          <div className="flex h-[320px] flex-col items-center justify-center text-sm text-slate-400">
            <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="mb-1">No pages configured yet</span>
            <span className="text-xs text-slate-400">
              Add at least one page and some sections in the admin
            </span>
          </div>
        ) : (
          <div className="flex justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-4">
            {/* [RESPONSIVE] Device-specific preview container */}
            <div 
              className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-lg transition-all duration-300"
              style={{
                width: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                maxWidth: previewMode === 'desktop' ? '100%' : `${currentModeInfo.width}px`,
                height: previewMode === 'desktop' ? '640px' : `${Math.min(currentModeInfo.height, 640)}px`,
              }}
            >
              {/* [RMOD] Use same renderer as public view, but in preview mode */}
              {previewSite.site_template_key === "restaurant-modern" ? (
                <div className="h-full overflow-y-auto">
                  <RestaurantModernPage
                    project={previewSite}
                    mode="preview"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mb-3 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="mb-1">Template not implemented for preview</p>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {previewSite.site_template_key}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// [JCW] Dashboard website page
export default function WebsitePage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Website Management</h1>
          <p className="text-sm text-slate-600">
            Manage your website content, pages, and structure.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pages Management */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Pages</h3>
            <p className="mb-4 text-sm text-slate-600">
              Create and manage your website pages.
            </p>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Manage Pages
            </button>
          </div>

          {/* Content Management */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Content</h3>
            <p className="mb-4 text-sm text-slate-600">
              Edit text, images, and media content.
            </p>
            <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              Edit Content
            </button>
          </div>

          {/* Navigation Management */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Navigation</h3>
            <p className="mb-4 text-sm text-slate-600">
              Configure menus and site navigation.
            </p>
            <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
              Edit Navigation
            </button>
          </div>
        </div>

        {/* Website Preview */}
        <WebsitePreviewSection />
      </div>
    </div>
  );
}