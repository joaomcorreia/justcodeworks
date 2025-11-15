#!/usr/bin/env python
"""
Test CSRF token flow to debug 403 Forbidden errors
"""
import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

def test_csrf_flow():
    """Test the complete CSRF flow like a browser would"""
    base_url = 'http://127.0.0.1:8000'
    
    # Create a session to maintain cookies
    session = requests.Session()
    
    print("🔍 Testing CSRF token flow...")
    
    # Step 1: Get CSRF token
    print("\n1. Getting CSRF token...")
    csrf_response = session.get(f'{base_url}/api/csrf/')
    print(f"   Status: {csrf_response.status_code}")
    print(f"   Cookies: {dict(csrf_response.cookies)}")
    
    if csrf_response.status_code == 200:
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        print(f"   CSRF Token: {csrf_token}")
    else:
        print(f"   Error getting CSRF: {csrf_response.text}")
        return
    
    # Step 2: Test login with CSRF token
    print("\n2. Testing login with CSRF token...")
    login_data = {
        'username': 'mary_restaurant',
        'password': '3934Ibanez'
    }
    
    headers = {
        'X-CSRFToken': csrf_token,
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:3007'
    }
    
    login_response = session.post(
        f'{base_url}/api/auth/login/',
        json=login_data,
        headers=headers
    )
    
    print(f"   Status: {login_response.status_code}")
    print(f"   Response: {login_response.text}")
    print(f"   Cookies: {dict(login_response.cookies)}")
    
    if login_response.status_code == 200:
        print("✅ Login successful!")
    else:
        print(f"❌ Login failed: {login_response.status_code}")

if __name__ == '__main__':
    test_csrf_flow()