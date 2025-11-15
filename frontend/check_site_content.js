// Quick Visual Check - Get HTML Sample from Tenant Site
const axios = require('axios');

async function checkSiteContent() {
  try {
    console.log('🔍 Checking Mary\'s Restaurant content...');
    const response = await axios.get('http://localhost:3003/en/sites/marys-restaurant');
    const html = response.data;
    
    // Extract key parts of the HTML
    console.log('\n📄 HTML HEAD (first 500 chars):');
    console.log(html.substring(0, 500));
    
    console.log('\n📄 HTML BODY (first 1000 chars):');
    const bodyStart = html.indexOf('<body');
    if (bodyStart !== -1) {
      console.log(html.substring(bodyStart, bodyStart + 1000));
    }
    
    // Check for specific elements
    if (html.includes('Section component missing:')) {
      console.log('\n❌ Still has missing components');
    } else {
      console.log('\n✅ No missing component errors');
    }
    
    if (html.includes('class="section') || html.includes('<section')) {
      console.log('✅ Has section elements');
    } else {
      console.log('⚠️  No section elements found');
    }
    
    if (html.includes('Mary\'s Restaurant') || html.includes('marys-restaurant')) {
      console.log('✅ Has restaurant-specific content');
    } else {
      console.log('⚠️  No restaurant-specific content found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSiteContent();