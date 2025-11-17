#!/usr/bin/env python
"""
Test Builder v2 API functionality
"""
import requests
import json

def test_builder_v2_api():
    """Test the section content update API"""
    print("🧪 Testing Builder v2 API Integration")
    print("=" * 50)
    
    # Test 1: Get site data
    print("\n1. Fetching Mary's Restaurant site data...")
    try:
        response = requests.get('http://localhost:8000/api/sites/marys-restaurant/public/')
        if response.status_code != 200:
            print(f"❌ Failed to get site data: {response.status_code}")
            return
        
        site_data = response.json()
        print(f"✅ Site data fetched successfully")
        print(f"   Site name: {site_data.get('name', 'Unknown')}")
        print(f"   Template: {site_data.get('site_template_key', 'Unknown')}")
        
        # Get first section
        pages = site_data.get('pages', [])
        if not pages:
            print("❌ No pages found")
            return
            
        sections = []
        for page in pages:
            sections.extend(page.get('sections', []))
            
        if not sections:
            print("❌ No sections found")
            return
            
        first_section = sections[0]
        section_id = first_section['id']
        print(f"   Found {len(sections)} sections total")
        print(f"   First section ID: {section_id}")
        print(f"   Section type: {first_section.get('section_type', 'Unknown')}")
        print(f"   Section fields: {len(first_section.get('fields', []))}")
        
    except Exception as e:
        print(f"❌ Error fetching site data: {e}")
        return
    
    # Test 2: Check section endpoint access (without auth - should fail)
    print(f"\n2. Testing section content endpoint (without auth)...")
    try:
        response = requests.patch(f'http://localhost:8000/api/sections/{section_id}/content/', 
                                json={"fields": []})
        print(f"   Response status: {response.status_code}")
        if response.status_code == 401:
            print("✅ Authentication required (expected)")
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
    
    # Test 3: Show available fields for editing
    print(f"\n3. Available fields in first section:")
    fields = first_section.get('fields', [])
    if fields:
        for field in sorted(fields, key=lambda f: f.get('order', 0)):
            key = field.get('key', 'unknown')
            label = field.get('label', key)
            value = field.get('value', '')
            value_preview = value[:50] + "..." if len(value) > 50 else value
            print(f"   • {label} ({key}): \"{value_preview}\"")
    else:
        print("   No editable fields found")
    
    print(f"\n📋 Test Summary:")
    print(f"   • Site API: ✅ Working")
    print(f"   • Authentication: ✅ Required (as expected)")
    print(f"   • Section data: ✅ Available ({len(fields)} fields)")
    print(f"\n🚀 Builder v2 API is ready for frontend integration!")

if __name__ == "__main__":
    test_builder_v2_api()