"""
Quick test to verify authentication hardening is working
"""
import requests

def test_auth_hardening():
    base_url = "http://127.0.0.1:8000"
    
    print("=== Testing Authentication Hardening ===\n")
    
    # Test 1: Backend API endpoints require auth for writes
    print("1. Testing backend API permissions:")
    
    # Test public read access (should work)
    try:
        response = requests.get(f"{base_url}/api/pages/")
        print(f"   GET /api/pages/ (public read): {response.status_code} - {'✅ OK' if response.status_code == 200 else '❌ FAIL'}")
    except Exception as e:
        print(f"   GET /api/pages/ (public read): ❌ ERROR - {e}")
    
    # Test write access without auth (should fail)
    try:
        response = requests.post(f"{base_url}/api/pages/", json={"title": "test"})
        print(f"   POST /api/pages/ (no auth): {response.status_code} - {'✅ PROTECTED' if response.status_code in [401, 403] else '❌ VULNERABLE'}")
    except Exception as e:
        print(f"   POST /api/pages/ (no auth): ❌ ERROR - {e}")
    
    # Test 2: Dashboard template endpoint requires auth
    print("\n2. Testing dashboard template endpoint:")
    try:
        response = requests.get(f"{base_url}/api/dashboard/template/")
        print(f"   GET /api/dashboard/template/ (no auth): {response.status_code} - {'✅ PROTECTED' if response.status_code in [401, 403] else '❌ VULNERABLE'}")
    except Exception as e:
        print(f"   GET /api/dashboard/template/ (no auth): ❌ ERROR - {e}")
    
    # Test 3: Login endpoint works
    print("\n3. Testing authentication:")
    try:
        # Try to login with test credentials
        login_response = requests.post(f"{base_url}/api/auth/login/", json={
            "username": "Joao",
            "password": "joao123"
        })
        print(f"   POST /api/auth/login/ (valid creds): {login_response.status_code} - {'✅ OK' if login_response.status_code == 200 else '❌ FAIL'}")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            token = login_data.get("access")
            
            # Test authenticated request
            headers = {"Authorization": f"Bearer {token}"}
            auth_response = requests.get(f"{base_url}/api/dashboard/template/", headers=headers)
            print(f"   GET /api/dashboard/template/ (with auth): {auth_response.status_code} - {'✅ OK' if auth_response.status_code == 200 else '❌ FAIL'}")
            
    except Exception as e:
        print(f"   Authentication test: ❌ ERROR - {e}")
    
    print("\n=== Test Summary ===")
    print("✅ = Working as expected")
    print("❌ = Issue found")
    print("\nFrontend tests:")
    print("- Visit http://localhost:3000/ (should redirect to /en)")
    print("- Visit http://localhost:3000/en (should show homepage without edit controls)")
    print("- Visit http://localhost:3000/en/builder (should redirect to login)")
    print("- Try adding ?edit=1 to homepage (should not show edit mode)")

if __name__ == "__main__":
    test_auth_hardening()