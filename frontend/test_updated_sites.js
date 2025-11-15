// Test Updated Tenant Sites - Verify Missing Component Resolution
// 
// This script tests the tenant sites to ensure that all "Section component missing"
// errors have been resolved after our registry updates.

const axios = require('axios');

const testSites = [
  {
    name: "Mary's Restaurant",
    url: 'http://localhost:3003/en/sites/marys-restaurant'
  },
  {
    name: "Oficina Paulo Calibra",  
    url: 'http://localhost:3003/en/sites/oficina-paulo-calibra'
  },
  {
    name: "Joe's Garage",
    url: 'http://localhost:3003/en/sites/joes-garage'
  }
];

async function testSite(site) {
  console.log(`\n🧪 Testing: ${site.name}`);
  console.log(`📍 URL: ${site.url}`);
  
  try {
    const response = await axios.get(site.url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = response.data;
    
    // Check for missing component errors
    const missingComponentMatches = html.match(/Section component missing:/g);
    if (missingComponentMatches) {
      console.log(`❌ FOUND ${missingComponentMatches.length} missing component errors`);
      
      // Extract specific missing components
      const missingComponents = html.match(/Section component missing: ([^<]+)/g);
      if (missingComponents) {
        missingComponents.forEach(component => {
          console.log(`   - ${component}`);
        });
      }
      return false;
    } else {
      console.log(`✅ NO missing component errors found`);
    }
    
    // Check for JavaScript/React errors in HTML
    if (html.includes('Error:') || html.includes('TypeError:') || html.includes('ReferenceError:')) {
      console.log(`⚠️  Potential JavaScript errors detected`);
    }
    
    // Check if page renders content (has proper sections)
    if (html.includes('class="section') || html.includes('id="section')) {
      console.log(`✅ Page has rendered sections`);
    } else {
      console.log(`⚠️  Page may not have rendered sections properly`);
    }
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📏 HTML Size: ${(html.length / 1024).toFixed(1)}KB`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Error testing site: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
    }
    return false;
  }
}

async function testAllSites() {
  console.log('🚀 Testing Updated Tenant Sites');
  console.log('================================');
  
  let allPassed = true;
  
  for (const site of testSites) {
    const passed = await testSite(site);
    if (!passed) allPassed = false;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }
  
  console.log('\n📋 SUMMARY');
  console.log('==========');
  if (allPassed) {
    console.log('✅ All sites tested successfully - No missing component errors detected');
  } else {
    console.log('❌ Some sites still have issues - Check individual results above');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('- Visit sites manually in browser to verify visual rendering');
  console.log('- Test editing functionality if authenticated');
  console.log('- Check console logs for any client-side errors');
}

testAllSites().catch(error => {
  console.error('Test runner failed:', error.message);
  process.exit(1);
});