// [SEO] Server-side imports for generateMetadata
import type { Metadata } from "next";
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

// [RMOD] Client component imports
import SitePageClient from './SitePageClient';

const API_BASE = "http://127.0.0.1:8000/api";

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