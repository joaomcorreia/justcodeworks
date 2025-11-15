// [TEMPLATE-LAB] Core Template Renderer Component
//
// This component receives JSON sections from Django API and dynamically renders
// them using the section registry. It handles section ordering, component lookup,
// and graceful fallbacks for missing components.
//
// Flow:
//   1. Receives sections array from API
//   2. Sorts sections by order field  
//   3. For each section, looks up component in registry
//   4. Renders component with section data as props
//   5. Shows placeholder if component not found

import React from 'react';
import { getSectionComponent, hasSectionComponent } from './registry';
import type { SectionProps } from './registry';

// Template renderer props interface
interface TemplateRendererProps {
  sections: Array<{
    id: string | number;
    identifier: string;
    internal_name: string;
    order: number;
    fields: Array<{
      key: string;
      label: string;
      value: string;
      order: number;
    }>;
  }>;
  mode?: 'public' | 'dashboard';
  className?: string;
}

// Placeholder component for missing sections
function SectionPlaceholder({ identifier, internal_name }: { identifier: string; internal_name?: string }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Section component missing: <code className="bg-yellow-100 px-1 rounded">{identifier}</code>
          </h3>
          {internal_name && (
            <p className="text-sm text-yellow-700 mt-1">Internal name: {internal_name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main template renderer component
export default function TemplateRenderer({ sections, mode = 'public', className = '' }: TemplateRendererProps) {
  // Sort sections by order field
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className={`template-renderer ${className}`}>
      {sortedSections.map((section) => {
        // Get component from registry
        const SectionComponent = getSectionComponent(section.identifier);
        
        // Render component if found, placeholder if not
        if (SectionComponent) {
          return (
            <SectionComponent
              key={String(section.id)}
              section={section}
              mode={mode}
            />
          );
        } else {
          return (
            <SectionPlaceholder
              key={String(section.id)}
              identifier={section.identifier}
              internal_name={section.internal_name}
            />
          );
        }
      })}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer font-medium">Template Debug Info</summary>
            <div className="mt-2">
              <p><strong>Total sections:</strong> {sections.length}</p>
              <p><strong>Mode:</strong> {mode}</p>
              <div className="mt-2">
                <strong>Sections:</strong>
                <ul className="list-disc list-inside mt-1">
                  {sortedSections.map((section) => (
                    <li key={section.id} className={hasSectionComponent(section.identifier) ? 'text-green-600' : 'text-red-600'}>
                      {section.identifier} ({section.internal_name}) - {section.fields.length} fields
                      {!hasSectionComponent(section.identifier) && ' [MISSING COMPONENT]'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}