// Test Footer Component - Verify Footer is Rendered
// 
// This script tests that the footer component is properly rendered
// on Mary's Restaurant site.

const axios = require('axios');

async function testFooterComponent() {
  console.log('🦶 Testing Footer Component on Mary\'s Restaurant');
  console.log('================================================');
  
  try {
    const response = await axios.get('http://localhost:3002/en/sites/marys-restaurant', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = response.data;
    
    // Check for footer component
    if (html.includes('RestaurantFooter')) {
      console.log('✅ Footer component identifier found in HTML');
    } else {
      console.log('⚠️  Footer component identifier not found');
    }
    
    // Check for footer content
    const footerChecks = [
      { name: 'Footer tag', pattern: /<footer[^>]*>/i },
      { name: 'Restaurant name', pattern: /Mary's Restaurant/i },
      { name: 'Contact info', pattern: /contact info/i },
      { name: 'Phone number', pattern: /\(555\) 123-4567/ },
      { name: 'Email address', pattern: /reservations@marysrestaurant\.com/i },
      { name: 'Address', pattern: /Via Roma Street/i },
      { name: 'Hours section', pattern: /hours/i },
      { name: 'Copyright', pattern: /©.*2024.*Mary's Restaurant/i },
    ];
    
    let passedChecks = 0;
    
    console.log('\n📊 Footer Content Checks:');
    footerChecks.forEach(check => {
      if (check.pattern.test(html)) {
        console.log(`✅ ${check.name}: Found`);
        passedChecks++;
      } else {
        console.log(`❌ ${check.name}: Not found`);
      }
    });
    
    console.log(`\n📈 Results: ${passedChecks}/${footerChecks.length} checks passed`);
    
    if (passedChecks >= footerChecks.length * 0.7) {
      console.log('🎉 Footer test PASSED - Most content found');
    } else {
      console.log('⚠️  Footer test needs review - Some content missing');
    }
    
    console.log(`\n📏 Page size: ${(html.length / 1024).toFixed(1)}KB`);
    console.log(`📊 Response status: ${response.status}`);
    
  } catch (error) {
    console.log(`❌ Error testing footer: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    }
  }
}

testFooterComponent();