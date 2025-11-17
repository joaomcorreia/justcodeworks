#!/usr/bin/env python3

import requests
import json

# Test the user sites API with authentication
session = requests.Session()

# Use the session cookies from the browser
session.cookies.set('sessionid', 'kq8yp1wt6q74j8wh3ivoqdln36pt483a')
session.cookies.set('csrftoken', 'cji8M7eGYQNjSq9gJIXBm5hwdUQN2Ve5')

print("=== Testing User Sites API ===")
response = session.get('http://localhost:8000/api/admin/user-sites/')

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    sites = response.json()
    print(f"Found {len(sites)} sites:")
    for site in sites:
        print(f"- {site['name']} (slug: {site['slug']})")
else:
    print(f"Error Response: {response.text}")

# Test which user is authenticated
print("\n=== Testing Auth Status ===")
auth_response = session.get('http://localhost:8000/api/auth/me/')
print(f"Auth Status: {auth_response.status_code}")
if auth_response.status_code == 200:
    user_data = auth_response.json()
    print(f"Authenticated User: {user_data.get('email', 'Unknown')}")
else:
    print(f"Auth Error: {auth_response.text}")