#!/usr/bin/env python
"""
Test CSRF endpoint to see what it returns
"""
import requests

def test_csrf_endpoint():
    """Test the CSRF endpoint"""
    
    print("🔍 Testing CSRF endpoint...")
    
    url = 'http://127.0.0.1:8000/api/csrf/'
    
    print(f"Making request to: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Cookies: {dict(response.cookies)}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ CSRF endpoint accessible!")
        else:
            print(f"❌ CSRF endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_csrf_endpoint()