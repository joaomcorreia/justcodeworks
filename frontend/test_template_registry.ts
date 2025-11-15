// Template Lab Step 2 - Frontend Rendering Test
//
// This script tests that our new template sections can be properly
// mapped and rendered through the TemplateRenderer component.

import { sectionRegistry, getSectionComponent, hasSectionComponent } from '@/templates/core/registry';

console.log('=== TEMPLATE LAB STEP 2 - FRONTEND REGISTRY TEST ===\n');

// Test data based on backend analysis
const testSections = [
  // Mary's Restaurant sections
  { identifier: 'hero-banner', name: 'Mary\'s Restaurant Hero' },
  { identifier: 'about-us', name: 'Mary\'s Restaurant About' },
  { identifier: 'restaurant-hero', name: 'Restaurant Hero (new)' },
  { identifier: 'restaurant-menu', name: 'Restaurant Menu (new)' },
  { identifier: 'restaurant-testimonials', name: 'Restaurant Testimonials (new)' },
  { identifier: 'restaurant-contact', name: 'Restaurant Contact (new)' },
  
  // Oficina Paulo Calibra sections
  { identifier: 'jcw-auto-garage-modern-01-hero-01', name: 'Garage Hero' },
  { identifier: 'jcw-auto-garage-modern-01-services-01', name: 'Garage Services' },
  { identifier: 'jcw-auto-garage-modern-01-diagnostics-01', name: 'Garage Diagnostics' },
  { identifier: 'jcw-auto-garage-modern-01-testimonials-01', name: 'Garage Testimonials' },
  { identifier: 'jcw-auto-garage-modern-01-form-quote-01', name: 'Garage Quote Form' },
  { identifier: 'garage-hero', name: 'Garage Hero (short)' },
  { identifier: 'garage-services', name: 'Garage Services (short)' },
  { identifier: 'garage-diagnostics', name: 'Garage Diagnostics (short)' },
];

console.log('🧪 Testing section component mappings:');

let successCount = 0;
let totalCount = testSections.length;

testSections.forEach(section => {
  const hasComponent = hasSectionComponent(section.identifier);
  const component = getSectionComponent(section.identifier);
  
  if (hasComponent && component) {
    console.log(`✅ ${section.identifier} → ${component.name}`);
    successCount++;
  } else {
    console.log(`❌ ${section.identifier} → No component found`);
  }
});

console.log(`\n📊 Registry Test Results: ${successCount}/${totalCount} sections mapped successfully`);

// Test new naming convention mappings
console.log('\n🆕 Testing Template Lab Step 2 naming convention:');

const newConventionTests = [
  'restaurant-modern-hero-01',
  'restaurant-modern-about-01', 
  'restaurant-modern-menu-01',
  'restaurant-modern-testimonials-01',
  'restaurant-modern-contact-01',
  'auto-garage-modern-hero-01',
  'auto-garage-modern-diagnostics-01',
  'auto-garage-modern-services-01',
  'auto-garage-modern-testimonials-01',
  'auto-garage-modern-quote-01'
];

let newConventionSuccessCount = 0;

newConventionTests.forEach(identifier => {
  const hasComponent = hasSectionComponent(identifier);
  if (hasComponent) {
    console.log(`✅ ${identifier}`);
    newConventionSuccessCount++;
  } else {
    console.log(`❌ ${identifier}`);
  }
});

console.log(`\n📊 New Convention Test Results: ${newConventionSuccessCount}/${newConventionTests.length} new identifiers mapped`);

// Registry statistics
console.log('\n📋 Registry Statistics:');
const totalRegistryEntries = Object.keys(sectionRegistry).length;
console.log(`   Total registered identifiers: ${totalRegistryEntries}`);

const restaurantEntries = Object.keys(sectionRegistry).filter(key => key.includes('restaurant')).length;
const garageEntries = Object.keys(sectionRegistry).filter(key => key.includes('garage') || key.includes('auto-garage')).length;

console.log(`   Restaurant identifiers: ${restaurantEntries}`);
console.log(`   Garage/Auto identifiers: ${garageEntries}`);
console.log(`   Legacy identifiers: ${totalRegistryEntries - restaurantEntries - garageEntries}`);

console.log('\n=== FRONTEND TEST COMPLETE ===');

export { testSections, newConventionTests };