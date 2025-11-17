'use client';

import { useEffect, useState } from 'react';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';
import RestaurantModernRenderer from './render-restaurant-modern'; // [TEMPLAB] Template-specific renderers
import AutoGarageModernRenderer from './render-auto-garage-modern';
import TireCenterPremiumRenderer from './render-tire-center-premium';
import DefaultRenderer from './render-default';
import JsonDebugView from '@/components/sites/JsonDebugView';

const API_BASE = "http://127.0.0.1:8000/api";

// NOTE: Tenant sites must use theme CSS variables via .site-theme-root and jcw-* classes.
// Do not hard-code hex colors here. Do not change admin/dashboard styling from this file.

// [TEMPLAB] Template-specific renderer routing function
function renderSiteTemplate(project: SiteProjectPublic) {
  const key = project.site_template_key ?? "";
  
  // Check if site has sections data for new Template Lab system
  const hasValidSections = project.pages?.some(page => 
    page.sections && page.sections.length > 0
  );
  
  // Wrap all tenant site content with theme CSS variables
  const content = (() => {
    // If site has sections, use template-specific renderers
    if (hasValidSections) {
      switch (key) {
        case "restaurant-modern":
          return <RestaurantModernRenderer site={project} />;
        case "auto-garage-modern":
          return <AutoGarageModernRenderer site={project} />;
        case "tire-center-premium":
          return <TireCenterPremiumRenderer site={project} />;
        default:
          return <DefaultRenderer site={project} />;
      }
    }
    
    // Fallback for sites without sections data
    return <JsonDebugView project={project} />;
  })();

  // Wrap with theme variables container
  return (
    <div
      className="site-theme-root"
      style={{
        // Theme CSS variables driven by backend SiteProject.theme
        '--jcw-primary': project.theme?.primary_color || '#1D4ED8',
        '--jcw-secondary': project.theme?.secondary_color || '#6366F1', 
        '--jcw-accent': project.theme?.accent_color || '#F97316',
        '--jcw-bg': project.theme?.background_color || '#0B1120',
        '--jcw-text': project.theme?.text_color || '#F9FAFB',
      } as React.CSSProperties}
    >
      {content}
    </div>
  );
}

// Custom hook to fetch public site data
function useSitePublic(slug: string) {
  const [data, setData] = useState<SiteProjectPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE}/sites/${slug}/public/`);
        
        if (!response.ok) {
          throw new Error(`Failed to load site: ${response.status}`);
        }
        
        const siteData = await response.json();
        setData(siteData);
      } catch (err) {
        console.error('Error fetching site data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load site.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [slug]);

  return { data, loading, error };
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading site...</p>
      </div>
    </div>
  );
}

// Error component
function ErrorDisplay({ message, slug }: { message: string; slug: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site Not Found</h1>
          <p className="text-slate-600 mb-4">
            We couldn't find the site you're looking for.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">
            <strong>Site:</strong> <code className="bg-slate-100 px-1 rounded">{slug}</code>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            <strong>Error:</strong> {message}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main client component
export default function SitePageClient({ slug }: { slug: string }) {
  const { data: siteData, loading, error } = useSitePublic(slug);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !siteData) {
    return <ErrorDisplay message={error || 'Site not found'} slug={slug} />;
  }

  // Use template registry to render appropriate component
  return (
    <div className="min-h-screen bg-gray-50">
      {renderSiteTemplate(siteData)}
    </div>
  );
}