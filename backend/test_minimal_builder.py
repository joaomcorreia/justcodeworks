#!/usr/bin/env python3
"""
Minimal test for Step 0 Builder to identify the exact error
"""

import requests
import json
import uuid

# API base URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_minimal_builder():
    """Test just the basic project creation without content."""
    
    print("🧪 Testing Minimal Step 0 Builder")
    print("=" * 40)
    
    # Generate unique test data
    test_email = f"minimal_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "MinimalTest123!"
    
    # Step 1: Register
    print("\n1️⃣ Registering...")
    register_data = {
        "username": test_email,
        "email": test_email,
        "password": test_password,
        "first_name": "Minimal",
        "last_name": "Test"
    }
    
    register_response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    if register_response.status_code not in [200, 201]:
        print(f"❌ Registration failed: {register_response.text}")
        return
    
    print("✅ Registration OK")
    
    # Step 2: Get JWT
    print("\n2️⃣ Getting JWT...")
    login_data = {"username": test_email, "password": test_password}
    
    login_response = requests.post(f"{BASE_URL}/jwt/login/", json=login_data)
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    access_token = login_response.json().get('access')
    if not access_token:
        print("❌ No JWT token")
        return
    
    print("✅ JWT OK")
    
    # Step 3: Test with minimal data
    print("\n3️⃣ Testing minimal builder...")
    
    minimal_data = {
        "website_name": "Test Site",
        "website_topic": "testing",
        "entry_product": "website",
        "primary_audience": "testers"
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print(f"Sending request to: {BASE_URL}/builder/step0/")
    print(f"Data: {json.dumps(minimal_data, indent=2)}")
    
    builder_response = requests.post(f"{BASE_URL}/builder/step0/", 
                                   json=minimal_data, 
                                   headers=headers)
    
    print(f"\n📊 Response:")
    print(f"Status: {builder_response.status_code}")
    print(f"Headers: {dict(builder_response.headers)}")
    print(f"Body: {builder_response.text}")
    
    if builder_response.status_code == 201:
        print("\n✅ SUCCESS!")
        result = builder_response.json()
        project = result.get('project', {})
        print(f"Project ID: {project.get('id')}")
        print(f"Project Name: {project.get('name')}")
        print(f"Template: {project.get('template_name')}")
    else:
        print(f"\n❌ FAILED with status {builder_response.status_code}")

if __name__ == "__main__":
    try:
        test_minimal_builder()
    except Exception as e:
        print(f"\n💥 Exception: {str(e)}")
        import traceback
        traceback.print_exc()