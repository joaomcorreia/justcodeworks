#!/usr/bin/env python
"""
Simple test to verify login without CSRF works
"""
import requests
import json

def test_simple_login():
    """Test login with CSRF disabled"""
    
    print("🔍 Testing simple login...")
    
    url = 'http://127.0.0.1:8000/api/auth/login/'
    data = {
        'username': 'mary_restaurant',
        'password': '3934Ibanez'
    }
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    print(f"Making request to: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
        else:
            print(f"❌ Login failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_simple_login()