// [TEMPLATE-LAB] Template Section Component Registry
// 
// This registry maps section identifiers from the backend API to React components.
// Each section identifier corresponds to a specific component that will render
// the section's fields and content.
//
// Usage:
//   - Backend sends sections with "identifier" field
//   - Registry maps identifier → React component
//   - TemplateRenderer uses this mapping to render sections dynamically
//
// Naming Convention:
//   - identifier: "{template-key}-{area}-{variant}" (e.g., "restaurant-modern-hero-01", "auto-garage-modern-services-01")
//   - Components: PascalCase with descriptive names (e.g., RestaurantHeroSection, AutoGarageServicesSection)

import { ComponentType, lazy } from 'react';

// Import restaurant template components
import RestaurantHero from '@/templates/restaurant/components/RestaurantHero';
import RestaurantAbout from '@/templates/restaurant/components/RestaurantAbout';
import RestaurantMenuHighlightSection from '@/templates/restaurant/components/RestaurantMenuHighlightSection';
import RestaurantTestimonialsSection from '@/templates/restaurant/components/RestaurantTestimonialsSection';
import RestaurantContactSection from '@/templates/restaurant/components/RestaurantContactSection';
import RestaurantFooterSection from '@/templates/restaurant/components/RestaurantFooterSection';

// Import garage template components
import AutoGarageHeroSection from '@/templates/garage/components/AutoGarageHeroSection';
import AutoGarageDiagnosticsSection from '@/templates/garage/components/AutoGarageDiagnosticsSection';
import AutoGarageServicesSection from '@/templates/garage/components/AutoGarageServicesSection';
import AutoGarageTestimonialsSection from '@/templates/garage/components/AutoGarageTestimonialsSection';
import AutoGarageQuoteFormSection from '@/templates/garage/components/AutoGarageQuoteFormSection';

// Section component props interface
export interface SectionProps {
  section: {
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
  };
  mode?: 'public' | 'dashboard';
}

// Registry type definition
export type SectionComponent = ComponentType<SectionProps>;

// Main section registry - Template Lab Step 2 Complete
export const sectionRegistry: Record<string, SectionComponent> = {
  // RESTAURANT TEMPLATE SECTIONS (restaurant-modern)
  // Hero sections
  'restaurant-modern-hero-01': RestaurantHero,
  'restaurant-hero': RestaurantHero,
  'restaurant-hero-01': RestaurantHero,
  
  // About sections  
  'restaurant-modern-about-01': RestaurantAbout,
  'restaurant-about': RestaurantAbout,
  'restaurant-about-01': RestaurantAbout,
  
  // Menu sections
  'restaurant-modern-menu-01': RestaurantMenuHighlightSection,
  'restaurant-menu': RestaurantMenuHighlightSection,
  'restaurant-menu-01': RestaurantMenuHighlightSection,
  'restaurant-menu-highlight': RestaurantMenuHighlightSection,
  
  // Testimonials sections
  'restaurant-modern-testimonials-01': RestaurantTestimonialsSection,
  'restaurant-testimonials': RestaurantTestimonialsSection,
  'restaurant-testimonials-01': RestaurantTestimonialsSection,
  
  // Contact sections
  'restaurant-modern-contact-01': RestaurantContactSection,
  'restaurant-contact': RestaurantContactSection,
  'restaurant-contact-01': RestaurantContactSection,
  
  // Footer sections
  'restaurant-modern-footer-01': RestaurantFooterSection,
  'restaurant-footer': RestaurantFooterSection,
  'restaurant-footer-01': RestaurantFooterSection,

  // AUTO GARAGE TEMPLATE SECTIONS (auto-garage-modern)
  // Hero sections
  'auto-garage-modern-hero-01': AutoGarageHeroSection,
  'garage-hero': AutoGarageHeroSection,
  'garage-hero-01': AutoGarageHeroSection,
  
  // Diagnostics sections
  'auto-garage-modern-diagnostics-01': AutoGarageDiagnosticsSection,
  'garage-diagnostics': AutoGarageDiagnosticsSection,
  'garage-diagnostics-01': AutoGarageDiagnosticsSection,
  
  // Services sections
  'auto-garage-modern-services-01': AutoGarageServicesSection,
  'garage-services': AutoGarageServicesSection,
  'garage-services-01': AutoGarageServicesSection,
  
  // Testimonials sections
  'auto-garage-modern-testimonials-01': AutoGarageTestimonialsSection,
  'garage-testimonials': AutoGarageTestimonialsSection,
  'garage-testimonials-01': AutoGarageTestimonialsSection,
  
  // Quote form sections
  'auto-garage-modern-quote-01': AutoGarageQuoteFormSection,
  'garage-quote': AutoGarageQuoteFormSection,
  'garage-quote-01': AutoGarageQuoteFormSection,
  'garage-quote-form': AutoGarageQuoteFormSection,
  'jcw-auto-garage-modern-01-form-quote-01': AutoGarageQuoteFormSection,
  
  // LEGACY IDENTIFIERS (backwards compatibility)
  'hero-banner': RestaurantHero,
  'hero-section': RestaurantHero,
  'about-section': RestaurantAbout,
  'about-us': RestaurantAbout,
  'appetizers': RestaurantMenuHighlightSection,
  'main-courses': RestaurantMenuHighlightSection,
  'contact-info': RestaurantContactSection,
  'jcw-auto-garage-modern-01-hero-01': AutoGarageHeroSection,
  'jcw-auto-garage-modern-01-services-01': AutoGarageServicesSection,
  'jcw-auto-garage-modern-01-diagnostics-01': AutoGarageDiagnosticsSection,
  'jcw-auto-garage-modern-01-testimonials-01': AutoGarageTestimonialsSection,
  'jcw-auto-garage-modern-01-contact-01': lazy(() => import('@/templates/garage/components/AutoGarageContactSection')),
  
  // Note: Additional templates can be added here following the same pattern
  // Future: portfolio-modern, blog-modern, ecommerce-modern, etc.
};

// Helper function to get component by identifier
export function getSectionComponent(identifier: string): SectionComponent | null {
  return sectionRegistry[identifier] || null;
}

// Helper function to check if section component exists
export function hasSectionComponent(identifier: string): boolean {
  return identifier in sectionRegistry;
}

// Export registry for external use
export default sectionRegistry;