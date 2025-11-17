#!/usr/bin/env python3
"""
Test the new Step 0 Builder endpoint (/api/builder/step0/)

This script tests the complete Step 0 Builder flow:
1. Register a new user
2. Login to get JWT token  
3. Call the builder endpoint with Step 0 data
4. Verify site creation and content seeding
"""

import requests
import json
import uuid

# API base URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_step0_builder():
    """Test the complete Step 0 Builder flow."""
    
    print("🧪 Testing Step 0 Builder Endpoint")
    print("=" * 50)
    
    # Generate unique test data
    test_email = f"test_builder_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestBuilder123!"
    
    # Step 1: Register a new user
    print("\n1️⃣ Registering test user...")
    register_data = {
        "username": test_email,
        "email": test_email,
        "password": test_password,
        "first_name": "Test",
        "last_name": "Builder"
    }
    
    register_response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
    print(f"   Registration Status: {register_response.status_code}")
    
    if register_response.status_code not in [200, 201]:
        print(f"   ❌ Registration failed: {register_response.text}")
        return False
        
    register_result = register_response.json()
    print(f"   ✅ User registered: {register_result.get('user', {}).get('username')}")
    
    # Step 2: Login to get JWT token
    print("\n2️⃣ Logging in for JWT token...")
    login_data = {
        "username": test_email,
        "password": test_password
    }
    
    login_response = requests.post(f"{BASE_URL}/jwt/login/", json=login_data)
    print(f"   Login Status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"   ❌ Login failed: {login_response.text}")
        return False
        
    login_result = login_response.json()
    access_token = login_result.get('access')
    
    if not access_token:
        print("   ❌ No access token received")
        return False
        
    print(f"   ✅ JWT token received (length: {len(access_token)})")
    
    # Step 3: Test Step 0 Builder endpoint
    print("\n3️⃣ Testing Step 0 Builder endpoint...")
    
    # Prepare Step 0 onboarding data
    step0_data = {
        "website_name": "Mary's Italian Restaurant",
        "website_topic": "authentic Italian dining experience",
        "entry_product": "website",
        "primary_audience": "food lovers and families",
        "tagline": "Authentic Italian flavors in the heart of the city",
        "industry": "restaurant",
        "description": "Family-owned restaurant serving traditional Italian cuisine with fresh ingredients and warm hospitality."
    }
    
    # Headers with JWT token
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    builder_response = requests.post(f"{BASE_URL}/builder/step0/", 
                                   json=step0_data, 
                                   headers=headers)
    
    print(f"   Builder Status: {builder_response.status_code}")
    
    if builder_response.status_code != 201:
        print(f"   ❌ Builder failed: {builder_response.text}")
        return False
    
    builder_result = builder_response.json()
    print(f"   ✅ Builder succeeded!")
    
    # Step 4: Verify the response structure
    print("\n4️⃣ Verifying response structure...")
    
    required_fields = ['success', 'message', 'project', 'redirect_to', 'status']
    for field in required_fields:
        if field not in builder_result:
            print(f"   ❌ Missing field: {field}")
            return False
        print(f"   ✅ {field}: {builder_result[field]}")
    
    # Verify project data
    project_data = builder_result.get('project', {})
    project_required = ['id', 'name', 'template_key', 'template_name', 'business_name', 'entry_product']
    
    print("\n   📋 Project Details:")
    for field in project_required:
        if field not in project_data:
            print(f"      ❌ Missing project field: {field}")
            return False
        print(f"      ✅ {field}: {project_data[field]}")
    
    # Step 5: Verify site was actually created
    print("\n5️⃣ Verifying site creation...")
    
    project_id = project_data['id']
    
    # Get project details to verify it exists
    project_detail_response = requests.get(f"{BASE_URL}/projects/{project_id}/", 
                                         headers=headers)
    
    if project_detail_response.status_code == 200:
        print("   ✅ Project exists in database")
        project_detail = project_detail_response.json()
        print(f"      Name: {project_detail.get('name')}")
        print(f"      Template: {project_detail.get('template_key')}")
        print(f"      Business Name: {project_detail.get('business_name')}")
        print(f"      Entry Product: {project_detail.get('entry_product')}")
    else:
        print(f"   ❌ Could not verify project: {project_detail_response.status_code}")
        return False
    
    # Step 6: Test validation errors
    print("\n6️⃣ Testing validation errors...")
    
    # Test with missing required field
    invalid_data = {
        "website_name": "Test Site",
        # Missing website_topic, entry_product, primary_audience
    }
    
    validation_response = requests.post(f"{BASE_URL}/builder/step0/", 
                                      json=invalid_data, 
                                      headers=headers)
    
    if validation_response.status_code == 400:
        print("   ✅ Validation errors handled correctly")
        error_result = validation_response.json()
        print(f"      Error: {error_result.get('error')}")
    else:
        print(f"   ❌ Validation not working: {validation_response.status_code}")
        return False
    
    print("\n🎉 All tests passed! Step 0 Builder is working correctly.")
    print(f"   Created site: {project_data['name']}")
    print(f"   Project ID: {project_id}")
    print(f"   Template: {project_data['template_name']} ({project_data['template_key']})")
    
    return True

if __name__ == "__main__":
    try:
        success = test_step0_builder()
        if success:
            print("\n✅ Step 0 Builder test PASSED")
        else:
            print("\n❌ Step 0 Builder test FAILED")
    except Exception as e:
        print(f"\n💥 Test error: {str(e)}")
        import traceback
        traceback.print_exc()