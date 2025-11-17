// [TEMPLAB] Auto Garage Modern Template Renderer
// 
// Dedicated renderer for auto-garage-modern template sites.
// Provides automotive business-specific styling, layout, and branding.
// Isolated from other templates to prevent style conflicts.

import React from 'react';
import { sectionRegistry } from '@/templates/sections/registry';
import AutoGarageFooter from '@/templates/sections/AutoGarageFooter';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

interface AutoGarageModernRendererProps {
  site: SiteProjectPublic;
}

export default function AutoGarageModernRenderer({ site }: AutoGarageModernRendererProps) {
  // Get sections from the home page only (not all pages)
  const homePage = site.pages?.find(page => page.slug === 'home');
  const sections = homePage?.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="auto-garage-modern-site bg-slate-100 min-h-screen">
      {/* [TEMPLAB] Auto Garage-specific styles wrapper */}
      <div className="garage-theme">
        {sections.map(section => {
          const Component = sectionRegistry[section.identifier];
          return (
            <div key={section.identifier}>
              {Component ? (
                <Component section={section} />
              ) : (
                <div className="p-6 bg-red-50 text-red-700 border border-red-200">
                  Missing component for section: <strong>{section.identifier}</strong>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Footer */}
        <AutoGarageFooter site={site} />
      </div>

    </div>
  );
}