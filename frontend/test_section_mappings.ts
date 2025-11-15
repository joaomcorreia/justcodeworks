// Test script to verify all section identifiers are mapped
import { sectionRegistry, hasSectionComponent } from '@/templates/core/registry';

console.log('=== SECTION IDENTIFIER MAPPING TEST ===\n');

// Test identifiers from backend
const testIdentifiers = [
  // Restaurant identifiers
  'hero-banner',
  'about-us', 
  'appetizers',
  'main-courses',
  'contact-info',
  
  // Garage identifiers  
  'jcw-auto-garage-modern-01-hero-01',
  'jcw-auto-garage-modern-01-services-01',
  'jcw-auto-garage-modern-01-diagnostics-01',
  'jcw-auto-garage-modern-01-testimonials-01',
  'jcw-auto-garage-modern-01-form-quote-01',
  'jcw-auto-garage-modern-01-contact-01'
];

let mappedCount = 0;
let totalCount = testIdentifiers.length;

console.log('Testing backend section identifiers:');
testIdentifiers.forEach(identifier => {
  const isMapped = hasSectionComponent(identifier);
  if (isMapped) {
    console.log(`✅ ${identifier}`);
    mappedCount++;
  } else {
    console.log(`❌ ${identifier}`);
  }
});

console.log(`\n📊 Results: ${mappedCount}/${totalCount} identifiers mapped`);
console.log(`📋 Total registry entries: ${Object.keys(sectionRegistry).length}`);

if (mappedCount === totalCount) {
  console.log('\n🎉 ALL SECTION IDENTIFIERS PROPERLY MAPPED!');
} else {
  console.log(`\n⚠️  ${totalCount - mappedCount} identifiers still missing`);
}

export { testIdentifiers };