"""
Test script for Template Builder Admin API endpoints
"""

import os
import sys
import django
import requests
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, SiteProject
from django.contrib.auth.models import User

def test_admin_apis():
    print("=== Template Builder Admin API Test ===\n")
    
    # Start Django server first (need to do this manually)
    api_base = "http://127.0.0.1:8000/api"
    
    # 1. Login as admin to get token
    print("1. Testing admin authentication...")
    try:
        login_response = requests.post(f"{api_base}/auth/login/", json={
            "username": "admin",
            "password": "admin123"
        })
        
        if login_response.status_code == 200:
            token = login_response.json()["access"]
            headers = {"Authorization": f"Bearer {token}"}
            print("   ✓ Admin login successful")
        else:
            print(f"   ✗ Login failed: {login_response.status_code}")
            print("   Make sure Django server is running and admin user exists")
            return
            
    except requests.exceptions.ConnectionError:
        print("   ✗ Cannot connect to Django server")
        print("   Please start the server first:")
        print("   cd C:\\projects\\justcodeworks\\backend")
        print("   .venv\\Scripts\\activate")
        print("   python manage.py runserver 8000")
        return
    
    # 2. Test generate skeleton API
    print("\n2. Testing generate skeleton API...")
    try:
        # Get a SiteTemplate
        site_template = SiteTemplate.objects.filter(key='test-template-v1').first()
        if not site_template:
            print("   ✗ No test template found")
            return
            
        response = requests.post(
            f"{api_base}/admin/templates/{site_template.id}/generate-skeleton/",
            headers=headers,
            json={}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Skeleton generated successfully")
            print(f"   ✓ Project: {data['new_project_name']}")
            print(f"   ✓ Pages: {data['pages_cloned']}")
            print(f"   ✓ Sections: {data['sections_cloned']}")
            print(f"   ✓ Fields: {data['fields_cloned']}")
        else:
            print(f"   ✗ API call failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ✗ Error testing generate skeleton: {e}")
    
    # 3. Test clone project API
    print("\n3. Testing clone project API...")
    try:
        # Get a master project to clone
        master_project = SiteProject.objects.filter(is_master_template=True).first()
        if not master_project:
            print("   ✗ No master project found")
            return
            
        # Get or create test user
        test_user, created = User.objects.get_or_create(
            username='api_test_user',
            defaults={
                'email': 'apitest@example.com',
                'first_name': 'API',
                'last_name': 'Test'
            }
        )
        
        response = requests.post(
            f"{api_base}/admin/projects/{master_project.id}/clone/",
            headers=headers,
            json={
                "owner_email": "apitest@example.com",
                "name": "API Cloned Project",
                "slug": "api-cloned-project-test",
                "locales": ["en"]
            }
        )
        
        if response.status_code == 201:
            data = response.json()
            print(f"   ✓ Project cloned successfully")
            print(f"   ✓ New project: {data['new_project_name']}")
            print(f"   ✓ Pages: {data['pages_cloned']}")
            print(f"   ✓ Sections: {data['sections_cloned']}")
            print(f"   ✓ Fields: {data['fields_cloned']}")
        else:
            print(f"   ✗ API call failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"   ✗ Error testing clone project: {e}")
    
    print(f"\n=== Admin API Test Complete ===")

if __name__ == '__main__':
    test_admin_apis()