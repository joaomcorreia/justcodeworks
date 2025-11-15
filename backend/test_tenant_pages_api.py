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
    
    # Test tenant pages endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    pages_response = requests.get(
        "http://127.0.0.1:8000/api/pages/my/",
        headers=headers
    )
    
    print(f"Status: {pages_response.status_code}")
    if pages_response.status_code == 200:
        pages = pages_response.json()
        print(f"Found {len(pages)} pages for user:")
        for page in pages:
            print(f"- {page['title']} ({page['slug']}) - {page['locale']} - {'Published' if page['is_published'] else 'Draft'}")
            print(f"  Path: {page['path']} | Project: {page['project_name']}")
    else:
        print(f"Error: {pages_response.text}")
else:
    print(f"Login failed: {login_response.text}")