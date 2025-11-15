// This file is deprecated - use /sites/[slug] instead
export default function DeprecatedSitePage() {
  return null;
}
import type { SiteProjectPublic } from "@/lib/types/sitePublic";
import SitePageClient from "./SitePageClient";

async function fetchSite(slug: string): Promise<SiteProjectPublic | null> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

  try {
    const res = await fetch(`${base}/sites/${slug}/public/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as SiteProjectPublic;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const slug = params.slug;
  const data = await fetchSite(slug);

  if (!data) return { title: slug };

  const pages = data.pages ?? [];
  const home = pages.find((p) => p.slug === "home") ?? pages[0] ?? null;

  const title =
    home?.seo?.meta_title || home?.title || data.name || slug;

  const description = home?.seo?.meta_description || "";

  return {
    title,
    description,
  };
}
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status}`);
    }

    const data: SiteProjectPublic = await response.json();

    // Find home page or first page
    const pages = data.pages || [];
    const homePage = pages.find((p) => p.slug === "home") ?? pages[0] ?? null;

    let title = data.name;
    let description = "";

    if (homePage && homePage.seo) {
      title = homePage.seo.meta_title || homePage.title || data.name;
      description = homePage.seo.meta_description || "";
    }

    return {
      title,
      description,
      // Add robots meta tag based on indexable flag
      robots: homePage?.seo?.indexable !== false ? "index,follow" : "noindex,nofollow",
    };
  } catch (err) {
    console.error('Error generating metadata for site:', slug, err);
    // If anything fails, fallback to project slug
    return {
      title: slug,
    };
  }
}

// [RMOD] Main page component - server component with generateMetadata
export default function SitePage({ params }: { params: { locale: string; slug: string } }) {
  // Delegate rendering to client component
  return <SitePageClient />;
}

// [SEO] Generate dynamic metadata for tenant sites
export async function generateMetadata(
  { params }: { params: { locale: string; slug: string } }
): Promise<Metadata> {
  const slug = params.slug;

  try {
    // Use fetch for server-side API call
    const response = await fetch(`${API_BASE}/sites/${slug}/public/`, {
      // Add cache options for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status}`);
    }

    const data: SiteProjectPublic = await response.json();

    // Find home page or first page
    const pages = data.pages || [];
    const homePage = pages.find((p) => p.slug === "home") ?? pages[0] ?? null;

    let title = data.name;
    let description = "";

    if (homePage && homePage.seo) {
      title = homePage.seo.meta_title || homePage.title || data.name;
      description = homePage.seo.meta_description || "";
    }

    return {
      title,
      description,
      // Add robots meta tag based on indexable flag
      robots: homePage?.seo?.indexable !== false ? "index,follow" : "noindex,nofollow",
    };
  } catch (err) {
    console.error('Error generating metadata for site:', slug, err);
    // If anything fails, fallback to project slug
    return {
      title: slug,
    };
  }
}

// [RMOD] Main page component - server component with generateMetadata
export default function SitePage({ params }: { params: { locale: string; slug: string } }) {
  // Delegate rendering to client component
  return <SitePageClient />;
}
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading site…</h1>
          <p className="text-gray-600 mt-2">Fetching data for "{slug}"</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to load site</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Site slug: "{slug}"</p>
        </div>
      </div>
    );
  }

  // Handle success - render appropriate template or fallback
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No site data</h1>
          <p className="text-gray-600">No data available for site "{slug}"</p>
        </div>
      </div>
    );
  }

  // Find home page (prefer 'home' slug, fallback to first page)
  const homePage = data.pages.find((p) => p.slug === "home") ?? data.pages[0] ?? null;

  if (!homePage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No pages configured</h1>
          <p className="text-gray-600">Site "{data.name}" has no published pages.</p>
        </div>
      </div>
    );
  }

  // Render template-specific components
  if (data.site_template_key === "restaurant-modern") {
    return <RestaurantModernPage project={data} mode="public" />;
  }

  // Fallback for unknown templates - show JSON for now
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Template "{data.site_template_key}" not implemented yet
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Site: {data.name} • Slug: {slug} • Pages: {data.pages.length}
            </p>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Raw JSON Data</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}