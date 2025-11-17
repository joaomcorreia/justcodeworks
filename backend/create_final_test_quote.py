#!/usr/bin/env python
"""
Final test - Create a quote request for Oficina Paulo Calibra specifically
"""
import os
import sys
import django
import requests

# Set up Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

def create_oficina_paulo_quote():
    print("🔧 Creating quote for Oficina Paulo Calibra...")
    
    # Find Oficina Paulo Calibra or garage project
    site_project = SiteProject.objects.filter(
        name__icontains="oficina"
    ).first() or SiteProject.objects.filter(
        name__icontains="garage"
    ).first() or SiteProject.objects.filter(
        slug__icontains="garage"
    ).first()
    
    if not site_project:
        print("❌ No garage-related site project found")
        return
        
    print(f"🏗️  Found: {site_project.name} ({site_project.slug})")
    
    quote_data = {
        "name": "Carlos Silva",
        "email": "carlos.silva@email.com",
        "phone": "+351 934 567 890",
        "license_plate": "AB-34-EF",
        "car_make_model": "Volkswagen Golf 2019",
        "service_type": "revisao",
        "message": "Preciso de uma revisão completa do meu carro. Já tem 60,000 km.",
        "source_page_slug": "orcamento",
        "locale": "pt",
        "consent_marketing": True
    }
    
    url = f"http://localhost:8000/api/sites/{site_project.slug}/quote-requests/"
    
    try:
        response = requests.post(url, json=quote_data)
        if response.status_code == 201:
            print("✅ Quote created successfully!")
            print(f"📋 Quote data: {response.json()}")
            print("\n🌐 Check admin interface at: http://localhost:3001/en/admin/leads")
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_oficina_paulo_quote()