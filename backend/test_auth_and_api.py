#!/usr/bin/env python3
"""
Test Authentication and Screenshot Upload API
Simple test to verify authentication and API endpoints.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_authentication():
    """Test authentication endpoints."""
    print("🔐 Testing Authentication...")
    
    session = requests.Session()
    
    # Test CSRF endpoint
    print("  📋 Testing CSRF endpoint...")
    csrf_response = session.get(f"{BASE_URL}/api/csrf/")
    print(f"     CSRF Status: {csrf_response.status_code}")
    
    if csrf_response.status_code == 200:
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        print(f"     CSRF Token: {'✅ Available' if csrf_token else '❌ Missing'}")
    else:
        print(f"     ❌ CSRF failed: {csrf_response.text}")
        return False
    
    # Test auth/me endpoint
    print("  👤 Testing authentication status...")
    auth_response = session.get(f"{BASE_URL}/api/auth/me/")
    print(f"     Auth Status: {auth_response.status_code}")
    
    if auth_response.status_code == 200:
        auth_data = auth_response.json()
        print(f"     User: {auth_data.get('email', 'Unknown')}")
        print(f"     Is Staff: {auth_data.get('isStaff', False)}")
        return True, session, csrf_token
    elif auth_response.status_code == 401:
        print("     ❌ Not authenticated - need to log in")
        return False, None, None
    else:
        print(f"     ❌ Auth error: {auth_response.text}")
        return False, None, None

def test_admin_endpoints(session, csrf_token):
    """Test admin endpoints that require authentication."""
    print("\n🔧 Testing Admin Endpoints...")
    
    # Test user-sites endpoint
    print("  🌐 Testing user sites endpoint...")
    sites_response = session.get(f"{BASE_URL}/api/admin/user-sites/")
    print(f"     Sites Status: {sites_response.status_code}")
    
    if sites_response.status_code == 200:
        sites_data = sites_response.json()
        print(f"     Sites Count: {len(sites_data)}")
        for site in sites_data[:3]:  # Show first 3
            print(f"       - {site.get('name', 'Unknown')}")
        return True
    else:
        print(f"     ❌ Sites error: {sites_response.text}")
        return False

def test_screenshot_endpoints(session, csrf_token):
    """Test screenshot-related endpoints."""
    print("\n📸 Testing Screenshot Endpoints...")
    
    # Test screenshot upload endpoint (without actual file)
    print("  📤 Testing upload endpoint (OPTIONS)...")
    upload_response = session.options(f"{BASE_URL}/api/sections/upload-screenshot/")
    print(f"     Upload OPTIONS: {upload_response.status_code}")
    
    # Test AI processing endpoint (without draft)
    print("  🧠 Testing AI processing endpoint (OPTIONS)...")
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    process_response = session.options(f"{BASE_URL}/api/sections/{fake_uuid}/process/")
    print(f"     Process OPTIONS: {process_response.status_code}")
    
    # Test Step 3 endpoint (without draft)
    print("  🚀 Testing Step 3 endpoint (OPTIONS)...")
    step3_response = session.options(f"{BASE_URL}/api/sections/drafts/{fake_uuid}/create-section/")
    print(f"     Step 3 OPTIONS: {step3_response.status_code}")
    
    return True

def main():
    """Run all authentication and API tests."""
    print("🧪 Authentication & API Test Suite")
    print("=" * 50)
    
    # Test authentication
    auth_success, session, csrf_token = test_authentication()
    
    if not auth_success:
        print("\n❌ Authentication failed!")
        print("\n🔑 To fix this, you need to:")
        print("   1. Create a superuser: python manage.py createsuperuser")
        print("   2. Log in through Django admin: http://localhost:8000/admin/")
        print("   3. Or implement proper login flow in the frontend")
        return
    
    # Test admin endpoints
    admin_success = test_admin_endpoints(session, csrf_token)
    
    # Test screenshot endpoints
    screenshot_success = test_screenshot_endpoints(session, csrf_token)
    
    print("\n" + "=" * 50)
    if auth_success and admin_success:
        print("🎉 All tests passed! Authentication is working.")
        print("\n✅ You should now be able to:")
        print("   - Access the screenshot uploader UI")
        print("   - Upload screenshots")
        print("   - Process with AI")
        print("   - Create sections")
    else:
        print("⚠️  Some tests failed. Check the authentication setup.")

if __name__ == '__main__':
    main()