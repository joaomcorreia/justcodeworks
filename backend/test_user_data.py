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
    
    print("Testing projects endpoint...")
    projects_response = requests.get(
        "http://127.0.0.1:8000/api/projects/",
        headers=headers
    )
    
    print(f"Projects Status: {projects_response.status_code}")
    if projects_response.status_code == 200:
        projects = projects_response.json()
        print(f"Found {len(projects)} projects for user:")
        for project in projects:
            print(f"- {project['name']} ({project['slug']})")
    
    print("\nTesting pages endpoint...")
    pages_response = requests.get(
        "http://127.0.0.1:8000/api/pages/my/",
        headers=headers
    )
    
    print(f"Pages Status: {pages_response.status_code}")
    if pages_response.status_code == 200:
        pages = pages_response.json()
        print(f"Found {len(pages)} pages")
        for page in pages[:3]:  # Show first 3
            print(f"- {page['title']} ({page['slug']})")
    else:
        print(f"Pages Error: {pages_response.text}")
else:
    print(f"Login failed: {login_response.text}")