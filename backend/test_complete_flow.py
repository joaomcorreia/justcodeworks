#!/usr/bin/env python
"""
Comprehensive test to reproduce the exact browser issue
"""
import requests
import json

def test_complete_flow():
    print("🔍 Testing the complete browser-like authentication flow...")
    
    # Use a session like the browser does
    session = requests.Session()
    
    # Step 1: Test if the endpoints are accessible
    print("\n1️⃣ Testing endpoint accessibility...")
    try:
        response = session.get("http://localhost:8000/api/admin/sites/")
        print(f"   Status without auth: {response.status_code}")
        if response.status_code == 403:
            print("   ✓ Expected 403 - endpoint requires authentication")
        elif response.status_code == 200:
            print("   ⚠️  Unexpected 200 - endpoint is public (debug mode?)")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Connection error: {e}")
        return
    
    # Step 2: Get CSRF token
    print("\n2️⃣ Getting CSRF token...")
    try:
        csrf_response = session.get("http://localhost:8000/api/csrf/")
        if csrf_response.status_code == 200:
            csrf_data = csrf_response.json()
            csrf_token = csrf_data.get('csrfToken')
            print(f"   ✓ CSRF token obtained: {csrf_token[:20]}...")
        else:
            print(f"   ❌ Failed to get CSRF token: {csrf_response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ CSRF error: {e}")
        return
    
    # Step 3: Login with staff user
    print("\n3️⃣ Logging in as staff user...")
    login_data = {
        "username": "admin", 
        "password": "admin123"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
        "Origin": "http://localhost:3000",
        "Referer": "http://localhost:3000/en/admin/sites"
    }
    
    try:
        login_response = session.post(
            "http://localhost:8000/api/auth/login/",
            json=login_data,
            headers=headers
        )
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            user_data = login_result.get('user', {})
            print(f"   ✓ Login successful")
            print(f"   📧 User: {user_data.get('email')}")
            print(f"   👔 Is staff: {user_data.get('is_staff')}")
            print(f"   🔑 Session cookies: {list(session.cookies.keys())}")
            
            if not user_data.get('is_staff'):
                print("   ❌ User is not staff!")
                return
                
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            return
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return
    
    # Step 4: Test admin sites endpoint with authentication
    print("\n4️⃣ Testing admin sites endpoint with authentication...")
    
    # Simulate exact browser headers
    auth_headers = {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000",
        "Referer": "http://localhost:3000/en/admin/sites"
    }
    
    try:
        sites_response = session.get(
            "http://localhost:8000/api/admin/sites/",
            headers=auth_headers
        )
        
        print(f"   Status: {sites_response.status_code}")
        
        if sites_response.status_code == 200:
            sites_data = sites_response.json()
            print(f"   ✅ SUCCESS! Found {len(sites_data)} sites")
            
            if sites_data:
                first_site = sites_data[0]
                print(f"   📋 First site: {first_site.get('name')} ({first_site.get('slug')})")
            
        elif sites_response.status_code == 403:
            print("   ❌ 403 Forbidden - Authentication or permission issue")
            print(f"   Response: {sites_response.text}")
            
            # Debug: Check what the server thinks about our user
            me_response = session.get("http://localhost:8000/api/auth/me/")
            if me_response.status_code == 200:
                me_data = me_response.json()
                print(f"   🔍 Auth check - Authenticated: {me_data.get('authenticated')}")
                user_info = me_data.get('user', {})
                print(f"   🔍 Auth check - Is staff: {user_info.get('is_staff')}")
            
        else:
            print(f"   ❌ Unexpected status: {sites_response.status_code}")
            print(f"   Response: {sites_response.text}")
            
    except Exception as e:
        print(f"   ❌ Sites API error: {e}")
    
    # Step 5: Test the specific site endpoint too
    print("\n5️⃣ Testing specific site endpoint...")
    try:
        # Get first site slug from previous response if available
        if 'sites_data' in locals() and sites_data:
            first_slug = sites_data[0].get('slug')
            site_response = session.get(
                f"http://localhost:8000/api/admin/sites/{first_slug}/public/",
                headers=auth_headers
            )
            
            print(f"   Status: {site_response.status_code}")
            if site_response.status_code == 200:
                print("   ✅ Site detail endpoint working!")
            else:
                print(f"   ❌ Site detail failed: {site_response.text}")
    except Exception as e:
        print(f"   ❌ Site detail error: {e}")
    
    print("\n" + "="*60)
    print("🎯 SUMMARY:")
    print(f"   • CSRF token: {'✓' if 'csrf_token' in locals() else '❌'}")
    print(f"   • Staff login: {'✓' if 'login_result' in locals() and login_result.get('success') else '❌'}")
    print(f"   • Sites API: {'✅' if 'sites_response' in locals() and sites_response.status_code == 200 else '❌'}")
    
    if 'sites_response' in locals() and sites_response.status_code != 200:
        print("\n💡 DIAGNOSIS:")
        if sites_response.status_code == 403:
            print("   The user authentication is not working properly.")
            print("   This could be due to:")
            print("   - Session cookies not being sent correctly")
            print("   - CORS issues between frontend and backend")
            print("   - Permission class not recognizing the session")
        
    print("="*60)

if __name__ == "__main__":
    test_complete_flow()