#!/usr/bin/env python3

import requests
import json

# Test the updated API endpoint
session = requests.Session()
session.cookies.set('sessionid', 'kq8yp1wt6q74j8wh3ivoqdln36pt483a')
session.cookies.set('csrftoken', 'cji8M7eGYQNjSq9gJIXBm5hwdUQN2Ve5')

print("=== Testing Updated API Endpoint ===")
# Note: just-code-works tenant site has been removed, using marys-restaurant instead
response = session.get('http://localhost:8000/api/admin/sites/marys-restaurant/public/')

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    site_data = response.json()
    print(f"✅ SUCCESS: Site data loaded for '{site_data.get('name', 'Unknown')}'")
    print(f"Pages: {len(site_data.get('pages', []))}")
    print(f"Template: {site_data.get('site_template', {}).get('name', 'None')}")
else:
    print(f"❌ ERROR: {response.text[:500]}")

# Test a few more sites
test_sites = ['joes-garage', 'marys-restaurant']
for site_slug in test_sites:
    response = session.get(f'http://localhost:8000/api/admin/sites/{site_slug}/public/')
    status = "✅" if response.status_code == 200 else "❌"
    print(f"{status} {site_slug}: {response.status_code}")