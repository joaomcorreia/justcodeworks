#!/usr/bin/env python3
import requests
import json

def check_site_api():
    print("🔍 DEBUGGING SITE API ENDPOINTS")
    print("=" * 50)
    
    # Test public site API (what frontend uses)
    print("\n📡 Testing public site API:")
    try:
        # Note: just-code-works tenant site has been removed
        # Using marys-restaurant as example instead
        r = requests.get('http://localhost:8000/api/sites/marys-restaurant/public/')
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"Site: {data['name']}")
            print(f"Pages: {len(data['pages'])}")
            
            for page in data['pages']:
                sections = page.get('sections', [])
                print(f"  Page '{page['slug']}': {len(sections)} sections")
                if sections:
                    print(f"    First section: {sections[0]['identifier']}")
        else:
            print(f"Error: {r.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test direct page API
    print("\n📄 Testing direct page API (page 27):")
    try:
        r = requests.get('http://localhost:8000/api/pages/27/')
        print(f"Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            sections = data.get('sections', [])
            print(f"Sections found: {len(sections)}")
            
            if sections:
                print("Sample sections:")
                for s in sections[:3]:
                    print(f"  - {s['identifier']} (order {s['order']})")
        else:
            print(f"Error: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_site_api()