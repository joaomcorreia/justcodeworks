"use client";

import { useState } from "react";
import type { SiteProjectPublic, PageJson, SectionJson, FieldJson } from "@/lib/types/sitePublic";

type Props = {
  project: SiteProjectPublic;
  locale: string;
};

export default function SiteDetailClient({ project }: Props) {
  // Find default selected page (home first, otherwise first page)
  const defaultPage = project.pages.find(p => p.path === "/home") || project.pages[0];
  const [selectedPage, setSelectedPage] = useState<PageJson | null>(defaultPage || null);

  if (project.pages.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-slate-500">This site has no pages yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pages list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pages</h2>
        <div className="space-y-2">
          {project.pages.map((page) => (
            <div
              key={page.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedPage?.id === page.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              onClick={() => setSelectedPage(page)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{page.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <span className="font-mono">{page.path}</span>
                    <span>•</span>
                    <span>{page.locale}</span>
                    <span>•</span>
                    <span>Order: {page.order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      page.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {page.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm text-slate-400">
                    {page.sections.length} sections
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected page detail */}
      <div className="space-y-4">
        {selectedPage ? (
          <>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{selectedPage.title}</h2>
              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                {selectedPage.path}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {selectedPage.locale}
              </span>
            </div>
            
            {selectedPage.sections.length === 0 ? (
              <div className="rounded-lg border bg-white p-6">
                <p className="text-slate-500">This page has no sections yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <SectionCard key={section.id} section={section} />
                  ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border bg-white p-6">
            <p className="text-slate-500">Select a page to view its sections and content.</p>
          </div>
        )}
      </div>
    </div>
  );
}

type SectionCardProps = {
  section: SectionJson;
};

function SectionCard({ section }: SectionCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">{section.internal_name}</h3>
          <p className="text-sm text-slate-500">
            ID: <span className="font-mono">{section.identifier}</span> • Order: {section.order}
          </p>
        </div>
        <span className="text-sm text-slate-400">
          {section.fields.length} fields
        </span>
      </div>
      
      {section.fields.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No fields</p>
      ) : (
        <div className="space-y-2">
          {section.fields
            .sort((a, b) => a.order - b.order)
            .map((field, index) => (
              <FieldRow key={`${field.key}-${index}`} field={field} />
            ))}
        </div>
      )}
    </div>
  );
}

type FieldRowProps = {
  field: FieldJson;
};

function FieldRow({ field }: FieldRowProps) {
  const value = field.value || "";
  const displayValue = value.length > 60 ? value.substring(0, 60) + "..." : value;
  
  return (
    <div className="flex items-start gap-3 text-sm py-2 border-b border-slate-100 last:border-b-0">
      <div className="w-24 flex-shrink-0 font-medium text-slate-600">
        {field.label}
      </div>
      <div className="w-20 flex-shrink-0 font-mono text-xs text-slate-400">
        {field.key}
      </div>
      <div className="flex-1 text-slate-900">
        {value ? (
          <span title={value}>
            {displayValue}
          </span>
        ) : (
          <span className="text-slate-400 italic">Empty</span>
        )}
      </div>
    </div>
  );
}