#!/usr/bin/env python3
"""
Test the Template Lab API endpoints.
"""
import requests
import json

def test_template_sections_api():
    """Test the template sections API."""
    base_url = "http://127.0.0.1:8000/api"
    
    print("🧪 Testing Template Lab API endpoints\n")
    
    # Test restaurant-modern sections
    print("📋 Testing: /api/admin/site-templates/restaurant-modern/sections/")
    try:
        response = requests.get(f"{base_url}/admin/site-templates/restaurant-modern/sections/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            sections = response.json()
            print(f"✅ Found {len(sections)} sections for restaurant-modern:")
            for section in sections:
                print(f"  • {section['internal_name']} ({section['code']})")
        elif response.status_code == 403:
            print("⚠️ 403 Forbidden - This endpoint requires staff authentication (expected)")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    print("\n" + "="*50)
    
    # Test jcw-main sections  
    print("📋 Testing: /api/admin/site-templates/jcw-main/sections/")
    try:
        response = requests.get(f"{base_url}/admin/site-templates/jcw-main/sections/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            sections = response.json()
            print(f"✅ Found {len(sections)} sections for jcw-main:")
            for section in sections:
                print(f"  • {section['internal_name']} ({section['code']})")
        elif response.status_code == 403:
            print("⚠️ 403 Forbidden - This endpoint requires staff authentication (expected)")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    
    print("\n" + "="*50)
    
    # Test non-existent template
    print("📋 Testing: /api/admin/site-templates/nonexistent/sections/")
    try:
        response = requests.get(f"{base_url}/admin/site-templates/nonexistent/sections/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            sections = response.json()
            print(f"✅ Found {len(sections)} sections (should be 0 for non-existent template)")
        elif response.status_code == 403:
            print("⚠️ 403 Forbidden - This endpoint requires staff authentication (expected)")
        else:
            print(f"Response: {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_template_sections_api()