#!/usr/bin/env python3
"""
Test end-to-end Step 0 onboarding flow integration
Tests the actual HTTP API endpoint that frontend will call
"""

import requests
import json
import sys

# Test configuration
BASE_URL = "http://127.0.0.1:8000"
API_ENDPOINT = f"{BASE_URL}/api/onboarding/step-0/"

def test_step0_integration():
    """Test Step 0 onboarding API endpoint"""
    
    print("🔧 Testing Step 0 Integration (Frontend → Backend)")
    
    # Test data matching frontend form
    test_payload = {
        "entry_intent": "website",
        "business_name": "Frontend Test Company",
        "business_type": "E-commerce",
        "primary_country": "United States",
        "primary_language": "en",
        "brand_primary_color": "#2563EB",
        "brand_secondary_color": "#7C3AED",
        "preferred_theme_mode": "light",
        "primary_goal": "get-leads",
        "onboarding_notes": "Testing frontend integration"
    }
    
    try:
        # Test POST request (create/update project)
        print(f"📤 Sending POST to {API_ENDPOINT}")
        print(f"📊 Payload: {json.dumps(test_payload, indent=2)}")
        
        response = requests.post(
            API_ENDPOINT,
            json=test_payload,
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        )
        
        print(f"📬 Response Status: {response.status_code}")
        print(f"📄 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Project created successfully!")
            print(f"🏗️ Project ID: {result.get('id')}")
            print(f"📍 Project Slug: {result.get('slug')}")
            print(f"🎯 Entry Intent: {result.get('entry_intent')}")
            print(f"🏢 Business Name: {result.get('business_name')}")
            print(f"🎨 Brand Colors: {result.get('brand_primary_color')} / {result.get('brand_secondary_color')}")
            print(f"🌙 Theme Mode: {result.get('preferred_theme_mode')}")
            
        else:
            print(f"❌ Request failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"📄 Error Response: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📄 Raw Response: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed! Make sure Django server is running on port 8000")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False
        
    return response.status_code == 201

def test_cors_preflight():
    """Test CORS preflight for frontend requests"""
    
    print("\n🌐 Testing CORS Configuration")
    
    try:
        # OPTIONS request to check CORS
        response = requests.options(
            API_ENDPOINT,
            headers={
                'Origin': 'http://localhost:3003',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        )
        
        print(f"📬 CORS Preflight Status: {response.status_code}")
        print(f"🔐 CORS Headers: {dict(response.headers)}")
        
        if response.status_code in [200, 204]:
            print("✅ CORS configuration looks good")
            return True
        else:
            print("⚠️ CORS might need configuration")
            return False
            
    except Exception as e:
        print(f"❌ CORS test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Step 0 Integration Test Suite\n")
    
    # Run integration tests
    api_test = test_step0_integration()
    cors_test = test_cors_preflight()
    
    print(f"\n📈 Results Summary:")
    print(f"   Step 0 API: {'✅ PASS' if api_test else '❌ FAIL'}")
    print(f"   CORS Setup: {'✅ PASS' if cors_test else '⚠️ CHECK'}")
    
    if api_test:
        print(f"\n🎉 Integration test complete! Frontend can connect to backend.")
        print(f"🌐 Frontend: http://localhost:3003/en/onboarding/step-0/website")
        print(f"🔌 Backend API: {API_ENDPOINT}")
    else:
        print(f"\n❌ Integration test failed!")
        sys.exit(1)