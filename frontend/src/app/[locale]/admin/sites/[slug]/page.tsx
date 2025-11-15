// [ADMIN] Site Detail using public API endpoint
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { SiteProjectPublic, PageJson, SectionJson } from "@/lib/types/sitePublic";
import SiteDetailClient from "./SiteDetailClient";

async function fetchSitePublicData(slug: string): Promise<SiteProjectPublic | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return null;
  }

  // Use public API endpoint but with auth for staff access verification
  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  const res = await fetch(`http://localhost:8000/api/sites/${slug}/public/`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load site data");
  
  return res.json();
}

export default async function AdminSiteDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  let project: SiteProjectPublic | null = null;
  let error: string | null = null;

  try {
    project = await fetchSitePublicData(slug);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load site";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Site Details</h1>
            <p className="text-sm text-slate-500">Error loading site project</p>
          </div>
          <Link
            href={`/${locale}/admin/sites`}
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to sites
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-slate-500 mb-1">
            <Link href={`/${locale}/admin`} className="hover:underline">Admin Panel</Link>
            {" / "}
            <Link href={`/${locale}/admin/sites`} className="hover:underline">Sites</Link>
            {" / "}{project.name}
          </nav>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Slug: <span className="font-mono">{project.slug}</span></span>
            <span>•</span>
            <span>Template: <span className="font-mono">{project.site_template_key || "None"}</span></span>
            <span>•</span>
            <span>Pages: {project.pages.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/sites/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            View live site
          </Link>
          <Link
            href={`http://127.0.0.1:8000/admin/sites/siteproject/${project.id}/change/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg"
          >
            Open in Django admin
          </Link>
        </div>
      </div>

      {/* Main content */}
      <SiteDetailClient project={project} locale={locale} />
    </div>
  );
}