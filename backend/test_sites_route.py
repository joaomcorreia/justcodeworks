#!/usr/bin/env python
"""
Test script to verify the /sites/[slug] frontend route works correctly
"""
import requests
import time

def test_frontend_route():
    """Test the Next.js frontend route"""
    print("🧪 Testing Frontend Route: /sites/[slug]\n")
    
    frontend_base = "http://localhost:3006"
    
    # Test valid slug
    print("📋 Testing valid slug: marys-restaurant")
    try:
        response = requests.get(f"{frontend_base}/en/sites/marys-restaurant", timeout=10)
        if response.status_code == 200:
            content = response.text
            if "Mary's Restaurant" in content:
                print("✅ Valid slug test: PASS - Page loads with restaurant data")
            else:
                print("⚠️ Valid slug test: Page loads but may not show data correctly")
        else:
            print(f"❌ Valid slug test: FAIL - Status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Valid slug test: FAIL - {e}")
    
    # Test invalid slug
    print("\n📋 Testing invalid slug: nonexistent-site")
    try:
        response = requests.get(f"{frontend_base}/en/sites/nonexistent-site", timeout=10)
        if response.status_code == 200:
            content = response.text
            if "Failed to load site" in content or "404" in content:
                print("✅ Invalid slug test: PASS - Shows error message")
            else:
                print("⚠️ Invalid slug test: Page loads but error handling may not be working")
        else:
            print(f"❌ Invalid slug test: FAIL - Status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Invalid slug test: FAIL - {e}")

def test_backend_api():
    """Test the backend API directly"""
    print("\n🔗 Testing Backend API: /api/sites/[slug]/public/\n")
    
    api_base = "http://127.0.0.1:8000/api"
    
    # Test valid slug
    print("📋 Testing API with valid slug: marys-restaurant")
    try:
        response = requests.get(f"{api_base}/sites/marys-restaurant/public/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('name') == "Mary's Restaurant":
                print("✅ API valid slug test: PASS - Returns restaurant data")
                print(f"   - Name: {data['name']}")
                print(f"   - Template: {data.get('site_template_key')}")
                print(f"   - Pages: {len(data.get('pages', []))}")
            else:
                print("⚠️ API valid slug test: Returns JSON but structure may be wrong")
        else:
            print(f"❌ API valid slug test: FAIL - Status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ API valid slug test: FAIL - {e}")
    
    # Test invalid slug
    print("\n📋 Testing API with invalid slug: nonexistent-site")
    try:
        response = requests.get(f"{api_base}/sites/nonexistent-site/public/", timeout=10)
        if response.status_code == 404:
            print("✅ API invalid slug test: PASS - Returns 404 as expected")
        else:
            print(f"⚠️ API invalid slug test: Status {response.status_code} (expected 404)")
    except requests.exceptions.RequestException as e:
        print(f"❌ API invalid slug test: FAIL - {e}")

if __name__ == "__main__":
    print("🧪 Testing /sites/[slug] Implementation\n")
    print("=" * 60)
    
    # Test backend first
    test_backend_api()
    
    print("\n" + "=" * 60)
    
    # Test frontend
    test_frontend_route()
    
    print("\n" + "=" * 60)
    print("\n🎉 Test Summary:")
    print("   Backend API: /api/sites/<slug>/public/")
    print("   Frontend Route: /sites/[slug]")
    print("   Example URLs:")
    print("     • http://localhost:3006/en/sites/marys-restaurant")
    print("     • http://127.0.0.1:8000/api/sites/marys-restaurant/public/")