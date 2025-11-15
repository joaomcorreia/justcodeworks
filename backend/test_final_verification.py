#!/usr/bin/env python3
"""
Final verification test for the 403 error fix.
This test verifies:
1. Django backend is running on localhost:8000
2. Admin sites API returns data for authenticated staff users
3. Session authentication is working correctly
"""
import os
import django
import requests
from django.contrib.auth import authenticate
from django.test import Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteProject

def test_backend_connectivity():
    """Test basic backend connectivity"""
    try:
        response = requests.get('http://localhost:8000/api/admin/sites/', timeout=5)
        print(f"✓ Django backend is running (HTTP {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Django backend is not reachable")
        return False
    except Exception as e:
        print(f"✗ Backend test failed: {e}")
        return False

def test_staff_authentication():
    """Test staff user authentication and API access"""
    try:
        # Create or get staff user
        staff_user, created = User.objects.get_or_create(
            username='stafftest',
            defaults={
                'email': 'staff@test.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            staff_user.set_password('staffpass123')
            staff_user.save()
            print("✓ Staff user created")
        else:
            print("✓ Staff user exists")
        
        # Test Django Test Client (simulates browser session)
        client = Client()
        
        # Login
        login_success = client.login(username='stafftest', password='staffpass123')
        if not login_success:
            print("✗ Login failed")
            return False
        print("✓ Session login successful")
        
        # Test admin sites API
        response = client.get('/api/admin/sites/')
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Admin sites API returned {len(data)} sites (HTTP 200)")
            return True
        else:
            print(f"✗ Admin sites API failed (HTTP {response.status_code})")
            return False
            
    except Exception as e:
        print(f"✗ Authentication test failed: {e}")
        return False

def test_site_data():
    """Test that we have site data to display"""
    try:
        site_count = SiteProject.objects.count()
        print(f"✓ Database contains {site_count} site projects")
        
        if site_count > 0:
            # Show sample site
            sample_site = SiteProject.objects.first()
            print(f"  Sample: '{sample_site.name}' (owner: {sample_site.owner.username if sample_site.owner else 'None'})")
        
        return site_count > 0
        
    except Exception as e:
        print(f"✗ Site data test failed: {e}")
        return False

def main():
    print("🔍 Final Verification Test - Admin Sites 403 Error Fix")
    print("=" * 60)
    
    # Run tests
    connectivity_ok = test_backend_connectivity()
    auth_ok = test_staff_authentication()
    data_ok = test_site_data()
    
    print("\n📊 Test Results:")
    print(f"  Backend connectivity: {'✓ PASS' if connectivity_ok else '✗ FAIL'}")
    print(f"  Staff authentication: {'✓ PASS' if auth_ok else '✗ FAIL'}")
    print(f"  Site data available: {'✓ PASS' if data_ok else '✗ FAIL'}")
    
    if all([connectivity_ok, auth_ok, data_ok]):
        print("\n🎉 ALL TESTS PASSED!")
        print("The admin sites page should now work correctly.")
        print("Access: http://localhost:3001/en/admin/sites")
        print("Login with: stafftest / staffpass123")
    else:
        print("\n⚠️  Some tests failed. Check the output above.")

if __name__ == '__main__':
    main()