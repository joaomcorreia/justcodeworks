// [TEMPLAB] Restaurant Modern Template Renderer
// 
// Dedicated renderer for restaurant-modern template sites.
// Provides restaurant-specific styling, layout, and branding.
// Isolated from other templates to prevent style conflicts.

import React from 'react';
import { renderRestaurantModernSection } from '@/components/templates/restaurant-modern/registry';
import RestaurantFooter from '@/templates/sections/RestaurantFooter';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

interface RestaurantModernRendererProps {
  site: SiteProjectPublic;
}

export default function RestaurantModernRenderer({ site }: RestaurantModernRendererProps) {
  // Get sections from the home page only (not all pages)
  const homePage = site.pages?.find(page => page.slug === 'home');
  const sections = homePage?.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="restaurant-modern-site bg-white min-h-screen">
      {/* [TEMPLAB] Restaurant-specific styles wrapper */}
      <div className="restaurant-theme">
        {sections.map(section => (
          <div key={section.identifier}>
            {renderRestaurantModernSection(section, "public")}
          </div>
        ))}
        
        {/* Footer */}
        <RestaurantFooter site={site} />
      </div>

    </div>
  );
}