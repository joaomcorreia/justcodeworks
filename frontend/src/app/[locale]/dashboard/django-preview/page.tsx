"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

// [JCW] Django Preview - Visual display of Django admin templates

interface DashboardTemplate {
  id: number;
  key: string;
  name: string;
  description: string;
  is_default_for_tenants: boolean;
  blocks: DashboardBlock[];
}

interface DashboardBlock {
  id: number;
  key: string;
  title: string;
  description: string;
  region: string;
  order: number;
  is_active: boolean;
  target_route: string;
}

export default function DjangoPreviewPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // [AUTH] Redirect if not authenticated or not staff
    if (!isAuthenticated) {
      router.push('/en/login');
      return;
    }
    
    if (!user?.isStaff) {
      router.push('/en/dashboard');
      return;
    }

    // Fetch dashboard templates from API
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard-templates/', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard templates');
        }
        
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [isAuthenticated, user?.isStaff, router]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-slate-600">Loading dashboard templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* [JCW] Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Django Preview</h1>
        <p className="mt-2 text-slate-600">
          Visual preview of Django admin templates and configurations
        </p>
        <div className="mt-4 text-sm text-slate-500">
          Admin URL: <code className="bg-slate-100 px-2 py-1 rounded">http://127.0.0.1:8000/admin/sites/dashboardtemplate/</code>
        </div>
      </div>

      {/* [JCW] Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Template Header */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {template.name}
                  </h3>
                  <div className="mt-1 text-sm font-mono text-slate-500">
                    Key: {template.key}
                  </div>
                </div>
                {template.is_default_for_tenants && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
              </div>
              
              {template.description && (
                <p className="mt-3 text-sm text-slate-600">
                  {template.description}
                </p>
              )}
            </div>

            {/* Template Blocks */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-900">
                  Blocks ({template.blocks.length})
                </h4>
              </div>
              
              {template.blocks.length > 0 ? (
                <div className="space-y-2">
                  {template.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div
                        key={block.id}
                        className={`p-3 rounded-lg border text-sm ${
                          block.is_active
                            ? 'bg-green-50 border-green-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-slate-900">
                            {block.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            #{block.order}
                          </div>
                        </div>
                        
                        <div className="mt-1 text-xs font-mono text-slate-600">
                          {block.key} ({block.region})
                        </div>
                        
                        {block.description && (
                          <div className="mt-2 text-xs text-slate-600">
                            {block.description}
                          </div>
                        )}
                        
                        {block.target_route && (
                          <div className="mt-2 text-xs font-mono text-blue-600">
                            → {block.target_route}
                          </div>
                        )}
                        
                        {!block.is_active && (
                          <div className="mt-2 text-xs text-slate-500">
                            (Inactive)
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center py-4">
                  No blocks configured
                </div>
              )}
            </div>

            {/* Template Actions */}
            <div className="p-4 pt-0">
              <a
                href={`http://127.0.0.1:8000/admin/sites/dashboardtemplate/${template.id}/change/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Edit in Django Admin
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* [JCW] Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No dashboard templates</h3>
          <p className="mt-1 text-sm text-slate-500">
            No dashboard templates found. Create one in the Django admin.
          </p>
          <div className="mt-6">
            <a
              href="http://127.0.0.1:8000/admin/sites/dashboardtemplate/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Template in Django
            </a>
          </div>
        </div>
      )}

      {/* [JCW] Admin Links Section */}
      <div className="mt-12 p-6 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          Django Admin Quick Links
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="http://127.0.0.1:8000/admin/sites/dashboardtemplate/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow text-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="font-medium text-slate-900">Dashboard Templates</div>
              <div className="text-slate-500">Manage dashboard layouts</div>
            </div>
          </a>
          
          <a
            href="http://127.0.0.1:8000/admin/sites/dashboardblock/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow text-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="font-medium text-slate-900">Dashboard Blocks</div>
              <div className="text-slate-500">Manage template blocks</div>
            </div>
          </a>

          <a
            href="http://127.0.0.1:8000/admin/sites/sitetemplate/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow text-sm"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="font-medium text-slate-900">Site Templates</div>
              <div className="text-slate-500">Manage website templates</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}