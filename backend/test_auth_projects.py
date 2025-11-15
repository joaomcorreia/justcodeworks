#!/usr/bin/env python
"""
Test the projects API with authentication to see if it filters by user
"""
import requests

def test_projects_with_auth():
    """Test fetching projects with authentication"""
    
    print("🔍 Testing projects API with authentication...")
    
    # Create a session for cookies
    session = requests.Session()
    
    # First login as mary_restaurant
    print("1. Logging in as mary_restaurant...")
    login_url = 'http://127.0.0.1:8000/api/auth/login/'
    login_data = {
        'username': 'mary_restaurant',
        'password': '3934Ibanez'
    }
    
    login_response = session.post(login_url, json=login_data)
    print(f"   Login Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        print("   ✅ Login successful")
        
        # Now fetch projects with authentication
        print("\n2. Fetching projects with authentication...")
        projects_url = 'http://127.0.0.1:8000/api/projects/'
        
        projects_response = session.get(projects_url)
        print(f"   Status: {projects_response.status_code}")
        
        if projects_response.status_code == 200:
            projects = projects_response.json()
            print(f"   Found {len(projects)} projects for mary_restaurant:")
            for project in projects:
                print(f"   - ID: {project.get('id', 'N/A')}")
                print(f"     Name: {project.get('name', 'N/A')}")
                owner = project.get('owner', {})
                if isinstance(owner, dict):
                    username = owner.get('username', 'N/A')
                else:
                    username = str(owner)
                print(f"     Owner: {username}")
                print()
        else:
            print(f"   Error: {projects_response.text}")
    else:
        print(f"   ❌ Login failed: {login_response.text}")

if __name__ == '__main__':
    test_projects_with_auth()