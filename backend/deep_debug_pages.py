import requests
import json

# Login and get token
login_response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "Joao", "password": "joao123"}
)

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens['access']
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Get all pages and filter manually to see what should be returned
    print("Getting all pages and filtering manually...")
    all_pages_response = requests.get("http://127.0.0.1:8000/api/pages/", headers=headers)
    
    if all_pages_response.status_code == 200:
        all_pages = all_pages_response.json()
        
        # Get user's projects
        projects_response = requests.get("http://127.0.0.1:8000/api/projects/", headers=headers)
        if projects_response.status_code == 200:
            user_projects = projects_response.json()
            user_project_ids = {p['id'] for p in user_projects}
            
            # Filter pages belonging to user's projects
            user_pages = [p for p in all_pages if p['project'] in user_project_ids]
            
            print(f"Total pages: {len(all_pages)}")
            print(f"User project IDs: {user_project_ids}")
            print(f"User pages (manual filter): {len(user_pages)}")
            
            if user_pages:
                print("Sample user page:", user_pages[0])
        
        # Now test the API endpoint with different headers
        print("\nTesting pages/my/ with different approaches...")
        
        # Test with different Content-Type
        test_headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json"
        }
        
        response = requests.get("http://127.0.0.1:8000/api/pages/my/", headers=test_headers)
        print(f"With Accept header - Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
else:
    print(f"Login failed: {login_response.text}")