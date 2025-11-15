// [TEMPLAB] template lab page
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAdminSiteTemplateDetail, fetchTemplateSections } from "@/lib/api";
import type { AdminSiteTemplateDetail, TemplateSectionData } from "@/lib/api-types";

export default function TemplateLabPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);

  const [template, setTemplate] = useState<AdminSiteTemplateDetail | null>(null);
  const [sections, setSections] = useState<TemplateSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  useEffect(() => {
    if (templateId) {
      loadTemplateData();
    }
  }, [templateId]);

  const loadTemplateData = async () => {
    try {
      setLoading(true);
      const [templateDetail, sectionsData] = await Promise.all([
        fetchAdminSiteTemplateDetail(templateId),
        fetchTemplateSections(templateId),
      ]);
      setTemplate(templateDetail);
      setSections(sectionsData);
      
      // Auto-select first section
      if (sectionsData.length > 0) {
        setSelectedSectionId(sectionsData[0].id);
      }
    } catch (e) {
      console.error("Failed to load template data:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
              <div className="lg:col-span-3 space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Template not found
          </h2>
          <p className="text-slate-600 mb-4">
            The template you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => router.push('/admin/templates/website')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Template Lab
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Edit sections and screenshots for {template.name}
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/templates/website')}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
              ← Back to Website Templates
            </button>
          </div>

          {/* Template Meta */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {template.name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Key: <code className="bg-slate-100 px-2 py-1 rounded text-xs">{template.key}</code>
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    {template.type}
                  </span>
                  {template.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                      {template.category}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    template.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : template.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {template.status}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-slate-600">
                <div>Last updated: {new Date(template.updated_at).toLocaleDateString()}</div>
                <div className="mt-1">Version: {template.version || 'v1'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Sections List */}
          <div className="lg:col-span-2">
            <TemplateSectionsList 
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSectionSelect={setSelectedSectionId}
            />
          </div>

          {/* Right Column - Screenshots Preview */}
          <div className="lg:col-span-3">
            <SectionScreenshotsPreview 
              sections={sections}
              selectedSectionId={selectedSectionId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateSectionsList({
  sections,
  selectedSectionId,
  onSectionSelect,
}: {
  sections: TemplateSectionData[];
  selectedSectionId: number | null;
  onSectionSelect: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">
          Template Sections
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {sections.length} sections total
        </p>
      </div>

      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm">No sections found for this template.</p>
            <p className="text-xs mt-1">Sections will appear here once they're created.</p>
          </div>
        ) : (
          sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              onClick={() => onSectionSelect(section.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  isSelected,
  onClick,
}: {
  section: TemplateSectionData;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-sm' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${
            isSelected ? 'text-blue-900' : 'text-slate-900'
          }`}>
            {section.name || section.key}
          </h4>
          <p className={`text-xs mt-1 ${
            isSelected ? 'text-blue-700' : 'text-slate-600'
          }`}>
            {section.key} • {section.type}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              section.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {section.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs text-slate-500">
              Order: {section.order}
            </span>
          </div>
        </div>
        
        <div className={`ml-3 ${
          isSelected ? 'text-blue-600' : 'text-slate-400'
        }`}>
          {section.screenshot_url ? '📷' : '📷'}
        </div>
      </div>
    </button>
  );
}

function SectionScreenshotsPreview({
  sections,
  selectedSectionId,
}: {
  sections: TemplateSectionData[];
  selectedSectionId: number | null;
}) {
  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="space-y-4">
      {selectedSection ? (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedSection.name || selectedSection.key}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Section Preview & Screenshot
            </p>
          </div>

          <div className="p-6">
            <div className="aspect-video rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              {selectedSection.screenshot_url ? (
                <img
                  src={selectedSection.screenshot_url}
                  alt={`Screenshot of ${selectedSection.name || selectedSection.key}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-slate-400 mb-4">📷</div>
                    <h4 className="text-lg font-medium text-slate-900 mb-2">
                      Screenshot pending
                    </h4>
                    <p className="text-sm text-slate-600 mb-4">
                      No screenshot available for this section yet.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                      Upload Screenshot
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Section Details
                </label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Key:</span>
                    <span className="ml-2 font-mono text-slate-900">{selectedSection.key}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <span className="ml-2 text-slate-900">{selectedSection.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Order:</span>
                    <span className="ml-2 text-slate-900">{selectedSection.order}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <span className={`ml-2 ${
                      selectedSection.is_active ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {selectedSection.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="text-center">
            <div className="text-6xl text-slate-400 mb-4">👆</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Select a section to view
            </h3>
            <p className="text-sm text-slate-600">
              Choose a section from the left panel to see its screenshot and details.
            </p>
          </div>
        </div>
      )}

      {/* All Screenshots Grid */}
      {sections.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              All Section Screenshots
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Grid view of all section screenshots
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-slate-50">
                    {section.screenshot_url ? (
                      <img
                        src={section.screenshot_url}
                        alt={`Screenshot of ${section.name || section.key}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl text-slate-400 mb-1">📷</div>
                          <p className="text-xs text-slate-500">No screenshot</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {section.name || section.key}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {section.type} • Order {section.order}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}