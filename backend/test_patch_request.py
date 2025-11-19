#!/usr/bin/env python3

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

BASE_URL = "http://localhost:8000/api/main-site"

def test_patch_request():
    print("🔍 Testing PATCH request to main-site slider API")
    print("=" * 60)
    
    # Test data to send
    test_data = {
        'particles_enabled': True,
        'particles_density': 150,
        'particles_color': '#ff0000'
    }
    
    url = f"{BASE_URL}/sliders/hq-homepage-hero/"
    print(f"📡 PATCH URL: {url}")
    print(f"📋 Data: {test_data}")
    
    try:
        response = requests.patch(
            url,
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Status: {response.status_code}")
        print(f"📄 Content-Type: {response.headers.get('Content-Type')}")
        print(f"📝 Response: {response.text[:1000]}")
        
        if response.status_code >= 400:
            print("❌ Request failed!")
        else:
            print("✅ Request successful!")
            
    except Exception as e:
        print(f"💥 Exception: {e}")

if __name__ == "__main__":
    test_patch_request()