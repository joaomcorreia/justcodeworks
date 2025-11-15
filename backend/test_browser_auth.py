#!/usr/bin/env python
"""
Test the Admin Sites API directly from the browser's perspective
"""
import requests
import json

def test_browser_auth():
    print("Testing browser-style authentication...")
    
    # Simulate what the browser is doing
    session = requests.Session()
    
    # Step 1: Get CSRF token
    csrf_response = session.get("http://127.0.0.1:8000/api/csrf/")
    print(f"CSRF Status: {csrf_response.status_code}")
    if csrf_response.status_code == 200:
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        print(f"CSRF Token: {csrf_token[:20]}..." if csrf_token else "No token")
    
    # Step 2: Login with session auth
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token
    }
    
    login_response = session.post(
        "http://127.0.0.1:8000/api/auth/login/",
        json=login_data,
        headers=headers
    )
    
    print(f"Login Status: {login_response.status_code}")
    if login_response.status_code == 200:
        print("✓ Login successful")
        print(f"Session cookies: {session.cookies}")
    else:
        print(f"✗ Login failed: {login_response.text}")
        return
    
    # Step 3: Test admin sites endpoint with CORS
    print("\n--- Testing admin sites endpoint ---")
    
    # Test with Origin header like browser would send
    cors_headers = {
        "Origin": "http://localhost:3001",
        "Referer": "http://localhost:3001/en/admin/sites"
    }
    
    sites_response = session.get(
        "http://127.0.0.1:8000/api/admin/sites/",
        headers=cors_headers
    )
    
    print(f"Sites List Status: {sites_response.status_code}")
    print(f"Response Headers: {dict(sites_response.headers)}")
    
    if sites_response.status_code == 200:
        print("✓ Sites list retrieved successfully")
        sites_data = sites_response.json()
        print(f"Found {len(sites_data)} sites")
    else:
        print(f"✗ Sites request failed")
        print(f"Response text: {sites_response.text}")
        
        # Check what Django thinks about the user
        auth_response = session.get("http://127.0.0.1:8000/api/auth/me/")
        print(f"\nAuth check status: {auth_response.status_code}")
        if auth_response.status_code == 200:
            auth_data = auth_response.json()
            print(f"User authenticated: {auth_data.get('authenticated')}")
            user_data = auth_data.get('user', {})
            print(f"User is staff: {user_data.get('is_staff')}")
            print(f"User email: {user_data.get('email')}")

if __name__ == "__main__":
    test_browser_auth()