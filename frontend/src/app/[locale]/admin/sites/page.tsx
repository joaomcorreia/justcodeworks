// [ADMIN-SITES] Sites Explorer
"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

type AdminSite = {
  id: string;
  name: string;
  slug: string;
  site_template_key: string;
  site_template_name: string | null;
  owner_username: string;
  owner_email: string;
  primary_locale: string;
  is_active: boolean;
  created_at: string;
};

interface AdminSitesPageProps {
  params: { locale: string };
}

export default function AdminSitesPage({ params }: AdminSitesPageProps) {
  const { locale } = params;
  const { user } = useAuth();
  const [sites, setSites] = useState<AdminSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<AdminSite | null>(null);
  const [siteJson, setSiteJson] = useState<any>(null);
  const [jsonLoading, setJsonLoading] = useState(false);

  useEffect(() => {
    if (user?.isStaff) {
      fetchSites();
    } else if (user && !user.isStaff) {
      setError("Access denied. Staff privileges required.");
      setLoading(false);
    }
    // If user is null, keep loading until auth context loads
  }, [user]);

  const fetchSites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:8000/api/admin/sites/", {
        method: "GET",
        credentials: "include", 
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. You need to be logged in as a staff user.");
        } else if (response.status === 401) {
          throw new Error("Please log in to access this page.");
        } else {
          throw new Error(`Failed to fetch sites: ${response.status}`);
        }
      }

      const data = await response.json();
      setSites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  const viewSiteJson = async (site: AdminSite) => {
    try {
      setJsonLoading(true);
      setSelectedSite(site);
      setSiteJson(null);
      
      const response = await fetch(`http://localhost:8000/api/admin/sites/${site.slug}/public/`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied to site data.");
        } else {
          throw new Error(`Failed to fetch site JSON: ${response.status}`);
        }
      }

      const data = await response.json();
      setSiteJson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site JSON");
      setSiteJson(null);
    } finally {
      setJsonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Sites</h1>
          <p className="text-sm text-slate-500">
            Overview of all site projects in Just Code Works.
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-600">Loading sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Sites</h1>
          <p className="text-sm text-slate-500">
            Overview of all site projects in Just Code Works.
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchSites}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Sites Explorer</h1>
          <p className="text-sm text-slate-500">
            Read-only view of all tenant sites in the platform.
          </p>
        </div>
        <button 
          onClick={fetchSites}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sites Table */}
        <div className="rounded-xl border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">All Sites ({sites.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Template</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{site.slug}</div>
                        <div className="text-xs mt-1">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                            site.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {site.is_active ? "Active" : "Inactive"}
                          </span>
                          <span className="ml-2 text-slate-500">
                            {site.primary_locale.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div className="font-medium">{site.owner_username}</div>
                        <div className="text-slate-500">{site.owner_email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div className="font-mono text-blue-600">{site.site_template_key}</div>
                        <div className="text-slate-500">{site.site_template_name || "—"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => viewSiteJson(site)}
                          className="text-xs font-medium text-blue-600 hover:underline text-left"
                          disabled={jsonLoading}
                        >
                          {jsonLoading && selectedSite?.id === site.id ? "Loading..." : "View JSON"}
                        </button>
                        <Link
                          href={`/sites/${site.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-green-600 hover:underline"
                        >
                          Live Site ↗
                        </Link>
                        <Link
                          href={`http://127.0.0.1:8000/admin/sites/siteproject/${site.id}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-600 hover:underline"
                        >
                          Django Admin ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {sites.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                      No sites found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="rounded-xl border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              {selectedSite ? `Site JSON: ${selectedSite.name}` : "Site Inspector"}
            </h2>
            {selectedSite && (
              <p className="text-sm text-slate-500 mt-1">
                Raw site data as served by the public API
              </p>
            )}
          </div>
          <div className="p-4">
            {!selectedSite ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Click "View JSON" on a site to inspect its public API data
              </p>
            ) : jsonLoading ? (
              <p className="text-sm text-gray-600 text-center py-8">
                Loading site data...
              </p>
            ) : siteJson ? (
              <pre className="text-xs bg-gray-50 p-4 rounded border overflow-auto max-h-96">
                {JSON.stringify(siteJson, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-red-600 text-center py-8">
                Failed to load site data
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}