#!/usr/bin/env python
"""
Test script for admin template sample site mapping API
"""
import os
import sys
import django
import requests
import json

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def test_template_sample_site_api():
    print("🔍 Testing Template Sample Site Mapping API...")
    
    # Get admin user
    admin_user = User.objects.filter(is_staff=True).first()
    if not admin_user:
        print("❌ No admin user found - please create one with: python manage.py createsuperuser")
        return
        
    print(f"👤 Using admin user: {admin_user.username}")
    
    # Generate JWT token
    refresh = RefreshToken.for_user(admin_user)
    access_token = str(refresh.access_token)
    
    base_url = "http://localhost:8000/api"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    # Test cases
    test_cases = [
        ('restaurant-modern', 'marys-restaurant'),
        ('auto-garage-modern', 'oficina-paulo-calibra'),
        ('nonexistent-template', None)  # Should return 404
    ]
    
    try:
        for template_key, expected_slug in test_cases:
            print(f"\n📋 Testing template key: {template_key}")
            
            response = requests.get(
                f"{base_url}/admin/templates/{template_key}/sample-site/", 
                headers=headers
            )
            
            print(f"   Status: {response.status_code}")
            
            if expected_slug:
                if response.status_code == 200:
                    data = response.json()
                    print(f"   ✅ Found mapping: {data['sample_site_slug']}")
                    
                    if data['sample_site_slug'] == expected_slug:
                        print(f"   ✅ Correct slug returned")
                    else:
                        print(f"   ❌ Expected {expected_slug}, got {data['sample_site_slug']}")
                else:
                    print(f"   ❌ Expected 200, got {response.status_code}")
                    print(f"   Response: {response.text}")
            else:
                if response.status_code == 404:
                    print(f"   ✅ Correctly returned 404 for nonexistent template")
                else:
                    print(f"   ❌ Expected 404, got {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Django server. Make sure it's running on port 8000")
        print("   Run: python manage.py runserver 8000")

if __name__ == "__main__":
    test_template_sample_site_api()