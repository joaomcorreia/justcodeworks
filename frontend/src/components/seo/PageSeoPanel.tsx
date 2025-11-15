"use client";

// [SEO]
import { useState } from "react";
import type { PageJson, PageSeoUpdatePayload } from "@/lib/types/sitePublic";

interface PageSeoPanelProps {
  page: PageJson;
  isAdmin: boolean;
  onSave: (payload: PageSeoUpdatePayload) => Promise<void>;
}

type TabType = "meta" | "search" | "social" | "advanced";

export function PageSeoPanel({ page, isAdmin, onSave }: PageSeoPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("meta");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local form state
  const [seoData, setSeoData] = useState({
    meta_title: page.seo?.meta_title || "",
    meta_description: page.seo?.meta_description || "",
    meta_slug: page.seo?.slug || page.slug,
    indexable: page.seo?.indexable ?? true,
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await onSave({
        meta_title: seoData.meta_title,
        meta_description: seoData.meta_description,
        meta_slug: seoData.meta_slug,
        indexable: seoData.indexable,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save SEO data");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabType; label: string; adminOnly?: boolean }[] = [
    { id: "meta", label: "Meta" },
    { id: "search", label: "Search & Analytics" },
    { id: "social", label: "Social" },
    { id: "advanced", label: "Advanced", adminOnly: true },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Page SEO Settings</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex px-4">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "meta" && (
          <MetaTab seoData={seoData} setSeoData={setSeoData} />
        )}
        {activeTab === "search" && <SearchAnalyticsTab />}
        {activeTab === "social" && (
          <SocialTab seoData={seoData} />
        )}
        {activeTab === "advanced" && isAdmin && <AdvancedTab seoData={seoData} setSeoData={setSeoData} />}
      </div>
    </div>
  );
}

// Meta Tab Component
function MetaTab({ seoData, setSeoData }: {
  seoData: any;
  setSeoData: (data: any) => void;
}) {
  const titleLength = seoData.meta_title.length;
  const descriptionLength = seoData.meta_description.length;

  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
          <span className="ml-2 text-xs text-gray-500">
            ({titleLength}/60 characters)
          </span>
        </label>
        <input
          type="text"
          value={seoData.meta_title}
          onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter page title for search engines"
        />
        {titleLength > 60 && (
          <p className="mt-1 text-xs text-amber-600">Title may be truncated in search results</p>
        )}
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
          <span className="ml-2 text-xs text-gray-500">
            ({descriptionLength}/160 characters)
          </span>
        </label>
        <textarea
          value={seoData.meta_description}
          onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter page description for search engines"
        />
        {descriptionLength > 160 && (
          <p className="mt-1 text-xs text-amber-600">Description may be truncated in search results</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug
        </label>
        <input
          type="text"
          value={seoData.meta_slug}
          onChange={(e) => setSeoData({ ...seoData, meta_slug: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="page-url-slug"
        />
      </div>

      {/* Indexable */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={seoData.indexable}
            onChange={(e) => setSeoData({ ...seoData, indexable: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Allow search engines to index this page
          </span>
        </label>
      </div>

      {/* Google Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Search Preview</h4>
        <div className="space-y-1">
          <div className="text-blue-600 text-lg leading-tight">
            {seoData.meta_title || "Page Title"}
          </div>
          <div className="text-green-700 text-sm">
            example.com/{seoData.meta_slug}
          </div>
          <div className="text-gray-600 text-sm">
            {seoData.meta_description || "Page description will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

// Search Analytics Tab Component
function SearchAnalyticsTab() {
  // Fake analytics data
  const stats = {
    views7d: 0,
    views30d: 0,
    clicks7d: 0,
    clicks30d: 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.views7d}</div>
          <div className="text-sm text-gray-500">Views (7 days)</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.views30d}</div>
          <div className="text-sm text-gray-500">Views (30 days)</div>
        </div>
      </div>

      {/* Placeholder Graph */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-sm">Analytics Chart Placeholder</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Note:</strong> Real visit stats will appear here later — this is just a preview.
      </div>
    </div>
  );
}

// Social Tab Component
function SocialTab({ seoData }: { seoData: any }) {
  return (
    <div className="space-y-6">
      {/* Social Preview */}
      <div className="border rounded-lg overflow-hidden">
        <div className="h-32 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Social Card Image Placeholder</span>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-gray-900">
            {seoData.meta_title || "Page Title"}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {seoData.meta_description || "Page description..."}
          </p>
          <div className="text-xs text-gray-500 mt-2">example.com</div>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Note:</strong> In future you can set separate social text & image.
      </div>
    </div>
  );
}

// Advanced Tab Component
function AdvancedTab({ seoData, setSeoData }: {
  seoData: any;
  setSeoData: (data: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={seoData.indexable}
            onChange={(e) => setSeoData({ ...seoData, indexable: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Allow search engine indexing
          </span>
        </label>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <strong>Advanced SEO settings</strong> (noindex, canonical, etc.) will live here for admins.
      </div>
    </div>
  );
}