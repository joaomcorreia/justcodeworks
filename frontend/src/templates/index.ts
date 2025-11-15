// [TEMPLATE-LAB] Template System Exports
// 
// Central export point for the Template Lab system.
// This file provides easy access to all template components and utilities.

// Core system
export { default as TemplateRenderer } from './core/TemplateRenderer';
export { sectionRegistry, getSectionComponent, hasSectionComponent } from './core/registry';
export type { SectionProps, SectionComponent } from './core/registry';

// Restaurant template components
export { default as RestaurantHero } from './restaurant/components/RestaurantHero';
export { default as RestaurantAbout } from './restaurant/components/RestaurantAbout';

// Future exports will be added here:
// export { default as GarageHero } from './garage/components/GarageHero';
// export { default as PortfolioGallery } from './portfolio/components/PortfolioGallery';
// export { default as CommonContact } from './common/components/CommonContact';