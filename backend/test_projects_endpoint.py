#!/usr/bin/env python3
"""Test the /api/projects/ endpoint"""
import requests

def test_projects_endpoint():
    session = requests.Session()
    
    # Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    if csrf_response.status_code == 200:
        csrf_token = csrf_response.json().get('csrfToken')
        session.headers.update({'X-CSRFToken': csrf_token})
        print(f"✅ CSRF token obtained")
    
    # Test unauthenticated access
    projects_response = session.get('http://localhost:8000/api/projects/')
    print(f"Unauthenticated /api/projects/: {projects_response.status_code}")
    
    # Try to login (we need to figure out the right password)
    # For now, let's test what we get without auth
    if projects_response.status_code == 200:
        projects = projects_response.json()
        print(f"✅ Found {len(projects)} projects (unauthenticated)")
    elif projects_response.status_code == 401:
        print("🔒 Authentication required for /api/projects/")
    elif projects_response.status_code == 403:
        print("🔒 Authorization required for /api/projects/")
    else:
        print(f"❌ Unexpected status: {projects_response.status_code}")
        print(f"Response: {projects_response.text[:200]}...")

if __name__ == "__main__":
    test_projects_endpoint()