// [ADMIN] Site Template Detail page
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { AdminSiteTemplateDetail, AdminTemplateSection } from "@/types/admin";

// [TEMPLAB] Template preview URL mapping
function getPreviewUrl(templateKey: string): string | null {
  const previewMapping: Record<string, string> = {
    "restaurant-modern": "/sites/marys-restaurant",
    "auto-garage-modern": "/sites/oficina-paulo-calibra", 
    "jcw-main": "/sites/just-code-works",
  };
  
  return previewMapping[templateKey] || null;
}

type AdminSiteProject = {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  is_active: boolean;
  created_at: string;
};

async function fetchSiteTemplateByKey(key: string): Promise<AdminSiteTemplateDetail | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return null;
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  const res = await fetch(`http://localhost:8000/api/admin/templates/key/${key}/`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load template details");
  
  return res.json();
}

async function fetchSiteProjectsUsingTemplate(templateKey: string): Promise<AdminSiteProject[]> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return [];
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  try {
    const res = await fetch(`http://localhost:8000/api/admin/site-projects/`, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    const allProjects: AdminSiteProject[] = await res.json();
    
    // Filter projects that use this template - we'd need to extend the API to include site_template_key
    // For now, return all projects and we'll filter client-side if needed
    return allProjects;
  } catch {
    return [];
  }
}

async function fetchTemplateSections(templateKey: string): Promise<AdminTemplateSection[]> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return [];
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  try {
    const res = await fetch(`http://localhost:8000/api/admin/site-templates/${templateKey}/sections/`, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminTemplateDetailPage({
  params,
}: {
  params: { locale: string; key: string };
}) {
  const { locale, key } = params;
  let template: AdminSiteTemplateDetail | null = null;
  let sitesUsingTemplate: AdminSiteProject[] = [];
  let templateSections: AdminTemplateSection[] = [];
  let error: string | null = null;

  try {
    [template, sitesUsingTemplate, templateSections] = await Promise.all([
      fetchSiteTemplateByKey(key),
      fetchSiteProjectsUsingTemplate(key),
      fetchTemplateSections(key),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load template details";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Template Details</h1>
            <p className="text-sm text-slate-500">Error loading template</p>
          </div>
          <Link
            href={`/${locale}/admin/templates`}
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back to templates
          </Link>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!template) {
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
            <Link href={`/${locale}/admin/templates`} className="hover:underline">Templates</Link>
            {" / "}{template.name}
          </nav>
          <h1 className="text-2xl font-semibold">{template.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Key: <span className="font-mono">{template.key}</span></span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              template.status === "published"
                ? "bg-green-100 text-green-700"
                : template.status === "draft"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {template.status}
            </span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              template.is_active 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {template.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* [TEMPLAB] Preview template link */}
          {getPreviewUrl(template.key) && (
            <a
              href={getPreviewUrl(template.key)!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-medium text-orange-600 border border-orange-300 hover:bg-orange-50 rounded-lg"
            >
              Preview Template →
            </a>
          )}
          <Link
            href={`http://127.0.0.1:8000/admin/sites/sitetemplate/${template.id}/change/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg"
          >
            Django Admin
          </Link>
        </div>
      </div>

      {/* Template details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Template info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Template Information</h2>
          
          <div className="rounded-xl border bg-white p-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-600">Description</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {template.description || "No description provided"}
                </dd>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-slate-600">ID</dt>
                  <dd className="mt-1 text-sm font-mono text-slate-900">{template.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">Type</dt>
                  <dd className="mt-1 text-sm text-slate-900">{template.type}</dd>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-slate-600">Category</dt>
                  <dd className="mt-1 text-sm text-slate-900">{template.category || "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">Sections</dt>
                  <dd className="mt-1 text-sm text-slate-900">{template.sections_count}</dd>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-slate-600">Usage Count</dt>
                  <dd className="mt-1 text-sm text-slate-900">{template.usage_count}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">Sites Using</dt>
                  <dd className="mt-1 text-sm text-slate-900">{template.site_count}</dd>
                </div>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-600">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(template.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sites using this template */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Sites Using This Template ({template.site_count})
          </h2>
          
          <div className="rounded-xl border bg-white">
            {template.site_count === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No sites are currently using this template.
              </div>
            ) : (
              <div className="divide-y">
                <div className="px-4 py-3 bg-slate-50 text-xs font-semibold text-slate-500">
                  <div className="grid grid-cols-3 gap-4">
                    <span>Site Name</span>
                    <span>Owner</span>
                    <span>Status</span>
                  </div>
                </div>
                
                {/* Note: We'd need to filter this list by site_template_key on the backend */}
                {sitesUsingTemplate.slice(0, 10).map((site) => (
                  <div key={site.id} className="px-4 py-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <Link
                          href={`/${locale}/admin/sites/${site.slug}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {site.name}
                        </Link>
                      </div>
                      <div className="text-slate-600">{site.owner_email}</div>
                      <div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          site.is_active 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {site.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {template.site_count > 10 && (
                  <div className="px-4 py-3 text-center">
                    <p className="text-sm text-slate-500">
                      Showing 10 of {template.site_count} sites
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Sections */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Template Sections</h2>
        
        <div className="rounded-xl border bg-white">
          {templateSections.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No sections registered yet for this template.
            </div>
          ) : (
            <div className="divide-y">
              <div className="px-4 py-3 bg-slate-50 text-xs font-semibold text-slate-500">
                <div className="grid grid-cols-8 gap-4">
                  <span>Internal Name</span>
                  <span>Code</span>
                  <span>Type</span>
                  <span>Plan</span>
                  <span>Group</span>
                  <span>Variant</span>
                  <span>Default Order</span>
                  <span>Status</span>
                </div>
              </div>
              
              {templateSections.map((section) => (
                <div key={section.id} className="px-4 py-3">
                  <div className="grid grid-cols-8 gap-4 text-sm">
                    <div className="font-medium text-slate-900">
                      {section.internal_name}
                    </div>
                    <div className="font-mono text-xs text-slate-600">
                      {section.code}
                    </div>
                    <div>
                      <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {section.section_type?.replace('_', ' ') || 'other'}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        section.min_plan === 'free' ? 'bg-green-100 text-green-700' :
                        section.min_plan === 'paid' ? 'bg-yellow-100 text-yellow-700' :
                        section.min_plan === 'premium' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {section.min_plan || 'free'}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {section.group || (
                        <span className="text-slate-400 italic">No group</span>
                      )}
                    </div>
                    <div className="text-center text-slate-600">
                      #{section.variant_index}
                    </div>
                    <div className="text-center text-slate-600">
                      {section.default_order}
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        section.is_active 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {section.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  {section.notes && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      {section.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}