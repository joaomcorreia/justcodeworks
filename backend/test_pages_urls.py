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
    
    # Try different URL variations
    urls_to_test = [
        "http://127.0.0.1:8000/api/pages/my/",
        "http://127.0.0.1:8000/api/pages/my",
        "http://127.0.0.1:8000/pages/my/",
        "http://127.0.0.1:8000/pages/my",
    ]
    
    for url in urls_to_test:
        print(f"\nTesting: {url}")
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Found {len(data)} pages")
            break
        else:
            print(f"Error: {response.text[:100]}")
else:
    print(f"Login failed: {login_response.text}")