"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminSiteTemplates, fetchAdminSiteTemplateDetail } from "@/lib/api";
import type { AdminSiteTemplate, AdminSiteTemplateDetail } from "@/lib/api-types";

export default function AdminWebsiteTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<AdminSiteTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<AdminSiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // [PREVIEW] template preview panel
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminSiteTemplateDetail | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // Get website templates specifically
      const websiteTemplates = await fetchAdminSiteTemplates({ type: "website" });
      // Get all templates for summary stats
      const allTemplatesList = await fetchAdminSiteTemplates();
      setTemplates(websiteTemplates);
      setAllTemplates(allTemplatesList);
    } catch (e) {
      console.error("Failed to load admin templates:", e);
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
      return;
    }

    try {
      setIsPreviewLoading(true);
      setSelectedTemplateId(templateId);
      const detail = await fetchAdminSiteTemplateDetail(templateId);
      setSelectedTemplate(detail);
    } catch (e) {
      console.error("Failed to load template detail:", e);
      setSelectedTemplate(null);
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
        isLoading={isPreviewLoading}
        onOpenTemplateLab={(templateId) => router.push(`/admin/templates/${templateId}/lab`)}
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
            ))}
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
    <div className={`flex flex-col rounded-2xl border bg-white transition-all ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
    }`}>
      {/* Card top (screenshot placeholder) */}
      <div 
        className="relative flex h-40 items-center justify-center rounded-t-2xl bg-slate-50 cursor-pointer"
        onClick={() => onPreview(template.id)}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-[20px] text-slate-400">
          🖼
        </div>
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
          Website
        </div>
        <div className="absolute right-3 top-3 text-[11px] font-medium capitalize">
          <span className={statusColor}>{statusLabel}</span>
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
          <button className="text-[16px] hover:text-slate-600" title="Duplicate">
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

// [PREVIEW] template preview panel
function TemplatePreviewPanel({
  selectedTemplate,
  isLoading,
  onOpenTemplateLab,
}: {
  selectedTemplate: AdminSiteTemplateDetail | null;
  isLoading: boolean;
  onOpenTemplateLab: (templateId: number) => void;
}) {
  if (!selectedTemplate && !isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl text-slate-400">👁</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">
            Select a template to preview it here
          </h3>
          <p className="text-xs text-slate-500">
            Click on any template card above to see its details and sections.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Image */}
        <div className="lg:w-80">
          <div className="aspect-video rounded-xl border border-slate-200 bg-slate-100 object-cover overflow-hidden">
            {selectedTemplate.preview_image ? (
              <img 
                src={selectedTemplate.preview_image} 
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl text-slate-400 mb-2">🖼</div>
                  <p className="text-xs text-slate-500">No preview available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedTemplate.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Key: {selectedTemplate.key}
            </p>
          </div>

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

          {/* [TEMPLAB] open from preview */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpenTemplateLab(selectedTemplate.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Template Lab
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}