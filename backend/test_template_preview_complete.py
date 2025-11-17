#!/usr/bin/env python
"""
Final comprehensive test for Template Preview & Sections Explorer
"""
import os
import sys
import django
import requests

# Set up Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def test_template_preview_complete_workflow():
    print("🔍 Testing Complete Template Preview Workflow...")
    
    # Get admin user
    admin_user = User.objects.filter(is_staff=True).first()
    if not admin_user:
        print("❌ No admin user found")
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
    
    template_keys = ['restaurant-modern', 'auto-garage-modern']
    
    for template_key in template_keys:
        print(f"\n🏗️  Testing template: {template_key}")
        
        try:
            # 1. Test sample site mapping
            sample_response = requests.get(
                f"{base_url}/admin/templates/{template_key}/sample-site/", 
                headers=headers
            )
            
            if sample_response.status_code == 200:
                sample_data = sample_response.json()
                sample_slug = sample_data['sample_site_slug']
                print(f"   ✅ Sample site mapping: {sample_slug}")
                
                # 2. Test public site data
                public_response = requests.get(
                    f"{base_url}/sites/{sample_slug}/public/?locale=en"
                )
                
                if public_response.status_code == 200:
                    public_data = public_response.json()
                    print(f"   ✅ Public site data loaded")
                    
                    # Check sections in home page
                    pages = public_data.get('pages', [])
                    home_page = next((p for p in pages if p['slug'] == 'home'), pages[0] if pages else None)
                    
                    if home_page and 'sections' in home_page:
                        sections = home_page['sections']
                        print(f"   ✅ Found {len(sections)} sections in home page:")
                        
                        for i, section in enumerate(sections[:3], 1):  # Show first 3
                            print(f"      {i}. {section.get('identifier', 'unknown')} (order: {section.get('order', 'N/A')})")
                    else:
                        print(f"   ⚠️  No sections found in home page")
                else:
                    print(f"   ❌ Failed to load public site data: {public_response.status_code}")
            else:
                print(f"   ❌ Sample site mapping failed: {sample_response.status_code}")
                
            # 3. Test template detail by key
            template_response = requests.get(
                f"{base_url}/admin/templates/key/{template_key}/", 
                headers=headers
            )
            
            if template_response.status_code == 200:
                template_data = template_response.json()
                print(f"   ✅ Template detail loaded: {template_data.get('name', 'Unknown')}")
            else:
                print(f"   ❌ Template detail failed: {template_response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ Connection error - ensure Django server is running")
            break
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n🌐 Frontend URLs to test:")
    print(f"   Template Library: http://localhost:3001/en/admin/templates")
    print(f"   Restaurant Preview: http://localhost:3001/en/admin/templates/restaurant-modern")
    print(f"   Garage Preview: http://localhost:3001/en/admin/templates/auto-garage-modern")

if __name__ == "__main__":
    test_template_preview_complete_workflow()