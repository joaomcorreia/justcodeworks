#!/usr/bin/env python
"""
Test the main website API endpoint
"""
import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

def test_main_website_api():
    """Test the main website API endpoint"""
    print("🏠 Testing Main Website API")
    print("=" * 50)
    
    # Test English content
    print("\n🇬🇧 Testing English content:")
    try:
        response = requests.get('http://localhost:8000/api/main-site/public/?locale=en')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Site name: {data['site']['site_name']}")
            print(f"✅ Navigation items: {len(data['navigation'])}")
            print(f"✅ Pages: {len(data['pages'])}")
            
            # Show sample page
            if data['pages']:
                page = data['pages'][0]
                print(f"   📄 First page: {page['title']} ({page['slug']})")
                print(f"      Sections: {len(page['sections'])}")
                if page['sections']:
                    section = page['sections'][0]
                    print(f"      First section: {section['identifier']} ({len(section['fields'])} fields)")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test Portuguese content
    print("\n🇵🇹 Testing Portuguese content:")
    try:
        response = requests.get('http://localhost:8000/api/main-site/public/?locale=pt')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Site name: {data['site']['site_name']}")
            print(f"✅ Navigation items: {len(data['navigation'])}")
            print(f"✅ Pages: {len(data['pages'])}")
            
            # Show sample content
            if data['pages']:
                page = data['pages'][0]
                print(f"   📄 First page: {page['title']} ({page['slug']})")
                if page['sections'] and page['sections'][0]['fields']:
                    field = page['sections'][0]['fields'][0]
                    print(f"   🔤 Sample field: {field['key']} = {field['value'][:50]}...")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test Dutch content
    print("\n🇳🇱 Testing Dutch content:")
    try:
        response = requests.get('http://localhost:8000/api/main-site/public/?locale=nl')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Site name: {data['site']['site_name']}")
            print(f"✅ Navigation items: {len(data['navigation'])}")
            print(f"✅ Pages: {len(data['pages'])}")
            
            # Show sample content
            if data['pages']:
                page = data['pages'][0]
                print(f"   📄 First page: {page['title']} ({page['slug']})")
                if page['sections'] and page['sections'][0]['fields']:
                    field = page['sections'][0]['fields'][0]
                    print(f"   🔤 Sample field: {field['key']} = {field['value'][:50]}...")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")

    print(f"\n🔗 API Endpoint: GET /api/main-site/public/?locale=<lang>")
    print(f"   Available: http://localhost:8000/api/main-site/public/?locale=en")
    print(f"   Available: http://localhost:8000/api/main-site/public/?locale=pt")
    print(f"   Available: http://localhost:8000/api/main-site/public/?locale=nl")

if __name__ == "__main__":
    test_main_website_api()