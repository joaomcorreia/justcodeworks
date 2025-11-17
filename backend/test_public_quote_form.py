#!/usr/bin/env python
"""
Test script to verify public quote request form submission works
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

from sites.models import QuoteRequest, SiteProject

def test_public_quote_form():
    print("🔍 Testing Public Quote Form Submission...")
    
    # Find a site project (preferably garage-related)
    site_project = SiteProject.objects.filter(slug__icontains='garage').first()
    if not site_project:
        # Fallback to any site project
        site_project = SiteProject.objects.first()
    
    if not site_project:
        print("❌ No SiteProject found - cannot test")
        return
        
    print(f"🏗️  Using site project: {site_project.name} ({site_project.slug})")
    
    # Count existing quotes
    initial_count = QuoteRequest.objects.filter(site_project=site_project).count()
    print(f"📊 Initial quote count for this site: {initial_count}")
    
    # Test data
    quote_data = {
        "name": "Test Customer API",
        "email": "test-api@example.com",
        "phone": "+351 987 654 321",
        "license_plate": "XY-99-ZZ",
        "car_make_model": "BMW X3 2020",
        "service_type": "troca_oleo",
        "message": "Need oil change ASAP - API test submission",
        "source_page_slug": "orcamento",
        "locale": "pt",
        "consent_marketing": True
    }
    
    # Submit to public API
    url = f"http://localhost:8000/api/sites/{site_project.slug}/quote-requests/"
    print(f"🌐 Submitting to: {url}")
    
    try:
        response = requests.post(
            url, 
            json=quote_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Quote request created successfully!")
            response_data = response.json()
            print(f"📝 Response data: {response_data}")
            
            # Verify in database
            new_count = QuoteRequest.objects.filter(site_project=site_project).count()
            print(f"📊 New quote count for this site: {new_count}")
            
            if new_count > initial_count:
                print("✅ Quote was successfully saved to database!")
                
                # Get the latest quote
                latest_quote = QuoteRequest.objects.filter(site_project=site_project).order_by('-created_at').first()
                print(f"📋 Latest quote: {latest_quote}")
            else:
                print("❌ Quote was not saved to database")
        
        else:
            print(f"❌ Quote submission failed: {response.status_code}")
            print(f"📄 Response content: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Django server. Make sure it's running on port 8000")
        print("   Run: python manage.py runserver 8000")
    except Exception as e:
        print(f"❌ Error during submission: {e}")

if __name__ == "__main__":
    test_public_quote_form()