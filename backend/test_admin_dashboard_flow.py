import requests
import json

print("=== Testing JCW Admin Dashboard Authentication Flow ===\n")

# Test 1: Login as staff user
print("1. Testing staff user login...")
login_response = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "Joao", "password": "joao123"}
)

if login_response.status_code == 200:
    user_data = login_response.json()
    print(f"✅ Staff login successful!")
    print(f"   Username: {user_data.get('user', {}).get('username')}")
    print(f"   is_staff: {user_data.get('user', {}).get('is_staff')}")
    print(f"   is_superuser: {user_data.get('user', {}).get('is_superuser')}")
    
    # Test /me endpoint with session
    print("\n2. Testing /api/auth/me endpoint...")
    
    # Extract session cookies from login response
    session_cookies = login_response.cookies
    
    me_response = requests.get(
        "http://127.0.0.1:8000/api/auth/me/", 
        cookies=session_cookies
    )
    
    if me_response.status_code == 200:
        me_data = me_response.json()
        print("✅ /api/auth/me successful!")
        print(f"   Authenticated: {me_data.get('authenticated')}")
        if me_data.get('user'):
            user = me_data['user']
            print(f"   User: {user.get('username')}")
            print(f"   Email: {user.get('email')}")
            print(f"   is_staff: {user.get('is_staff')}")
            print(f"   redirect_to: {user.get('redirect_to')}")
    else:
        print(f"❌ /api/auth/me failed: {me_response.status_code}")
else:
    print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")

print("\n3. Testing normal user login...")
login_response2 = requests.post(
    "http://127.0.0.1:8000/api/auth/login/",
    json={"username": "User1", "password": "3934Ibanez"}
)

if login_response2.status_code == 200:
    user_data2 = login_response2.json()
    print(f"✅ Normal user login successful!")
    print(f"   Username: {user_data2.get('user', {}).get('username')}")
    print(f"   is_staff: {user_data2.get('user', {}).get('is_staff')}")
    print(f"   Expected redirect: dashboard (not admin)")
else:
    print(f"❌ Normal user login failed: {login_response2.status_code}")

print("\n=== Test Complete ===")
print("Expected Flow:")
print("- Staff users should redirect to: /{locale}/admin")  
print("- Normal users should redirect to: /{locale}/dashboard")
print("- Admin dashboard should have Django admin link")
print("- Regular dashboard should show 'Admin Dashboard' link for staff only")