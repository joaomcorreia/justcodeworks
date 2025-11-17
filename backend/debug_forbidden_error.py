#!/usr/bin/env python3
"""
Debug the Forbidden error when updating section content
"""
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from sites.models import SiteProject, Page, Section

User = get_user_model()

def test_forbidden_error():
    print("🔍 DEBUGGING FORBIDDEN ERROR")
    print("=" * 50)
    
    # Test API endpoints
    base_url = "http://127.0.0.1:8000"
    
    # 1. Test CSRF endpoint
    print("\n1. Testing CSRF endpoint...")
    try:
        csrf_response = requests.get(f"{base_url}/api/csrf/")
        print(f"   CSRF Status: {csrf_response.status_code}")
        if csrf_response.status_code == 200:
            csrf_data = csrf_response.json()
            csrf_token = csrf_data.get('csrfToken')
            print(f"   CSRF Token: {csrf_token[:20]}...")
        else:
            print(f"   CSRF Error: {csrf_response.text}")
            return
    except Exception as e:
        print(f"   CSRF Exception: {e}")
        return
    
    # 2. Test authentication endpoint
    print("\n2. Testing authentication...")
    session = requests.Session()
    session.get(f"{base_url}/api/csrf/")  # Get CSRF token
    
    auth_response = session.get(f"{base_url}/api/auth/me/")
    print(f"   Auth Status: {auth_response.status_code}")
    if auth_response.status_code == 200:
        user_data = auth_response.json()
        print(f"   User: {user_data}")
        is_authenticated = user_data.get('isAuthenticated', False)
        print(f"   Is Authenticated: {is_authenticated}")
    else:
        print(f"   Auth response: {auth_response.text}")
        is_authenticated = False
    
    # 3. Check database for users and content
    print("\n3. Checking database...")
    users = User.objects.all()
    print(f"   Total Users: {users.count()}")
    for user in users[:3]:
        print(f"   - {user.username} (ID: {user.id})")
    
    projects = SiteProject.objects.all()
    print(f"   Total Projects: {projects.count()}")
    for project in projects[:3]:
        print(f"   - {project.name} (Owner: {project.owner.username if project.owner else 'None'})")
    
    sections = Section.objects.all()
    print(f"   Total Sections: {sections.count()}")
    
    # 4. Test section update with proper authentication
    print("\n4. Testing section update...")
    if sections.exists():
        test_section = sections.first()
        print(f"   Testing with Section ID: {test_section.id}")
        print(f"   Section belongs to project: {test_section.page.project.name}")
        print(f"   Project owner: {test_section.page.project.owner.username if test_section.page.project.owner else 'None'}")
        
        # Try to update without authentication
        update_url = f"{base_url}/api/builder/sections/{test_section.id}/"
        update_data = {"content": {"test": "forbidden debug"}}
        
        print(f"\n   Attempting PATCH to: {update_url}")
        
        # First without authentication
        response = requests.patch(
            update_url,
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Without auth - Status: {response.status_code}")
        print(f"   Without auth - Response: {response.text}")
        
        # Try with session (still might not be authenticated)
        csrf_response = session.get(f"{base_url}/api/csrf/")
        csrf_token = csrf_response.json().get('csrfToken')
        
        response2 = session.patch(
            update_url,
            json=update_data,
            headers={
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            }
        )
        print(f"   With session - Status: {response2.status_code}")
        print(f"   With session - Response: {response2.text}")
    
    # 5. Check authentication requirements in views
    print("\n5. Checking ViewSet permissions...")
    from sites.views import SectionViewSet
    viewset = SectionViewSet()
    print(f"   SectionViewSet permission classes: {viewset.permission_classes}")
    print(f"   SectionViewSet authentication classes: {viewset.authentication_classes}")

if __name__ == "__main__":
    test_forbidden_error()