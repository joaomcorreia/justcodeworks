#!/usr/bin/env python3
"""
Test Script: Screenshot Upload Authentication and Projects API
Tests if the frontend authentication works with the backend APIs
"""

import requests

def test_authentication_and_projects():
    """Test authentication and projects API for screenshot upload"""
    
    print("🔍 Testing Screenshot Upload Authentication...")
    
    # Test 1: Check auth endpoint (no authentication)
    print("\n1. Testing auth endpoint (no auth)...")
    auth_response = requests.get('http://localhost:8000/api/auth/me/')
    print(f"   Status: {auth_response.status_code}")
    
    # Test 2: Check with session ID (simulating browser authentication)
    print("\n2. Testing with session authentication...")
    session_id = '64nnmg91hwadsy73505zmmh06df83y3v'  # From browser
    cookies = {'sessionid': session_id}
    
    auth_response_session = requests.get('http://localhost:8000/api/auth/me/', cookies=cookies)
    print(f"   Auth Status: {auth_response_session.status_code}")
    
    if auth_response_session.status_code == 200:
        user_data = auth_response_session.json()
        print(f"   User: {user_data.get('username')}")
        print(f"   Staff: {user_data.get('is_staff')}")
        print(f"   ID: {user_data.get('id')}")
    
    # Test 3: Check user sites API with authentication
    print("\n3. Testing user sites API...")
    sites_response = requests.get('http://localhost:8000/api/admin/user-sites/', cookies=cookies)
    print(f"   Sites API Status: {sites_response.status_code}")
    
    if sites_response.status_code == 200:
        sites_data = sites_response.json()
        print(f"   Raw response type: {type(sites_data)}")
        
        # Handle both list and dict responses
        if isinstance(sites_data, list):
            results = sites_data
        else:
            results = sites_data.get('results', [])
        
        print(f"   Available projects: {len(results)}")
        
        if results:
            print("   Projects:")
            for project in results[:5]:
                print(f"   - {project['name']} (ID: {project['id']})")
        else:
            print("   ⚠️  No projects returned - user may not own any projects")
    else:
        try:
            error_data = sites_response.json()
            print(f"   Error: {error_data}")
        except:
            print(f"   Error: {sites_response.text}")
    
    # Test 4: Check if we need to create test projects for this user
    if sites_response.status_code == 200:
        sites_data = sites_response.json()
        results = sites_data if isinstance(sites_data, list) else sites_data.get('results', [])
        if not results:
            print("\n4. ⚠️  User has no projects - need to assign existing projects or create new ones")
            
            # Show what projects exist in the system
            print("\n   Available projects in system:")
            import os, django
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
            django.setup()
            
            from sites.models import SiteProject
            projects = SiteProject.objects.select_related('owner').all()
            for project in projects:
                owner_name = project.owner.username if project.owner else "No Owner"
                print(f"   - {project.name}: Owner = {owner_name}")

if __name__ == "__main__":
    test_authentication_and_projects()