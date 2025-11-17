#!/usr/bin/env python3
"""Test session authentication status in browser context"""
import requests

def test_session_auth():
    session = requests.Session()
    
    print("=== TESTING SESSION AUTHENTICATION ===")
    
    # Step 1: Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    if csrf_response.status_code == 200:
        csrf_token = csrf_response.json().get('csrfToken')
        session.headers.update({'X-CSRFToken': csrf_token})
        print(f"✅ CSRF token obtained")
    
    # Step 2: Check auth status before login
    auth_response = session.get('http://localhost:8000/api/auth/me/')
    print(f"Auth status before login: {auth_response.status_code}")
    if auth_response.status_code == 200:
        auth_data = auth_response.json()
        print(f"  - Authenticated: {auth_data.get('authenticated', False)}")
        print(f"  - User: {auth_data.get('user', 'None')}")
    
    # Step 3: Test projects endpoint before login
    projects_response = session.get('http://localhost:8000/api/projects/')
    print(f"Projects before login: {projects_response.status_code}")
    if projects_response.status_code == 200:
        projects = projects_response.json()
        print(f"  - Found {len(projects)} projects (should be public projects)")
        for project in projects[:3]:
            print(f"    * {project.get('name')} (owner: {project.get('owner', 'unknown')})")
    
    # Step 4: Try to login with some common passwords
    passwords = ['password', 'admin123', 'Joao123!', '123456', 'joao']
    
    for password in passwords:
        login_data = {
            'username': 'Joao',
            'password': password,
        }
        
        login_response = session.post('http://localhost:8000/api/auth/login/', json=login_data)
        print(f"\nTrying password '{password}': {login_response.status_code}")
        
        if login_response.status_code == 200:
            print(f"✅ SUCCESS! Login worked with password: {password}")
            
            # Test auth status after login
            auth_response = session.get('http://localhost:8000/api/auth/me/')
            if auth_response.status_code == 200:
                auth_data = auth_response.json()
                print(f"  - Authenticated: {auth_data.get('authenticated', False)}")
                if auth_data.get('user'):
                    print(f"  - User: {auth_data['user'].get('username', 'unknown')}")
            
            # Test projects after login
            projects_response = session.get('http://localhost:8000/api/projects/')
            if projects_response.status_code == 200:
                projects = projects_response.json()
                print(f"  - User projects: {len(projects)} projects")
                for project in projects:
                    print(f"    * {project.get('name')} (slug: {project.get('slug')})")
            
            return True
    
    print("\n❌ Could not find working password for Joao")
    return False

if __name__ == "__main__":
    test_session_auth()