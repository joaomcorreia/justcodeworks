#!/usr/bin/env python3
"""
Test Script: Template Section Cloning Feature

Tests the new "Save as Reusable Section" functionality:
1. Verify the API endpoint works
2. Test section cloning from sample sites 
3. Check TemplateSection creation with fields
"""

import os
import sys
import requests
import json

# Configuration
DJANGO_BASE_URL = "http://127.0.0.1:8000/api"

def test_template_section_cloning():
    """Test creating a TemplateSection from existing Section"""
    print("🧪 Testing Template Section Cloning Feature...")
    
    # First, let's get some sample site data to find sections
    test_sites = [
        ("marys-restaurant", "Restaurant site sections"),
        ("oficina-paulo-calibra", "Auto garage site sections")
    ]
    
    for site_slug, description in test_sites:
        print(f"\n📋 Checking {description} ({site_slug})...")
        
        try:
            # Get site data
            response = requests.get(f"{DJANGO_BASE_URL}/sites/{site_slug}/public/", timeout=10)
            
            if response.status_code != 200:
                print(f"  ❌ Failed to fetch site data: {response.status_code}")
                continue
                
            site_data = response.json()
            
            # Find sections
            sections = []
            for page in site_data.get('pages', []):
                for section in page.get('sections', []):
                    sections.append({
                        'id': section.get('id'),
                        'identifier': section.get('identifier'),
                        'internal_name': section.get('internal_name', ''),
                        'page_slug': page.get('slug'),
                        'fields_count': len(section.get('fields', []))
                    })
            
            print(f"  📊 Found {len(sections)} sections")
            
            if sections:
                # Try to clone the first section
                test_section = sections[0]
                print(f"  🎯 Testing with section: {test_section['identifier']} (ID: {test_section['id']})")
                
                if test_section['id']:
                    test_clone_section(test_section, site_slug)
                else:
                    print(f"  ⚠️  Section has no ID, skipping clone test")
                    
        except requests.RequestException as e:
            print(f"  ❌ Network error: {e}")
        except Exception as e:
            print(f"  ❌ Error: {e}")

def test_clone_section(section_info, site_slug):
    """Test the actual cloning API"""
    print(f"    🔄 Attempting to clone section '{section_info['identifier']}'...")
    
    # Prepare test data
    test_name = f"Test Clone - {section_info['identifier']}"
    
    payload = {
        "section_id": section_info['id'],
        "name": test_name
    }
    
    try:
        # Make the API call (we'll expect 403/401 since we're not authenticated)
        response = requests.post(
            f"{DJANGO_BASE_URL}/admin/template-sections/from-section/",
            json=payload,
            timeout=10
        )
        
        print(f"    📡 API Response: {response.status_code}")
        
        if response.status_code == 201:
            # Success!
            result = response.json()
            print(f"    ✅ Successfully created TemplateSection:")
            print(f"       - ID: {result.get('id')}")
            print(f"       - Name: {result.get('name')}")
            print(f"       - Code: {result.get('code')}")
            print(f"       - Site Template: {result.get('site_template_key')}")
            
        elif response.status_code in [401, 403]:
            print(f"    ✅ API endpoint exists and requires authentication (expected)")
            print(f"    📝 Response: {response.json().get('detail', 'Authentication required')}")
            
        elif response.status_code == 400:
            error_data = response.json()
            print(f"    ⚠️  Bad request: {error_data.get('detail', 'Unknown error')}")
            
        elif response.status_code == 404:
            print(f"    ❌ Section not found (ID: {section_info['id']})")
            
        elif response.status_code == 500:
            print(f"    ❌ Server error - check Django logs")
            
        else:
            print(f"    ⚠️  Unexpected response: {response.status_code}")
            try:
                print(f"       Response: {response.json()}")
            except:
                print(f"       Raw response: {response.text[:200]}...")
                
    except requests.RequestException as e:
        print(f"    ❌ Request failed: {e}")

def test_django_models():
    """Test if the Django models are working"""
    print(f"\n🏗️  Testing Django Models Access...")
    
    try:
        # Try to access Django admin (should return login page)
        response = requests.get(f"{DJANGO_BASE_URL.replace('/api', '')}/admin/", timeout=5)
        
        if response.status_code == 200:
            print("  ✅ Django server is running")
        else:
            print(f"  ⚠️  Django admin returned: {response.status_code}")
            
    except requests.RequestException as e:
        print(f"  ❌ Django server not accessible: {e}")

def main():
    """Run all tests"""
    print("🚀 Template Section Cloning - Backend Test")
    print("=" * 50)
    
    test_django_models()
    test_template_section_cloning()
    
    print("\n" + "=" * 50)
    print("🎯 Backend Test Complete")
    print("\nExpected results:")
    print("✅ API endpoint should exist and require authentication")
    print("✅ Section data should be available from sample sites")
    print("✅ Cloning should work when properly authenticated")
    print("\nNext: Test in browser with admin login")

if __name__ == "__main__":
    main()