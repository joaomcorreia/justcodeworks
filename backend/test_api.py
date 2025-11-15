#!/usr/bin/env python3
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

# Test the navigation API
url = "http://127.0.0.1:8000/api/navigation/"
params = {
    "project": "69870a64-4913-4d52-9b35-4d1dfa33632a",
    "location": "header", 
    "locale": "en"
}

response = requests.get(url, params=params)
print(f"Status: {response.status_code}")
print("Response:")
print(json.dumps(response.json(), indent=2))

# Also check the footer Help and Tools section
print("\n" + "="*50)
print("FOOTER NAVIGATION (Help and Tools)")
print("="*50)

params_footer = {
    "project": "69870a64-4913-4d52-9b35-4d1dfa33632a",
    "location": "footer",
    "locale": "en"
}

response_footer = requests.get(url, params=params_footer)
print(f"Status: {response_footer.status_code}")
print("Response:")
print(json.dumps(response_footer.json(), indent=2))