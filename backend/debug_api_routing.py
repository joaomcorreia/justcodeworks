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
    
    # Try the general pages endpoint
    print("Testing general pages endpoint...")
    response = requests.get("http://127.0.0.1:8000/api/pages/", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data)} pages")
        if data:
            print("First page:", data[0])
    else:
        print(f"Error: {response.text}")
        
    # Try to check Django urls
    print("\nTesting Django debug...")
    debug_response = requests.get("http://127.0.0.1:8000/api/", headers=headers)
    print(f"API root status: {debug_response.status_code}")
else:
    print(f"Login failed: {login_response.text}")