#!/usr/bin/env python3
"""Test Django API endpoints directly."""

import requests
import json

def test_auth_endpoints():
    print("🧱 Testing Auth API Endpoints")
    print("=" * 50)
    
    base_url = "http://localhost:8000/api"
    
    # Test CSRF endpoint
    try:
        response = requests.get(f"{base_url}/csrf/")
        print(f"✅ CSRF endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ CSRF endpoint error: {e}")
        return
    
    # Test auth/me endpoint
    try:
        response = requests.get(f"{base_url}/auth/me/")
        print(f"✅ Auth/me endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Auth/me endpoint error: {e}")
    
    # Test registration endpoint (just check if it exists)
    try:
        response = requests.options(f"{base_url}/auth/register/")
        print(f"✅ Register endpoint OPTIONS: {response.status_code}")
    except Exception as e:
        print(f"❌ Register endpoint error: {e}")
    
    # Test login endpoint (just check if it exists)  
    try:
        response = requests.options(f"{base_url}/auth/login/")
        print(f"✅ Login endpoint OPTIONS: {response.status_code}")
    except Exception as e:
        print(f"❌ Login endpoint error: {e}")

if __name__ == "__main__":
    test_auth_endpoints()