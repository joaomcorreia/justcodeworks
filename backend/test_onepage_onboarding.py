#!/usr/bin/env python3

import requests
import json

# Test the one-page website onboarding endpoint
url = "http://127.0.0.1:8000/api/onboarding/one-page-website/"

test_data = {
    "owner_name": "John Doe",
    "owner_is_real_owner": True,
    "business_address": "123 Main Street, Lisbon, Portugal",
    "business_email": "info@johndoe-test.com",
    "business_phone": "+351 912 345 678",
    "business_name": "John's Test Business",
    "business_type": "Local services",
    "business_services": "Plumbing, heating, emergency repairs",
    "business_description": "We help homeowners with fast, reliable repairs and maintenance services.",
    "business_website": "",
    "favorite_colors": "Dark blue and yellow",
    "account_email": "john@johndoe-test.com",
    "account_password": "TestPassword123!"
}

print("Testing One-Page Website Onboarding API...")
print(f"URL: {url}")
print(f"Data: {json.dumps(test_data, indent=2)}")
print()

try:
    response = requests.post(url, json=test_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✅ Success! Account and project created.")
    else:
        print("❌ Failed!")
        
except requests.exceptions.ConnectionError:
    print("❌ Connection error - make sure Django server is running")
except Exception as e:
    print(f"❌ Error: {e}")