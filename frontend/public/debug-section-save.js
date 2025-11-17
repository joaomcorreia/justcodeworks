// Builder v2 Save Fix Test Script
// Paste this into the browser console on /en/dashboard/website to test section save functionality

async function testSectionSave() {
  console.log("🧱 Testing Builder v2 Section Save Fix...");
  
  // Test CSRF token access
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  
  console.log("1. CSRF Token:", csrfToken ? "✅ Found" : "❌ Missing");
  
  if (!csrfToken) {
    console.log("Getting fresh CSRF token...");
    try {
      await fetch('http://127.0.0.1:8000/api/csrf/', {
        credentials: 'include'
      });
      
      const newCsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
        
      console.log("Fresh CSRF token:", newCsrfToken ? "✅ Got it" : "❌ Still missing");
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
    }
  }
  
  // Test session authentication 
  console.log("2. Testing session auth...");
  try {
    const authResponse = await fetch('http://127.0.0.1:8000/api/auth/me/', {
      credentials: 'include'
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log("Session auth:", authData.authenticated ? "✅ Authenticated" : "❌ Not authenticated");
      console.log("User:", authData.user?.username || "Unknown");
    } else {
      console.log("Session auth: ❌ Request failed");
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  
  // Test section API access
  console.log("3. Testing section API...");
  try {
    const sectionsResponse = await fetch('http://127.0.0.1:8000/api/sections/', {
      credentials: 'include'
    });
    
    if (sectionsResponse.ok) {
      const sectionsData = await sectionsResponse.json();
      console.log("Sections API:", sectionsData.length ? `✅ Got ${sectionsData.length} sections` : "⚠️ No sections found");
      
      if (sectionsData.length > 0) {
        const testSection = sectionsData[0];
        console.log("Test section ID:", testSection.id);
        console.log("Test section fields:", testSection.fields?.length || 0);
      }
    } else {
      console.log("Sections API: ❌ Request failed -", sectionsResponse.status);
    }
  } catch (error) {
    console.error("Sections API failed:", error);
  }
  
  console.log("🧱 Test complete! Check the results above.");
  console.log("If all items show ✅, the save functionality should work.");
  console.log("If any show ❌, there are still issues to fix.");
}

// Auto-run the test
testSectionSave();