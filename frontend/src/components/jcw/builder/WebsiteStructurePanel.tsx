// [JCW] Builder v1 - Website Structure Panel
// Read-only structure panel showing pages and sections for website builder

import { useState } from 'react';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

// [UI] Inline SVG Icons for structure panel
const FolderIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const DocumentTextIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

type Props = {
  project: SiteProjectPublic;
  currentPageSlug?: string;
  selectedSectionId?: string;
  onPageSelect: (pageSlug: string) => void;
  onSectionSelect?: (sectionId: string) => void;
};

export function WebsiteStructurePanel({ 
  project, 
  currentPageSlug, 
  selectedSectionId,
  onPageSelect, 
  onSectionSelect 
}: Props) {
  // [STATE] Track which pages are expanded in the structure tree
  const [expandedPages, setExpandedPages] = useState<Set<string>>(
    new Set(['home']) // Home page expanded by default
  );

  const pages = project.pages || [];
  
  const togglePageExpanded = (pageSlug: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageSlug)) {
      newExpanded.delete(pageSlug);
    } else {
      newExpanded.add(pageSlug);
    }
    setExpandedPages(newExpanded);
  };

  const handlePageClick = (pageSlug: string) => {
    // Always select the page
    onPageSelect(pageSlug);
    // Also expand/collapse the page
    togglePageExpanded(pageSlug);
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionSelect?.(sectionId);
  };

  // [UI] Render individual section
  const renderSection = (section: any) => {
    const isSelected = selectedSectionId === section.id.toString();
    
    return (
      <div
        key={section.id}
        className={`ml-6 py-1.5 px-2 rounded-md cursor-pointer group transition-colors ${
          isSelected 
            ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' 
            : 'hover:bg-slate-50 text-slate-600'
        }`}
        onClick={() => handleSectionClick(section.id.toString())}
      >
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {section.section_type || `Section ${section.order}`}
          </span>
          {/* [DEBUG] Show section order */}
          <span className="text-xs text-slate-400 ml-auto">
            #{section.order}
          </span>
        </div>
        
        {/* [PREVIEW] Show field count */}
        {section.fields && section.fields.length > 0 && (
          <div className="ml-6 mt-1 text-xs text-slate-400">
            {section.fields.length} field{section.fields.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  // [UI] Render individual page with sections
  const renderPage = (page: any) => {
    const isSelected = currentPageSlug === page.slug;
    const isExpanded = expandedPages.has(page.slug);
    const sections = page.sections || [];
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);

    return (
      <div key={page.slug} className="mb-2">
        {/* Page Header */}
        <div
          className={`py-2 px-3 rounded-md cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' 
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          onClick={() => handlePageClick(page.slug)}
        >
          <div className="flex items-center gap-2">
            {/* Expand/Collapse Icon */}
            {sections.length > 0 ? (
              isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
              )
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            
            {/* Page Icon */}
            <FolderIcon className="w-5 h-5 flex-shrink-0" />
            
            {/* Page Name */}
            <span className="font-medium capitalize">
              {page.name || page.slug}
            </span>
            
            {/* Section Count Badge */}
            {sections.length > 0 && (
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                {sections.length}
              </span>
            )}
          </div>
        </div>

        {/* Sections List */}
        {isExpanded && sections.length > 0 && (
          <div className="mt-1 ml-2">
            {sortedSections.map(renderSection)}
          </div>
        )}
      </div>
    );
  };

  // [RENDER] Main structure panel
  return (
    <div className="h-full bg-white border-r border-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-900">Website Structure</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {project.name}
        </p>
      </div>

      {/* Pages List */}
      <div className="p-4">
        {pages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FolderIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No pages found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {pages
              .sort((a, b) => {
                // Sort home first, then alphabetically
                if (a.slug === 'home') return -1;
                if (b.slug === 'home') return 1;
                return a.slug.localeCompare(b.slug);
              })
              .map(renderPage)
            }
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-4 py-3">
        <div className="text-xs text-slate-500">
          <div>Template: <code className="font-mono">{project.site_template_key}</code></div>
          <div className="mt-1">
            {pages.length} page{pages.length !== 1 ? 's' : ''} • {
              pages.reduce((total, page) => total + (page.sections?.length || 0), 0)
            } section{pages.reduce((total, page) => total + (page.sections?.length || 0), 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}