'use client';

import { useEffect, useState } from 'react';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';
import { RestaurantModernPage } from '@/components/templates/restaurant-modern/Page';

const API_BASE = "http://127.0.0.1:8000/api";

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

  // Route to appropriate template renderer
  if (siteData.site_template_key === 'restaurant-modern') {
    return <RestaurantModernPage project={siteData} mode="public" />;
  }

  // Template not supported yet - show JSON for debugging
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{siteData.name}</h1>
          <p className="text-slate-600 mb-4">Template: {siteData.site_template_key}</p>
          <pre className="bg-slate-900 text-green-400 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(siteData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}