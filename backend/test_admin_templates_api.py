import requests

# Login and get token
login_response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "Joao", "password": "joao123"}
)

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens['access']
    
    # Test admin templates endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    templates_response = requests.get(
        "http://127.0.0.1:8000/api/admin/templates/",
        headers=headers
    )
    
    print(f"Status: {templates_response.status_code}")
    if templates_response.status_code == 200:
        templates = templates_response.json()
        print(f"Found {len(templates)} templates:")
        for template in templates:
            print(f"- {template['name']} ({template['key']}) - {template['type']} - {template['status']}")
    else:
        print(f"Error: {templates_response.text}")
else:
    print(f"Login failed: {login_response.text}")