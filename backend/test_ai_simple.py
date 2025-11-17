#!/usr/bin/env python3
"""Simple test of AI suggestion endpoint via HTTP."""

import requests
import json

def test_ai_endpoint():
    print("🧱 Testing AI Suggestion Endpoint via HTTP")
    print("=" * 50)
    
    # Test endpoint URL
    url = "http://localhost:8000/api/builder/sections/1/ai-suggest/"
    
    # Test payload
    payload = {
        "locale": "en",
        "tone": "friendly and professional"
    }
    
    try:
        # First get CSRF token
        csrf_response = requests.get("http://localhost:8000/api/csrf/")
        print(f"CSRF status: {csrf_response.status_code}")
        
        # Get session cookies and CSRF token
        session = requests.Session()
        csrf_response = session.get("http://localhost:8000/api/csrf/")
        
        # Extract CSRF token from cookies
        csrf_token = None
        for cookie in session.cookies:
            if cookie.name == 'csrftoken':
                csrf_token = cookie.value
                break
        
        if csrf_token:
            print(f"✅ Got CSRF token: {csrf_token[:10]}...")
        else:
            print("⚠️  No CSRF token found")
            
        headers = {
            'Content-Type': 'application/json',
        }
        
        if csrf_token:
            headers['X-CSRFToken'] = csrf_token
            
        # Make the AI suggestion request
        response = session.post(url, 
                              headers=headers,
                              json=payload)
        
        print(f"Response status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response data: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response text: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_ai_endpoint()