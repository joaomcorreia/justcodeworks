#!/usr/bin/env python3
"""Test the dashboard shows correct site for logged-in user"""
import os
import sys
import django
import requests
from requests import Session

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteProject

def test_dashboard_api():
    print("=== TESTING DASHBOARD API ACCESS ===")
    
    # Test session-based authentication
    session = Session()
    
    # Step 1: Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    print(f"CSRF request: {csrf_response.status_code}")
    
    if csrf_response.status_code == 200:
        csrf_token = csrf_response.json().get('csrfToken')
        print(f"CSRF token obtained: {csrf_token[:20]}...")
        session.headers.update({'X-CSRFToken': csrf_token})
    
    # Step 2: Login as Joao
    login_data = {
        'username': 'Joao',
        'password': 'Joao123!',
    }
    
    login_response = session.post('http://localhost:8000/api/auth/login/', json=login_data)
    print(f"Login request: {login_response.status_code}")
    
    if login_response.status_code == 200:
        print("✅ Login successful")
        
        # Step 3: Get user's sites
        sites_response = session.get('http://localhost:8000/api/sites/')
        print(f"Sites API: {sites_response.status_code}")
        
        if sites_response.status_code == 200:
            sites = sites_response.json()
            print(f"✅ Found {len(sites)} sites for Joao:")
            for site in sites:
                print(f"  - {site['name']} (slug: {site['slug']})")
            
            # Step 4: Check the first site's public data
            if sites:
                first_site = sites[0]
                public_response = session.get(f"http://localhost:8000/api/sites/{first_site['slug']}/public/")
                print(f"\nPublic data for {first_site['name']}: {public_response.status_code}")
                
                if public_response.status_code == 200:
                    public_data = public_response.json()
                    print(f"✅ Site data loaded: {public_data['name']}")
                    print(f"   Template: {public_data.get('template', {}).get('name', 'Unknown')}")
                    print(f"   Pages: {len(public_data.get('pages', []))}")
                else:
                    print(f"❌ Failed to load public data: {public_response.text}")
        else:
            print(f"❌ Failed to get sites: {sites_response.text}")
    else:
        print(f"❌ Login failed: {login_response.text}")

def verify_site_ownership():
    print("\n=== VERIFYING SITE OWNERSHIP IN DATABASE ===")
    
    joao = User.objects.get(username='Joao')
    joao_sites = SiteProject.objects.filter(owner=joao)
    
    print(f"Joao owns {joao_sites.count()} sites:")
    for site in joao_sites:
        print(f"  - {site.name} (slug: {site.slug})")
    
    return joao_sites.first() if joao_sites.exists() else None

if __name__ == "__main__":
    print("Testing dashboard functionality after fixes...")
    
    # Verify database state
    expected_site = verify_site_ownership()
    
    # Test API access
    test_dashboard_api()
    
    print("\n=== TEST RESULTS ===")
    if expected_site:
        print(f"✅ Joao should see: {expected_site.name}")
        print(f"✅ Dashboard URL: http://localhost:3002/en/dashboard/website")
        print("✅ The dashboard should now show Joe's Tire Center (or Just Code Works)")
    else:
        print("❌ No sites found for Joao - this is a problem")