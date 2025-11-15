// [ADMIN] Templates overview page
import Link from "next/link";
import { cookies } from "next/headers";
import type { AdminSiteTemplate, AdminTemplate } from "@/types/admin";

// [TEMPLAB] Template preview URL mapping
function getPreviewUrl(templateKey: string): string | null {
  const previewMapping: Record<string, string> = {
    "restaurant-modern": "/sites/marys-restaurant",
    "auto-garage-modern": "/sites/oficina-paulo-calibra", 
    "jcw-main": "/sites/just-code-works",
  };
  
  return previewMapping[templateKey] || null;
}

async function fetchAdminSiteTemplates(): Promise<AdminSiteTemplate[]> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    throw new Error("No session found");
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  const res = await fetch(`http://localhost:8000/api/admin/templates/`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load admin site templates");
  }

  return res.json();
}

async function fetchAdminTemplates(): Promise<AdminTemplate[]> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    throw new Error("No session found");
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  const res = await fetch(`http://localhost:8000/api/admin/templates/internal/`, {
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load admin internal templates");
  }

  return res.json();
}

export default async function AdminTemplatesPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  
  let siteTemplates: AdminSiteTemplate[] = [];
  let internalTemplates: AdminTemplate[] = [];
  let error: string | null = null;

  try {
    [siteTemplates, internalTemplates] = await Promise.all([
      fetchAdminSiteTemplates(),
      fetchAdminTemplates(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load templates";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-sm text-slate-500">Error loading templates</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="text-sm text-slate-500">
          Manage and inspect available site templates and internal JCW templates.
        </p>
      </div>

      {/* Site Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Site Templates</h2>
        <div className="rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Key</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Sites Using</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {siteTemplates.map((template) => (
                <tr key={template.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-slate-500">{template.type}</div>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">
                    {template.key}
                  </td>
                  <td className="px-4 py-2 text-xs">{template.category || "—"}</td>
                  <td className="px-4 py-2 text-xs">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      template.status === "published"
                        ? "bg-green-100 text-green-800"
                        : template.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      template.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {template.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {template.site_count}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {new Date(template.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      {/* [TEMPLAB] Preview template link */}
                      {getPreviewUrl(template.key) && (
                        <a
                          href={getPreviewUrl(template.key)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-orange-600 hover:underline"
                        >
                          Preview →
                        </a>
                      )}
                      <Link
                        href={`/${locale}/admin/templates/${template.key}`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {siteTemplates.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No site templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Internal Templates</h2>
        <div className="rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Complexity</th>
                <th className="px-4 py-2">Pages</th>
                <th className="px-4 py-2">Features</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {internalTemplates.map((template) => (
                <tr key={template.id} className="border-t">
                  <td className="px-4 py-2">
                    <div className="font-medium">{template.name}</div>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">
                    {template.slug}
                  </td>
                  <td className="px-4 py-2 text-xs">{template.category}</td>
                  <td className="px-4 py-2 text-xs">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      template.complexity === "starter"
                        ? "bg-green-100 text-green-800"
                        : template.complexity === "standard"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {template.complexity}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">{template.estimated_pages}</td>
                  <td className="px-4 py-2 text-xs">
                    <div className="flex gap-1">
                      {template.has_store && (
                        <span className="inline-flex px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          Store
                        </span>
                      )}
                      {template.has_blog && (
                        <span className="inline-flex px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          Blog
                        </span>
                      )}
                      {template.has_booking && (
                        <span className="inline-flex px-1 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          Booking
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {template.short_description && template.short_description.length > 60
                      ? template.short_description.substring(0, 60) + "..."
                      : template.short_description || "—"}
                  </td>
                </tr>
              ))}
              {internalTemplates.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No internal templates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}