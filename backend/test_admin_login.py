#!/usr/bin/env python
"""
Test admin login for debugging.
"""
import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

def test_admin_login():
    """Test admin login with common passwords"""
    common_passwords = ['admin', 'admin123', '123456', 'password', 'testpass']
    
    for password in common_passwords:
        login_data = {
            'username': 'admin',
            'password': password
        }
        
        try:
            response = requests.post('http://127.0.0.1:8000/api/auth/login/', json=login_data)
            print(f"Password '{password}': {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ SUCCESS with password: {password}")
                token_data = response.json()
                print(f"Response data: {token_data}")
                print(f"Access token received: {bool(token_data.get('access_token'))}")
                return password, token_data.get('access_token')
            
        except Exception as e:
            print(f"Error testing password '{password}': {e}")
    
    print("❌ No valid admin password found")
    return None, None

if __name__ == '__main__':
    test_admin_login()