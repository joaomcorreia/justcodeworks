#!/usr/bin/env python
"""
Test script for admin quote requests API endpoints
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
from sites.models import QuoteRequest, SiteProject
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def test_admin_quote_requests_api():
    print("🔍 Testing Admin Quote Requests API...")
    
    # Check if we have any quote requests
    quote_count = QuoteRequest.objects.count()
    print(f"📊 Found {quote_count} quote requests in database")
    
    if quote_count == 0:
        print("ℹ️  Creating test quote request...")
        
        # Get or create a site project
        site_project = SiteProject.objects.filter(slug__icontains='garage').first()
        if not site_project:
            site_project = SiteProject.objects.first()
        
        if site_project:
            QuoteRequest.objects.create(
                site_project=site_project,
                name="Test Customer",
                email="test@example.com", 
                phone="+351 912 345 678",
                license_plate="AB-12-CD",
                car_make_model="Toyota Corolla 2018",
                service_type="revisao",
                message="Need oil change and inspection",
                source_page_slug="orcamento",
                locale="pt",
                consent_marketing=True
            )
            print("✅ Test quote request created")
        else:
            print("❌ No SiteProject found - cannot create test data")
            return
    
    # Get or create admin user
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
    
    try:
        # Test list endpoint
        print("\n📋 Testing list endpoint...")
        response = requests.get(f"{base_url}/admin/quote-requests/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ List endpoint working - returned {len(data)} quote requests")
            
            if data:
                quote_id = data[0]['id']
                print(f"📝 First quote: {data[0]['name']} from {data[0]['site_project_name']}")
                
                # Test detail endpoint
                print(f"\n🔍 Testing detail endpoint for ID {quote_id}...")
                detail_response = requests.get(f"{base_url}/admin/quote-requests/{quote_id}/", headers=headers)
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    print(f"✅ Detail endpoint working - got quote for {detail_data['name']}")
                else:
                    print(f"❌ Detail endpoint failed: {detail_response.status_code}")
                    print(detail_response.text)
            
            # Test filtering
            print("\n🔍 Testing site_slug filter...")
            site_projects = SiteProject.objects.all()[:3]
            for project in site_projects:
                filter_response = requests.get(
                    f"{base_url}/admin/quote-requests/?site_slug={project.slug}", 
                    headers=headers
                )
                if filter_response.status_code == 200:
                    filtered_data = filter_response.json()
                    print(f"   Site {project.slug}: {len(filtered_data)} quotes")
        else:
            print(f"❌ List endpoint failed: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Django server. Make sure it's running on port 8000")
        print("   Run: python manage.py runserver 8000")

if __name__ == "__main__":
    test_admin_quote_requests_api()