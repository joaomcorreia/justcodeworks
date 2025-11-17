#!/usr/bin/env python3
"""
Test editing functionality for logged in user
"""
import requests
import json

def test_editing_access():
    print("🔍 TESTING EDITING ACCESS")
    print("=" * 50)
    
    # Check which projects Joao owns
    session = requests.Session()
    
    # Login as Joao
    print("1. Logging in as Joao...")
    login_response = session.post(
        'http://127.0.0.1:8000/api/auth/login/',
        json={'username': 'Joao', 'password': '3934Ibanez'}
    )
    
    if login_response.status_code == 200:
        print("   ✅ Login successful")
        user_data = login_response.json()
        print(f"   User: {user_data['user']['username']}")
        print(f"   Is Staff: {user_data['user']['is_staff']}")
    else:
        print(f"   ❌ Login failed: {login_response.status_code}")
        return
    
    # Check projects
    print("\n2. Checking user's projects...")
    projects_response = session.get('http://127.0.0.1:8000/api/projects/')
    
    if projects_response.status_code == 200:
        projects = projects_response.json()
        print(f"   Projects owned by Joao: {len(projects)}")
        
        for project in projects[:3]:  # Show first 3
            print(f"   - {project['name']} (slug: {project['slug']})")
            
        if projects:
            # Test editing a section
            test_project = projects[0]
            print(f"\n3. Testing editing on project: {test_project['name']}")
            
            # Get sections for this project
            sections_response = session.get(f"http://127.0.0.1:8000/api/sections/")
            
            if sections_response.status_code == 200:
                sections = sections_response.json()
                print(f"   Available sections: {len(sections)}")
                
                if sections:
                    print("   Section details:")
                    for i, section in enumerate(sections[:3]):
                        print(f"     {i+1}. ID: {section['id']}, Identifier: {section['identifier']}")
                    
                    test_section = sections[0]
                    print(f"   Testing section: ID {test_section['id']}, {test_section['identifier']}")
                    
                    # Get CSRF token and try to update the section
                    csrf_response = session.get('http://127.0.0.1:8000/api/csrf/')
                    csrf_token = csrf_response.json().get('csrfToken') if csrf_response.status_code == 200 else None
                    
                    update_data = {"content": {"test_edit": "This is a test edit"}}
                    
                    headers = {'Content-Type': 'application/json'}
                    if csrf_token:
                        headers['X-CSRFToken'] = csrf_token
                    
                    update_response = session.patch(
                        f"http://127.0.0.1:8000/api/sections/{test_section['id']}/",
                        json=update_data,
                        headers=headers
                    )
                    
                    print(f"   Update status: {update_response.status_code}")
                    if update_response.status_code == 200:
                        print("   ✅ EDITING WORKS! You can edit content.")
                    else:
                        print(f"   ❌ Edit failed: {update_response.text}")
                else:
                    print("   No sections found to test")
            else:
                print(f"   Failed to get sections: {sections_response.status_code}")
    else:
        print(f"   ❌ Failed to get projects: {projects_response.status_code}")
    
    print("\n" + "="*50)
    print("DASHBOARD URLS:")
    print("🌐 Main Dashboard: http://localhost:3002/en/dashboard")
    print("🔧 Website Builder: http://localhost:3002/en/dashboard/website")
    print("👨‍💼 Admin Panel: http://localhost:3002/en/admin")
    
if __name__ == "__main__":
    test_editing_access()