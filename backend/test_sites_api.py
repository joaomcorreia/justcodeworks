#!/usr/bin/env python
"""
Test the new Admin Sites API endpoints
"""
import os
import django
import requests
import json

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User

def test_sites_api():
    print("Testing Admin Sites API endpoints...")
    
    # Test 1: Login as staff user to get JWT token
    print("\n1. Testing staff user login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    login_response = requests.post(
        "http://127.0.0.1:8000/api/jwt/login/",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Login Status: {login_response.status_code}")
    if login_response.status_code == 200:
        login_data = login_response.json()
        print(f"Login successful for: {login_data.get('user', {}).get('email')}")
        print(f"User is staff: {login_data.get('user', {}).get('is_staff')}")
        print(f"Login response keys: {list(login_data.keys())}")
        
        # Try different token field names
        access_token = (
            login_data.get('access') or
            login_data.get('access_token') or 
            login_data.get('accessToken') or 
            login_data.get('token')
        )
        
        if access_token:
            print("✓ JWT token received")
        else:
            print("✗ No JWT token in response")
            print(f"Full response: {json.dumps(login_data, indent=2)}")
            return
    else:
        print(f"✗ Login failed: {login_response.text}")
        return
    
    # Test 2: Get sites list
    print("\n2. Testing GET /api/admin/sites/")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    sites_response = requests.get(
        "http://127.0.0.1:8000/api/admin/sites/",
        headers=headers
    )
    
    print(f"Sites List Status: {sites_response.status_code}")
    if sites_response.status_code == 200:
        sites_data = sites_response.json()
        print(f"✓ Found {len(sites_data)} sites")
        
        if sites_data:
            # Show first site details
            first_site = sites_data[0]
            print("\nFirst site details:")
            print(f"  - ID: {first_site.get('id')}")
            print(f"  - Name: {first_site.get('name')}")
            print(f"  - Slug: {first_site.get('slug')}")
            print(f"  - Owner: {first_site.get('owner_username')} ({first_site.get('owner_email')})")
            print(f"  - Template: {first_site.get('site_template_key')}")
            print(f"  - Active: {first_site.get('is_active')}")
            
            # Test 3: Get specific site JSON
            print(f"\n3. Testing GET /api/admin/sites/{first_site.get('slug')}/public/")
            site_json_response = requests.get(
                f"http://127.0.0.1:8000/api/admin/sites/{first_site.get('slug')}/public/",
                headers=headers
            )
            
            print(f"Site JSON Status: {site_json_response.status_code}")
            if site_json_response.status_code == 200:
                site_json_data = site_json_response.json()
                print("✓ Site JSON retrieved successfully")
                print(f"  - Site name: {site_json_data.get('name')}")
                print(f"  - Template key: {site_json_data.get('site_template_key')}")
                print(f"  - Pages count: {len(site_json_data.get('pages', []))}")
                print(f"  - Owner: {site_json_data.get('owner', {}).get('username')}")
            else:
                print(f"✗ Failed to get site JSON: {site_json_response.text}")
        else:
            print("ℹ No sites found in database")
    else:
        print(f"✗ Failed to get sites list: {sites_response.text}")
    
    print("\n" + "="*50)
    print("Test Summary:")
    print("1. Staff login:", "✓" if login_response.status_code == 200 else "✗")
    print("2. Sites list:", "✓" if sites_response.status_code == 200 else "✗")
    if 'sites_data' in locals() and sites_data:
        print("3. Site JSON:", "✓" if site_json_response.status_code == 200 else "✗")
    print("="*50)

if __name__ == "__main__":
    test_sites_api()