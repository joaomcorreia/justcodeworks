import requests

# Login and get token
login_response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "Joao", "password": "joao123"}
)

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens['access']
    
    # Test admin templates endpoint with type filter
    headers = {"Authorization": f"Bearer {access_token}"}
    
    print("Testing type=website filter:")
    website_response = requests.get(
        "http://127.0.0.1:8000/api/admin/templates/?type=website",
        headers=headers
    )
    
    if website_response.status_code == 200:
        templates = website_response.json()
        print(f"Found {len(templates)} website templates")
        
    print("\nTesting type=email filter:")
    email_response = requests.get(
        "http://127.0.0.1:8000/api/admin/templates/?type=email",
        headers=headers
    )
    
    if email_response.status_code == 200:
        templates = email_response.json()
        print(f"Found {len(templates)} email templates")
        
    print("\nTesting status=published filter:")
    published_response = requests.get(
        "http://127.0.0.1:8000/api/admin/templates/?status=published",
        headers=headers
    )
    
    if published_response.status_code == 200:
        templates = published_response.json()
        print(f"Found {len(templates)} published templates")
else:
    print(f"Login failed: {login_response.text}")