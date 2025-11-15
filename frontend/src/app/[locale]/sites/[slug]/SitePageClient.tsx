'use client';

// [RMOD] Client-side component for public site route
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';
import { RestaurantModernPage } from '@/components/templates/restaurant-modern/Page';

const API_BASE = "http://127.0.0.1:8000/api";

// [RMOD] Custom hook to fetch public site data
function useSiteData(slug: string | null) {
  const [data, setData] = useState<SiteProjectPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

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

// [RMOD] Loading component
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

// [RMOD] Error component
function ErrorDisplay({ message, slug }: { message: string; slug: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-slate-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
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

// [RMOD] Template not supported component
function UnsupportedTemplate({ 
  templateKey, 
  siteName 
}: { 
  templateKey: string; 
  siteName: string; 
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-amber-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{siteName}</h1>
          <p className="text-slate-600 mb-4">
            This site uses a template that's not yet supported for public viewing.
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">
            <strong>Template:</strong> <code className="bg-slate-100 px-1 rounded">{templateKey}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

// [RMOD] Main client component
export default function SitePageClient() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: siteData, loading, error } = useSiteData(slug);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !siteData) {
    return <ErrorDisplay message={error || 'Site not found'} slug={slug} />;
  }

  // [RMOD] Route to appropriate template renderer
  if (siteData.site_template_key === 'restaurant-modern') {
    return <RestaurantModernPage project={siteData} mode="public" />;
  }

  // Template not supported yet
  return (
    <UnsupportedTemplate 
      templateKey={siteData.site_template_key} 
      siteName={siteData.name}
    />
  );
}