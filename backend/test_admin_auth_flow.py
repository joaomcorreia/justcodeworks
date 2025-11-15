import requests
import json

print("=== Testing Admin Authentication Flow ===")

# Step 1: Test login
print("\n1. Testing login with staff user...")
login_response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "Joao", "password": "joao123"}
)

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens['access']
    print(f"✅ Login successful! Token: {access_token[:20]}...")
    
    # Step 2: Test /api/auth/me endpoint  
    print("\n2. Testing /api/auth/me endpoint...")
    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = requests.get("http://127.0.0.1:8000/api/auth/me/", headers=headers)
    
    if me_response.status_code == 200:
        user_data = me_response.json()
        print("✅ /api/auth/me successful!")
        print(f"   User: {user_data.get('username')}")
        print(f"   Email: {user_data.get('email')}")
        print(f"   is_staff: {user_data.get('is_staff')}")
        print(f"   is_superuser: {user_data.get('is_superuser')}")
        
        # Step 3: Check admin permissions
        is_admin = user_data.get('is_staff') or user_data.get('is_superuser')
        print(f"\n3. Admin access check:")
        print(f"   Should allow admin access: {is_admin}")
        
        if is_admin:
            print("✅ User has admin permissions - should be able to access /admin")
        else:
            print("❌ User lacks admin permissions - will be redirected from /admin")
            
    else:
        print(f"❌ /api/auth/me failed: {me_response.status_code} - {me_response.text}")
        
else:
    print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")

print("\n=== Test Complete ===")