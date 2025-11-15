#!/usr/bin/env python3
"""
Test server connectivity and auth flow
"""
import requests
import json

def test_servers():
    print("=== JCW Server Connection Test ===")
    
    # Test Django backend
    try:
        print("\n1. Testing Django backend (localhost:8000)...")
        response = requests.get("http://localhost:8000/api/admin/sites/", timeout=5)
        print(f"   Django response: {response.status_code}")
        if response.status_code == 403:
            print("   ✓ Backend is running (403 = expected for unauthenticated)")
        else:
            print(f"   Response headers: {dict(response.headers)}")
            print(f"   Response content: {response.text[:200]}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Django backend error: {e}")
        return False
    
    # Test Next.js frontend
    try:
        print("\n2. Testing Next.js frontend (localhost:3001)...")
        response = requests.get("http://localhost:3001/en", timeout=5)
        print(f"   Next.js response: {response.status_code}")
        if response.status_code == 200:
            print("   ✓ Frontend is running")
        else:
            print(f"   Response content: {response.text[:200]}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Next.js frontend error: {e}")
        return False
    
    # Test Django admin login
    print("\n3. Testing Django admin login flow...")
    session = requests.Session()
    
    try:
        # Get CSRF token
        csrf_response = session.get("http://localhost:8000/admin/login/")
        csrf_token = None
        for line in csrf_response.text.split('\n'):
            if 'csrfmiddlewaretoken' in line and 'value=' in line:
                csrf_token = line.split('value="')[1].split('"')[0]
                break
        
        if not csrf_token:
            print("   ❌ Could not extract CSRF token")
            return False
        
        print(f"   CSRF token: {csrf_token[:20]}...")
        
        # Try login (this will fail but should give us session)
        login_data = {
            'username': 'testuser',  
            'password': 'testpass',
            'csrfmiddlewaretoken': csrf_token,
        }
        login_response = session.post(
            "http://localhost:8000/admin/login/",
            data=login_data,
            headers={'Referer': 'http://localhost:8000/admin/login/'}
        )
        
        print(f"   Login attempt response: {login_response.status_code}")
        print(f"   Session cookies: {session.cookies}")
        
        # Test API with session
        api_response = session.get("http://localhost:8000/api/admin/sites/")
        print(f"   API with session: {api_response.status_code}")
        
        if api_response.status_code == 403:
            print("   ✓ Session working (403 = no staff user)")
        elif api_response.status_code == 200:
            print("   ✓ Session and auth working!")
        else:
            print(f"   Response: {api_response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Auth test error: {e}")
    
    print("\n=== Test Complete ===")
    return True

if __name__ == "__main__":
    test_servers()