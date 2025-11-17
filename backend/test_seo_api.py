#!/usr/bin/env python3

"""
Test SEO API endpoint
"""

import os
import sys
import django
import requests
import json

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Page, SiteProject
from django.contrib.auth.models import User

def test_seo_api():
    """Test the SEO API endpoint"""
    print("🔍 Testing SEO API endpoint...")
    
    # Get test data
    try:
        user = User.objects.get(username='Joao')
        print(f"✅ Found user: {user.username}")
        
        project = SiteProject.objects.filter(owner=user).first()
        if not project:
            print("❌ No project found for user")
            return
        print(f"✅ Found project: {project.name}")
        
        page = project.pages.first()
        if not page:
            print("❌ No pages found for project")
            return
        print(f"✅ Found page: {page.title} (ID: {page.id})")
        
        # Print current SEO data
        print(f"📄 Current SEO data:")
        print(f"   meta_title: '{page.meta_title}'")
        print(f"   meta_description: '{page.meta_description}'")
        print(f"   meta_slug: '{page.meta_slug}'")
        print(f"   indexable: {page.indexable}")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return
    
    # Test API endpoint
    api_url = f"http://localhost:8000/api/pages/{page.id}/seo/"
    
    # Get CSRF token
    csrf_response = requests.get("http://localhost:8000/api/csrf/")
    if csrf_response.status_code != 200:
        print(f"❌ Failed to get CSRF token: {csrf_response.status_code}")
        return
    
    csrf_token = csrf_response.cookies.get('csrftoken')
    print(f"✅ Got CSRF token: {csrf_token[:10]}...")
    
    # Test payload
    payload = {
        "meta_title": "Test SEO Title",
        "meta_description": "Test SEO Description",
        "meta_slug": "test-seo-slug",
        "indexable": True
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
    }
    
    # Make API request
    print(f"📡 Making PATCH request to: {api_url}")
    print(f"📦 Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.patch(
        api_url,
        headers=headers,
        cookies=csrf_response.cookies,
        json=payload
    )
    
    print(f"📊 Response status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SEO update successful!")
        print(f"📋 Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"❌ SEO update failed!")
        print(f"📋 Response: {response.text}")
        print(f"📋 Headers: {dict(response.headers)}")

if __name__ == "__main__":
    test_seo_api()