"use client";

import { useState, useEffect } from "react";
import { fetchAdminSiteTemplates, fetchAdminSiteTemplateDetail, fetchTemplateSections } from "@/lib/api";
import type { AdminSiteTemplate, AdminSiteTemplateDetail, TemplateSectionData } from "@/lib/api-types";
import TemplatePreviewScroller from "@/components/admin/TemplatePreviewScroller";  // [TEMPLAB]

export default function AdminWebsiteTemplatesPage() {
  const [templates, setTemplates] = useState<AdminSiteTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<AdminSiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // [PREVIEW] template preview panel
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminSiteTemplateDetail | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  // [TEMPLAB] template sections and page state
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "seo" | "sections" | "assets">("preview");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading admin templates...");
      
      // Check if user is authenticated
      const cookies = document.cookie;
      console.log("🍪 Cookies:", cookies);
      
      // Test authentication status
      console.log("🔍 Checking authentication status...");
      try {
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api'}/auth/me/`, {
          credentials: "include",
        });
        const authData = await authRes.json();
        console.log("👤 Auth status:", authData);
        
        if (!authData.authenticated || !authData.user?.is_staff) {
          console.warn("⚠️ User not authenticated or not staff. Redirect to login may be needed.");
        }
      } catch (authError) {
        console.error("❌ Auth check failed:", authError);
      }
      
      // Get website templates specifically
      console.log("📡 Fetching website templates...");
      const websiteTemplates = await fetchAdminSiteTemplates({ type: "website" });
      console.log("✅ Website templates loaded:", websiteTemplates.length);
      
      // Get all templates for summary stats
      console.log("📡 Fetching all templates...");
      const allTemplatesList = await fetchAdminSiteTemplates();
      console.log("✅ All templates loaded:", allTemplatesList.length);
      
      setTemplates(websiteTemplates);
      setAllTemplates(allTemplatesList);
      
      // [JCW] default to jcw-main template
      const jcwMainTemplate = websiteTemplates.find(t => t.key === 'jcw-main');
      console.log("🎯 Found jcw-main template:", jcwMainTemplate);
      if (jcwMainTemplate && !selectedTemplateId) {
        console.log("🚀 Auto-selecting jcw-main template");
        await handleSelectTemplate(jcwMainTemplate.id);
      }
    } catch (e) {
      console.error("❌ Failed to load admin templates:", e);
      
      // Check if it's an authentication error
      if (e instanceof Response) {
        console.error("📊 Response status:", e.status);
        console.error("📝 Response text:", await e.text());
      }
      
      setTemplates([]);
      setAllTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  // [PREVIEW] select template
  const handleSelectTemplate = async (templateId: number) => {
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null);
      setSelectedTemplate(null);
      setSelectedPageId(null);
      return;
    }

    try {
      setIsPreviewLoading(true);
      setSelectedTemplateId(templateId);
      const detail = await fetchAdminSiteTemplateDetail(templateId);
      setSelectedTemplate(detail);
      
      // [JCW] default homepage selection - for now, use template ID as page ID (TODO: get actual homepage)
      setSelectedPageId(templateId); // TODO: Replace with actual homepage page ID from API
      setActiveTab("preview");
    } catch (e) {
      console.error("Failed to load template detail:", e);
      setSelectedTemplate(null);
      setSelectedPageId(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const hasTemplates = templates.length > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-slate-900">
          Template Management
        </h1>
        <p className="text-sm text-slate-500">
          Create and manage templates for websites, emails, and landing pages.
        </p>
      </div>

      {/* Summary row - use real counts */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total templates" value={allTemplates.length} />
        <SummaryCard
          title="Website templates"
          value={allTemplates.filter((t) => t.type === "website").length}
        />
        <SummaryCard
          title="Email templates"
          value={allTemplates.filter((t) => t.type === "email").length}
        />
        <SummaryCard
          title="Total usage"
          value={allTemplates.reduce((acc, t) => acc + (t.usage_count || 0), 0)}
        />
      </div>

      {/* Filters / actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>All Categories</option>
          <option>Portfolio</option>
          <option>Business</option>
          <option>Blog</option>
          <option>E-commerce</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span className="mr-2">+</span>
          New Template
        </button>
      </div>

      {/* [PREVIEW] template preview panel */}
      <TemplatePreviewPanel 
        selectedTemplate={selectedTemplate}
        selectedPageId={selectedPageId}
        isLoading={isPreviewLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Templates grid */}
      <div className="rounded-2xl">
        {hasTemplates ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((tpl) => (
              <TemplateCard 
                key={tpl.id} 
                template={tpl} 
                onPreview={handleSelectTemplate}
                isSelected={selectedTemplateId === tpl.id}
              />
            ))}}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed bg-slate-50/60 text-center text-xs text-slate-500">
            No website templates yet. Once you add templates in the admin, they will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function TemplateCard({ 
  template, 
  onPreview, 
  isSelected 
}: { 
  template: AdminSiteTemplate; 
  onPreview: (id: number) => void;
  isSelected: boolean;
}) {
  const updated = template.updated_at
    ? new Date(template.updated_at).toLocaleDateString()
    : null;

  const statusLabel =
    template.status === "published"
      ? "published"
      : template.status === "draft"
      ? "draft"
      : "archived";

  const statusColor =
    template.status === "published"
      ? "text-emerald-600"
      : template.status === "draft"
      ? "text-amber-500"
      : "text-slate-500";

  return (
    <div className={`flex flex-col rounded-2xl border bg-white transition-all cursor-pointer ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}
    onClick={() => onPreview(template.id)}>
      {/* Card top (template preview with auto-scroll) */}
      <div className="relative">
        <TemplatePreviewScroller 
          previewImageUrl={template.preview_image || `/template-previews/${template.key}-01.jpg`}  // [TEMPLAB] template card preview with local fallback
          templateName={template.name || template.key}
          className="h-40"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-600 z-10">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
          Website
        </div>
        <div className="absolute right-3 top-3 text-[11px] font-medium capitalize z-10">
          <span className={`px-2 py-0.5 rounded-full bg-white/90 ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="space-y-1 px-4 py-3 text-xs">
        <div className="text-sm font-semibold text-slate-900">
          {template.name || template.key}
        </div>
        <div className="text-[11px] text-slate-500">
          Key: {template.key}
        </div>
        <div className="text-[11px] text-slate-500">
          Category: {template.category || "—"}
        </div>
        <div className="text-[11px] text-slate-500">
          Sections: {template.sections_count || 0}
        </div>
        <div className="text-[11px] text-slate-500">
          Used: {template.usage_count || 0} times
        </div>
        {updated && (
          <div className="text-[11px] text-slate-500">
            Updated: {updated}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <button className="h-8 flex-1 rounded-lg bg-blue-600 text-xs font-medium text-white hover:bg-blue-700">
          Edit
        </button>
        {/* Placeholder icons / actions, wire later */}
        <div className="flex items-center gap-2 text-slate-400">
          <button 
            className={`text-[16px] ${
              isSelected ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
            }`}
            title="Preview"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template.id);
            }}
          >
            👁
          </button>
          <button className="text-[16px]" title="Duplicate">
            ⧉
          </button>
          <button className="text-[16px] hover:text-red-600" title="Delete">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

// [PREVIEW] template preview panel with tabs
function TemplatePreviewPanel({
  selectedTemplate,
  selectedPageId,
  isLoading,
  activeTab,
  onTabChange,
}: {
  selectedTemplate: AdminSiteTemplateDetail | null;
  selectedPageId: number | null;
  isLoading: boolean;
  activeTab: "preview" | "seo" | "sections" | "assets";
  onTabChange: (tab: "preview" | "seo" | "sections" | "assets") => void;
}) {
  if (!selectedTemplate && !isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-4 p-4 md:p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl text-slate-400">👁</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">
            No template selected
          </h3>
          <p className="text-xs text-slate-500">
            Choose a template from the list to preview it here.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-4 p-4 md:p-6">
        <div className="animate-pulse">
          <div className="flex gap-6">
            <div className="w-80 h-48 bg-slate-200 rounded-xl"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTemplate) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-4 p-4 md:p-6">
      <div className="space-y-6">
        {/* Template Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedTemplate.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Key: {selectedTemplate.key}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              Edit Details
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200">
          {(["preview", "seo", "sections", "assets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "preview" && (
          <PreviewTab selectedTemplate={selectedTemplate} />
        )}
        {activeTab === "seo" && (
          <SeoTab selectedPageId={selectedPageId} />
        )}
        {activeTab === "sections" && (
          <SectionsTab selectedTemplateId={selectedTemplate.id} />
        )}
        {activeTab === "assets" && (
          <AssetsTab selectedTemplateId={selectedTemplate.id} />
        )}
      </div>
    </div>
  );
}

// [PREVIEW] preview tab
function PreviewTab({ selectedTemplate }: { selectedTemplate: AdminSiteTemplateDetail }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Preview Image */}
      <div className="lg:w-80">
        <div className="aspect-video rounded-xl border border-slate-200 bg-slate-100 object-cover overflow-hidden">
          <img 
            src={`/template-previews/${selectedTemplate.key}-01.jpg`} 
            alt={selectedTemplate.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Try backend preview_image as fallback
              const target = e.target as HTMLImageElement;
              if (selectedTemplate.preview_image && target.src !== selectedTemplate.preview_image) {
                target.src = selectedTemplate.preview_image;
              } else {
                target.style.display = 'none';
                const fallbackDiv = target.parentElement?.querySelector('.fallback-preview');
                if (fallbackDiv) {
                  (fallbackDiv as HTMLElement).style.display = 'flex';
                }
              }
            }}
          />
          ) : null}
          <div className="w-full h-full flex items-center justify-center fallback-preview" style={{display: 'none'}}>
            <div className="text-center">
              <div className="text-4xl text-slate-400 mb-2">🖼</div>
              <p className="text-xs text-slate-500">Screenshot coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            {selectedTemplate.type}
          </span>
          {selectedTemplate.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
              {selectedTemplate.category}
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
            selectedTemplate.status === 'published' 
              ? 'bg-green-100 text-green-800'
              : selectedTemplate.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-slate-100 text-slate-800'
          }`}>
            {selectedTemplate.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Sections:</span>
            <span className="ml-1 font-medium text-slate-900">
              {selectedTemplate.sections_count || 0}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Usage:</span>
            <span className="ml-1 font-medium text-slate-900">
              {selectedTemplate.usage_count || 0} times
            </span>
          </div>
        </div>

        {selectedTemplate.description && (
          <p className="text-sm text-slate-600">
            {selectedTemplate.description}
          </p>
        )}

        {/* [JCW] admin template actions */}
        <div className="flex gap-3 pt-2">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Open Template Lab
          </button>
        </div>
      </div>
    </div>
  );
}

// [SEO] preview tab wiring 
function SeoTab({ selectedPageId }: { selectedPageId: number | null }) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">SEO Settings</h4>
        <p className="text-sm text-yellow-700">
          SEO panel for page ID: {selectedPageId || "None"}. 
          This will connect to the Page SEO API endpoints for meta_title, meta_description, has_jsonld, schema_type.
        </p>
        {/* TODO: Replace with actual SeoPanel component */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Meta Title</label>
            <input type="text" className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="Enter page meta title..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Meta Description</label>
            <textarea className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm" rows={3} placeholder="Enter page meta description..." />
          </div>
        </div>
      </div>
    </div>
  );
}

// [TEMPLAB] sections tab  
function SectionsTab({ selectedTemplateId }: { selectedTemplateId: number }) {
  const [sections, setSections] = useState<TemplateSectionData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTemplateId) {
      loadSections();
    }
  }, [selectedTemplateId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const sectionsData = await fetchTemplateSections(selectedTemplateId);
      setSections(sectionsData);
    } catch (e) {
      console.error("Failed to load sections:", e);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-900">Template Sections</h4>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          Open in Template Lab
        </button>
      </div>
      
      {sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-slate-900">{section.name}</h5>
                  <p className="text-xs text-slate-500">
                    {section.key} • Order: {section.order} • Type: {section.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    section.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {section.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No sections found for this template.</p>
        </div>
      )}
    </div>
  );
}

// [ASSETS] assets tab
function AssetsTab({ selectedTemplateId }: { selectedTemplateId: number }) {
  const [branding, setBranding] = useState({
    header_logo_url: "",
    footer_logo_url: "",
    favicon_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTemplateId) {
      loadBrandingData();
    }
  }, [selectedTemplateId]);

  const loadBrandingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { fetchTemplateBranding } = await import("@/lib/api");
      const brandingData = await fetchTemplateBranding(selectedTemplateId);
      setBranding({
        header_logo_url: brandingData.header_logo_url || "",
        footer_logo_url: brandingData.footer_logo_url || "",
        favicon_url: brandingData.favicon_url || "",
      });
    } catch (e) {
      console.error("Failed to load branding data:", e);
      setError("Failed to load branding data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const { updateTemplateBranding } = await import("@/lib/api");
      const updated = await updateTemplateBranding(selectedTemplateId, branding);
      setBranding({
        header_logo_url: updated.header_logo_url || "",
        footer_logo_url: updated.footer_logo_url || "",
        favicon_url: updated.favicon_url || "",
      });
    } catch (e) {
      console.error("Failed to save branding:", e);
      setError("Failed to save branding data");
    } finally {
      setSaving(false);
    }
  };

  const updateBrandingField = (field: string, value: string) => {
    setBranding(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Template Branding Assets</h4>
        <p className="text-sm text-blue-700 mb-4">
          Manage logo and branding assets for template ID: {selectedTemplateId}. 
          Full file upload functionality coming soon.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Header Logo URL
            </label>
            <input
              type="url"
              value={branding.header_logo_url}
              onChange={(e) => updateBrandingField("header_logo_url", e.target.value)}
              className="block w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="https://example.com/header-logo.png"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Footer Logo URL
            </label>
            <input
              type="url"
              value={branding.footer_logo_url}
              onChange={(e) => updateBrandingField("footer_logo_url", e.target.value)}
              className="block w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="https://example.com/footer-logo.png"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Favicon URL
            </label>
            <input
              type="url"
              value={branding.favicon_url}
              onChange={(e) => updateBrandingField("favicon_url", e.target.value)}
              className="block w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="https://example.com/favicon.ico"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Assets"}
          </button>
        </div>
      </div>
    </div>
  );
}