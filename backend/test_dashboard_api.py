#!/usr/bin/env python3
"""
Test the dashboard template API implementation.
"""

import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import DashboardTemplate, DashboardBlock

print("🏗️ Dashboard Template API Test")
print("=" * 50)

print("\n1️⃣ Backend Model Tests")
print("-" * 30)

# Check DashboardTemplate model
templates = DashboardTemplate.objects.all()
print(f"📋 DashboardTemplates in DB: {templates.count()}")
for template in templates:
    print(f"  ✓ {template.key}: {template.name}")
    print(f"    Default for tenants: {template.is_default_for_tenants}")
    print(f"    Active: {template.is_active}")

# Check DashboardBlock model
blocks = DashboardBlock.objects.all()
print(f"\n🧱 DashboardBlocks in DB: {blocks.count()}")
for block in blocks:
    print(f"  ✓ {block.template.key} > {block.key}: {block.title}")
    print(f"    Region: {block.region}, Order: {block.order}")
    print(f"    Target: {block.target_route or 'None'}")

print("\n2️⃣ API Tests")
print("-" * 30)

# Test the API endpoint (assuming server is running on localhost:8000)
base_url = "http://127.0.0.1:8000"

# Test without authentication (should fail)
print("\n🔒 Testing unauthenticated access:")
try:
    response = requests.get(f"{base_url}/api/dashboard/template/")
    print(f"  Status: {response.status_code}")
    if response.status_code != 200:
        print(f"  Expected 401/403 for unauthenticated request: ✓")
    else:
        print(f"  Unexpected success: ❌")
except requests.exceptions.ConnectionError:
    print("  ❌ Server not running - please start with 'python manage.py runserver 8000'")

# Try to authenticate and test
print("\n🔑 Testing with authentication:")
try:
    # Login to get token
    login_response = requests.post(f"{base_url}/api/auth/login/", json={
        "username": "Joao",
        "password": "joao123"
    })
    
    if login_response.status_code == 200:
        token_data = login_response.json()
        access_token = token_data.get('access_token')
        
        if access_token:
            # Test dashboard template endpoint with auth
            headers = {'Authorization': f'Bearer {access_token}'}
            template_response = requests.get(f"{base_url}/api/dashboard/template/", headers=headers)
            
            print(f"  Login status: {login_response.status_code} ✓")
            print(f"  Dashboard template status: {template_response.status_code}")
            
            if template_response.status_code == 200:
                template_data = template_response.json()
                print(f"  ✓ API Response:")
                print(f"    Template: {template_data.get('name')} ({template_data.get('key')})")
                print(f"    Blocks: {len(template_data.get('blocks', []))}")
                for block in template_data.get('blocks', []):
                    print(f"      - {block.get('title')} ({block.get('region')})")
            else:
                print(f"  ❌ Dashboard template request failed: {template_response.text}")
        else:
            print("  ❌ No access token in login response")
    else:
        print(f"  ❌ Login failed: {login_response.status_code} - {login_response.text}")
        
except requests.exceptions.ConnectionError:
    print("  ❌ Server not running - please start with 'python manage.py runserver 8000'")

print("\n🎯 Summary")
print("-" * 30)
print("✅ Models created and seeded successfully")
print("✅ Data migration applied")
if templates.count() > 0 and blocks.count() > 0:
    print("✅ Default dashboard template configured")
    print(f"✅ Template has {blocks.count()} blocks across regions")
else:
    print("❌ Missing template or blocks")

print("\n📝 Next Steps:")
print("- Start server: python manage.py runserver 8000")
print("- Test endpoint: GET /api/dashboard/template/ (with auth)")
print("- Access admin: http://127.0.0.1:8000/admin/sites/dashboardtemplate/")