// Debug script for Builder v2 section updates
// Run this in the browser console to test the API directly

console.log('🔧 Builder v2 Debug Script');
console.log('========================');

// Check if we're on the right page
if (!window.location.href.includes('/dashboard/website')) {
  console.error('❌ Please navigate to /en/dashboard/website first');
} else {
  console.log('✅ On dashboard website page');
}

// Check authentication
const checkAuth = () => {
  const token = localStorage.getItem('access_token');
  console.log('🔐 Auth Check:');
  console.log('   Access token exists:', !!token);
  console.log('   Token length:', token ? token.length : 0);
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('   Token expires:', new Date(payload.exp * 1000));
      console.log('   User ID:', payload.user_id);
    } catch (e) {
      console.log('   Token format error:', e.message);
    }
  }
  return token;
};

// Test section update API
const testSectionUpdate = async (sectionId = 40) => {
  console.log('🧪 Testing Section Update API');
  console.log('   Section ID:', sectionId);
  
  const token = checkAuth();
  if (!token) {
    console.error('❌ No access token found - please log in first');
    return;
  }

  const payload = {
    fields: [
      { key: 'headline', value: 'Test Headline ' + Date.now() }
    ]
  };

  console.log('   Payload:', payload);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/sections/${sectionId}/content/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 API Response:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Updated section data:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error response:', error);
    }
  } catch (error) {
    console.log('🔥 Network/Fetch Error:', error.message);
  }
};

// Test site data fetch
const testSiteData = async () => {
  console.log('📊 Testing Site Data API');
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/sites/marys-restaurant/public/');
    console.log('   Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const sections = data.pages?.flatMap(p => p.sections || []) || [];
      console.log('✅ Site data loaded');
      console.log('   Pages:', data.pages?.length || 0);
      console.log('   Total sections:', sections.length);
      console.log('   First section ID:', sections[0]?.id);
      return sections[0]?.id;
    } else {
      console.log('❌ Site data fetch failed');
    }
  } catch (error) {
    console.log('🔥 Site data error:', error.message);
  }
};

// Main debug function
const debugBuilder = async () => {
  console.log('🚀 Starting Builder v2 Debug');
  
  const sectionId = await testSiteData();
  if (sectionId) {
    await testSectionUpdate(sectionId);
  }
  
  console.log('✅ Debug complete - check messages above for issues');
};

// Auto-run or provide manual functions
console.log('');
console.log('Available functions:');
console.log('- debugBuilder() - Run full diagnostic');
console.log('- checkAuth() - Check authentication only'); 
console.log('- testSiteData() - Test site data fetch');
console.log('- testSectionUpdate(sectionId) - Test section update');
console.log('');
console.log('Run debugBuilder() to start automatic testing');

// Export functions to window for manual use
window.debugBuilder = debugBuilder;
window.checkAuth = checkAuth;
window.testSiteData = testSiteData;
window.testSectionUpdate = testSectionUpdate;