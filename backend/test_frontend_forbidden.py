#!/usr/bin/env python3
"""
Simple test to replicate the Forbidden error you're seeing in the frontend
"""
import requests
import json

def test_frontend_forbidden():
    print("🔍 TESTING FRONTEND FORBIDDEN ERROR")
    print("=" * 50)
    
    # This simulates what your frontend is doing
    base_url = "http://127.0.0.1:8000"
    
    print("1. Testing CSRF endpoint...")
    try:
        # Step 1: Get CSRF token (like frontend does)
        csrf_resp = requests.get(f"{base_url}/api/csrf/")
        print(f"   CSRF status: {csrf_resp.status_code}")
        
        if csrf_resp.status_code != 200:
            print(f"   CSRF Error: {csrf_resp.text}")
            return
            
        csrf_token = csrf_resp.json().get('csrfToken')
        print(f"   CSRF token: {csrf_token[:20]}...") if csrf_token else print("   No CSRF token!")
        
        # Step 2: Check authentication (like frontend does)
        print("\n2. Testing auth endpoint...")
        session = requests.Session()
        
        # Get cookies from CSRF call
        session.get(f"{base_url}/api/csrf/")
        
        auth_resp = session.get(f"{base_url}/api/auth/me/")
        print(f"   Auth status: {auth_resp.status_code}")
        
        if auth_resp.status_code == 200:
            auth_data = auth_resp.json()
            print(f"   Auth data: {auth_data}")
            is_authenticated = auth_data.get('isAuthenticated', False)
            print(f"   Is authenticated: {is_authenticated}")
        else:
            print(f"   Auth error: {auth_resp.text}")
            is_authenticated = False
            
        # Step 3: Try to update a section (this is where you get Forbidden)
        print("\n3. Testing section update (where Forbidden happens)...")
        
        # Let's try with a section ID that might exist
        section_id = 1  # Assuming there's at least one section
        update_url = f"{base_url}/api/builder/sections/{section_id}/"
        
        # The data your frontend is sending
        update_data = {
            "content": {
                "title": "Test Update",
                "description": "This is a test update"
            }
        }
        
        print(f"   Trying to PATCH: {update_url}")
        print(f"   Data: {json.dumps(update_data, indent=2)}")
        
        # First try without CSRF token (might work if not required)
        resp1 = session.patch(
            update_url,
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Without CSRF - Status: {resp1.status_code}")
        print(f"   Without CSRF - Response: {resp1.text}")
        
        # Try with CSRF token (like frontend should do)
        csrf_resp2 = session.get(f"{base_url}/api/csrf/")
        csrf_token2 = csrf_resp2.json().get('csrfToken') if csrf_resp2.status_code == 200 else None
        
        if csrf_token2:
            resp2 = session.patch(
                update_url,
                json=update_data,
                headers={
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token2
                }
            )
            print(f"   With CSRF - Status: {resp2.status_code}")
            print(f"   With CSRF - Response: {resp2.text}")
        
        # Step 4: Show what the issue likely is
        print("\n4. Analysis...")
        if not is_authenticated:
            print("   ❌ ISSUE FOUND: User is not authenticated!")
            print("   💡 SOLUTION: You need to log in first at http://localhost:3001/en/auth/login")
            print("   💡 After logging in, the session should persist and section updates should work")
        else:
            print("   ✅ User is authenticated - the issue might be permissions or CSRF")
            
    except requests.exceptions.ConnectionError as e:
        print(f"   Connection Error: {e}")
        print("   💡 Make sure Django server is running: python manage.py runserver 8000")
    except Exception as e:
        print(f"   Other Error: {e}")

if __name__ == "__main__":
    test_frontend_forbidden()