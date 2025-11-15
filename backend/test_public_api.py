#!/usr/bin/env python
"""
Test script for the public JSON API for tenant sites
"""
import os
import sys
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject
from sites.serializers import SiteProjectPublicSerializer

def test_public_api_serializer():
    """Test the public API serializer directly"""
    print("🧪 Testing Public API Serializer...")
    
    try:
        # Get Mary's Restaurant
        restaurant = SiteProject.objects.get(name="Mary's Restaurant")
        
        # Test serializer
        serializer = SiteProjectPublicSerializer(restaurant)
        data = serializer.data
        
        print("✅ Serializer working!")
        print(f"📋 Project: {data['name']} ({data['slug']})")
        print(f"🎨 Template: {data['site_template_key']}")
        print(f"📄 Pages: {len(data['pages'])}")
        
        # Show page details
        for page in data['pages']:
            print(f"   📄 {page['title']} ({page['slug']})")
            print(f"      Path: {page['path']}")
            print(f"      Sections: {len(page['sections'])}")
            
            for section in page['sections']:
                print(f"      📑 {section['internal_name']} ({section['identifier']}) - {len(section['fields'])} fields")
        
        print(f"\n📊 Total JSON size: {len(json.dumps(data))} characters")
        return True
        
    except SiteProject.DoesNotExist:
        print("❌ Mary's Restaurant not found!")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoint_url():
    """Test the API endpoint URL pattern"""
    print("\n🌐 Testing API Endpoint URL...")
    
    try:
        from django.urls import reverse
        from django.test import Client
        
        # Test URL pattern
        url = reverse('site-public-api', kwargs={'slug': 'marys-restaurant'})
        print(f"✅ URL pattern working: {url}")
        
        # Test with Django test client (no auth needed)
        client = Client()
        response = client.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API endpoint working!")
            print(f"📋 Response: {data['name']} with {len(data['pages'])} pages")
            return True
        else:
            print(f"❌ API returned status {response.status_code}")
            print(f"Response: {response.content}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Testing Public JSON API for Tenant Sites\n")
    
    # Test 1: Serializer
    serializer_success = test_public_api_serializer()
    
    # Test 2: API endpoint  
    api_success = test_api_endpoint_url()
    
    print(f"\n📊 Test Results:")
    print(f"   Serializer: {'✅ PASS' if serializer_success else '❌ FAIL'}")
    print(f"   API Endpoint: {'✅ PASS' if api_success else '❌ FAIL'}")
    
    if serializer_success and api_success:
        print(f"\n🎉 Public API ready!")
        print(f"   🔗 URL: GET /api/sites/marys-restaurant/public/")
        print(f"   📍 Full URL: http://127.0.0.1:8000/api/sites/marys-restaurant/public/")
        print(f"   🔓 No authentication required")
    else:
        print(f"\n⚠️ Some tests failed. Please check the issues above.")