#!/usr/bin/env python3
"""
Create a staff user for testing and verify the admin flow
"""
import os
import sys
import django

# Setup Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.db import transaction

def create_test_staff():
    print("=== Creating Test Staff User ===")
    
    try:
        with transaction.atomic():
            # Check if staff user exists
            username = "stafftest"
            email = "staff@test.com"
            password = "staffpass123"
            
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'is_staff': True,
                    'is_active': True,
                }
            )
            
            if created:
                user.set_password(password)
                user.save()
                print(f"✓ Created staff user: {username}")
            else:
                # Update existing user to ensure they're staff
                user.is_staff = True
                user.is_active = True
                user.set_password(password)
                user.save()
                print(f"✓ Updated existing user: {username}")
            
            print(f"   Username: {username}")
            print(f"   Password: {password}")
            print(f"   Email: {email}")
            print(f"   Is Staff: {user.is_staff}")
            print(f"   Is Active: {user.is_active}")
            
    except Exception as e:
        print(f"❌ Error creating staff user: {e}")
        return False
    
    return True

def test_api_with_staff():
    """Test the admin API with staff authentication"""
    import requests
    from django.test import Client
    from django.contrib.auth import authenticate
    
    print("\n=== Testing API with Staff User ===")
    
    # Test Django test client first
    client = Client()
    
    # Login via Django client
    login_success = client.login(username='stafftest', password='staffpass123')
    print(f"Django client login: {login_success}")
    
    if login_success:
        response = client.get('/api/admin/sites/')
        print(f"API response via Django client: {response.status_code}")
        if response.status_code == 200:
            print(f"✓ API working with staff user")
            data = response.json()
            print(f"Sites returned: {len(data)}")
        else:
            print(f"Response content: {response.content.decode()}")
    
    # Test with requests session (simulating browser)
    print("\n--- Testing with requests session ---")
    session = requests.Session()
    
    try:
        # Get login page to get CSRF token
        login_page = session.get("http://localhost:8000/admin/login/")
        csrf_token = None
        
        for line in login_page.text.split('\n'):
            if 'csrfmiddlewaretoken' in line and 'value=' in line:
                csrf_token = line.split('value="')[1].split('"')[0]
                break
        
        if csrf_token:
            print(f"Got CSRF token: {csrf_token[:20]}...")
            
            # Login
            login_data = {
                'username': 'stafftest',
                'password': 'staffpass123',
                'csrfmiddlewaretoken': csrf_token,
            }
            
            login_response = session.post(
                "http://localhost:8000/admin/login/",
                data=login_data,
                headers={'Referer': 'http://localhost:8000/admin/login/'}
            )
            
            print(f"Login response: {login_response.status_code}")
            print(f"Session cookies: {list(session.cookies.keys())}")
            
            # Test API
            api_response = session.get("http://localhost:8000/api/admin/sites/")
            print(f"API response: {api_response.status_code}")
            
            if api_response.status_code == 200:
                print("✓ Session authentication working!")
                data = api_response.json()
                print(f"Sites returned: {len(data)}")
            else:
                print(f"API error: {api_response.text}")
                
        else:
            print("❌ Could not get CSRF token")
            
    except Exception as e:
        print(f"❌ Session test error: {e}")

if __name__ == "__main__":
    if create_test_staff():
        test_api_with_staff()