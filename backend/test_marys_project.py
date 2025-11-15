#!/usr/bin/env python
"""
Test the projects API to see Mary's Restaurant data
"""
import requests

def test_marys_project():
    """Test fetching Mary's Restaurant project data"""
    
    print("🔍 Testing Mary's Restaurant project API...")
    
    # First check all projects
    url = 'http://127.0.0.1:8000/api/projects/'
    
    print(f"1. Fetching all projects from: {url}")
    try:
        response = requests.get(url)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            projects = response.json()
            print(f"   Found {len(projects)} projects:")
            for project in projects:
                print(f"   - ID: {project.get('id', 'N/A')}")
                print(f"     Name: {project.get('name', 'N/A')}")
                print(f"     Owner: {project.get('owner', 'N/A')}")
                print(f"     Template: {project.get('site_template', 'N/A')}")
                print()
        else:
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")

if __name__ == '__main__':
    test_marys_project()