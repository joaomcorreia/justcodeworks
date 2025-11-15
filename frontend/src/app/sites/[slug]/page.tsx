import type { Metadata } from "next";
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
  params: { slug: string };
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

export default function SitePage({
  params,
}: {
  params: { slug: string };
}) {
  return <SitePageClient slug={params.slug} />;
}