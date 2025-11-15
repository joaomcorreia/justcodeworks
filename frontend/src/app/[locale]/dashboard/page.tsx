"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n";

interface DashboardPageProps {
  params: { locale: Locale };
}

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

interface UserProject {
  id: string;
  name: string;
  template_key: string;
  template_name: string;
  pages?: any[];
}

// [JCW] Dashboard block components
function LivePreviewBlock({ user, locale }: { user: any; locale: string }) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsitePreview = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/website-preview/', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setPreviewData(data);
        } else {
          throw new Error('Failed to load website preview');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsitePreview();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Website Preview
        </h3>
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">Failed to load preview</p>
        </div>
      </div>
    );
  }

  const currentProject = previewData?.projects?.[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Website Preview
      </h3>
      
      {currentProject && currentProject.pages.length > 0 ? (
        <div>
          <div className="mb-3">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">
              {currentProject.name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Template: {currentProject.template_name} • {currentProject.pages_count} pages
            </p>
          </div>
          
          {/* Show actual content preview */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-600 p-4 min-h-32">
            {currentProject.pages.map((page: any, pageIndex: number) => (
              <div key={page.id} className={pageIndex > 0 ? 'mt-4 pt-4 border-t border-slate-200 dark:border-slate-600' : ''}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    📄 {page.title}
                  </h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    page.is_published 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {page.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                {/* Show content preview from sections */}
                {Object.entries(page.preview_content).map(([sectionId, content]: [string, any]) => (
                  <div key={sectionId} className="mb-3">
                    {content.title && (
                      <h6 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                        {String(content.title).slice(0, 50)}
                      </h6>
                    )}
                    {content.subtitle && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {String(content.subtitle).slice(0, 100)}
                      </p>
                    )}
                    {(content.description || content.content) && (
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {String(content.description || content.content).slice(0, 80) + 
                         (String(content.description || content.content).length > 80 ? '...' : '')}
                      </p>
                    )}
                  </div>
                ))}
                
                {Object.keys(page.preview_content).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No content yet</p>
                )}
              </div>
            ))}
            
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
              <button className="w-full px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                🌐 View Live Website
              </button>
            </div>
          </div>
        </div>
      ) : currentProject ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {currentProject.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            No pages created yet
          </p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
            Create First Page
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🚀</div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Ready to Start
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create your first website
          </p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
            Get Started
          </button>
        </div>
      )}
    </div>
  );
}

function NextStepsBlock({ user, locale }: { user: any; locale: string }) {
  const router = useRouter();
  
  const steps = [
    {
      id: 1,
      title: 'Set up your website',
      description: 'Add pages and customize content',
      action: 'Go to Website',
      route: `/${locale}/dashboard/website`,
      completed: false
    },
    {
      id: 2,  
      title: 'Choose your template',
      description: 'Pick a design that fits your brand',
      action: 'Browse Templates',
      route: `/${locale}/dashboard/templates`,
      completed: false
    },
    {
      id: 3,
      title: 'Update settings',
      description: 'Configure your account preferences',
      action: 'Open Settings', 
      route: `/${locale}/dashboard/settings`,
      completed: false
    }
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Next Steps
      </h3>
      
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
            <button
              onClick={() => router.push(step.route)}
              className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
            >
              {step.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStatsBlock({ user }: { user: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Website Status</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Active</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
            <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Pages</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Ready to create</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
            <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Print Orders</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">0 pending</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
            <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Account</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{user.isStaff ? 'Staff' : 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// [JCW] Main dashboard page with DashboardTemplate system
export default function DashboardOverviewPage({ params }: DashboardPageProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [template, setTemplate] = useState<DashboardTemplate | null>(null);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

  useEffect(() => {
    if (user) {
      const fetchTemplate = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/dashboard/template/', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            setTemplate(data);
          } else {
            const errorText = await response.text();
            const cleanError = errorText.replace(/<[^>]*>/g, '').slice(0, 100);
            throw new Error(`Failed to load dashboard template (${response.status}): ${cleanError}`);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setTemplateLoading(false);
        }
      };

      fetchTemplate();
    }
  }, [user]);

  if (isLoading || templateLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sm text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Dashboard Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800">No Dashboard Template</h3>
          <p className="text-yellow-600">No dashboard template is configured.</p>
        </div>
      </div>
    );
  }

  const renderBlock = (block: DashboardBlock) => {
    if (!block.is_active) return null;

    switch (block.key) {
      case 'live-preview':
        return <LivePreviewBlock key={block.id} user={user} locale={params.locale} />;
      
      case 'next-steps':
        return <NextStepsBlock key={block.id} user={user} locale={params.locale} />;
        
      case 'upgrade-banner':
        // This block is typically inactive, but if active, show upgrade prompt
        return (
          <div key={block.id} className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
            <p className="text-blue-100 mb-4">{block.description}</p>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50">
              Upgrade Now
            </button>
          </div>
        );
        
      default:
        // Generic block renderer
        return (
          <div key={block.id} className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {String(block.title || 'Untitled Block')}
            </h3>
            {block.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {String(block.description)}
              </p>
            )}
          </div>
        );
    }
  };

  const mainBlocks = template.blocks
    .filter(block => block.region === 'main' && block.is_active)
    .sort((a, b) => a.order - b.order);

  const sidebarBlocks = template.blocks
    .filter(block => block.region === 'sidebar' && block.is_active)  
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {template.name}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Welcome back, {user.firstName || user.email}! Here's your dashboard overview.
        </p>
      </div>

      {/* Quick Stats - Always show */}
      <QuickStatsBlock user={user} />

      {/* Dynamic Template Blocks */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {mainBlocks.map(renderBlock)}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {sidebarBlocks.map(renderBlock)}
        </div>
      </div>


    </div>
  );
}