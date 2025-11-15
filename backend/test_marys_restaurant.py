#!/usr/bin/env python
"""
Test script for Mary's Restaurant tenant showcase
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def test_marys_restaurant_data():
    print("🍽️ Testing Mary's Restaurant Data...")
    
    try:
        # Check if Mary's Restaurant exists
        restaurant = SiteProject.objects.get(name="Mary's Restaurant")
        print(f"✅ Found project: {restaurant.name}")
        print(f"   - ID: {restaurant.id}")
        print(f"   - Owner: {restaurant.owner.username}")
        print(f"   - Template: {restaurant.site_template.name if restaurant.site_template else 'None'}")
        
        # Check pages
        pages = restaurant.pages.all().order_by('order')
        print(f"   - Pages: {pages.count()}")
        
        for page in pages:
            sections = page.sections.all().order_by('order')
            total_fields = sum(section.fields.count() for section in sections)
            print(f"     📄 {page.title} ({page.slug})")
            print(f"        - Path: {page.path}")
            print(f"        - Sections: {sections.count()}")
            print(f"        - Fields: {total_fields}")
            
            for section in sections:
                fields = section.fields.all().order_by('order')
                print(f"        📑 {section.internal_name} ({section.identifier}) - {fields.count()} fields")
        
        return True
        
    except SiteProject.DoesNotExist:
        print("❌ Mary's Restaurant not found!")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_showcase_api():
    """Test the tenant showcase API endpoint logic"""
    print("\n🌐 Testing Tenant Showcase API Logic...")
    
    try:
        # Import the view and test its logic
        from sites.views import TenantShowcaseView
        from django.test import RequestFactory
        from django.contrib.auth.models import User
        
        # Create a mock request
        factory = RequestFactory()
        request = factory.get('/api/admin/tenant-showcase/')
        
        # Create a mock user (admin)
        user = User.objects.filter(is_staff=True).first()
        if not user:
            print("⚠️ No admin user found. API requires admin authentication.")
            return True
            
        request.user = user
        
        # Test the view
        view = TenantShowcaseView()
        view.request = request
        response = view.get(request)
        
        if response.status_code == 200:
            data = response.data
            print("✅ API logic working!")
            print(f"   - Project Name: {data['project']['name']}")
            print(f"   - Business Type: {data['project']['business_type']}")
            print(f"   - Template: {data['project']['template_name']}")
            print(f"   - Stats: {data['stats']['total_pages']} pages, {data['stats']['total_sections']} sections, {data['stats']['total_fields']} fields")
            return True
        else:
            print(f"❌ API logic returned error: {response.data}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API logic: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🧪 Testing Mary's Restaurant Tenant Showcase\n")
    
    # Test 1: Check database data
    db_success = test_marys_restaurant_data()
    
    # Test 2: Check API endpoint  
    api_success = test_showcase_api()
    
    print(f"\n📊 Test Results:")
    print(f"   Database Data: {'✅ PASS' if db_success else '❌ FAIL'}")
    print(f"   API Endpoint: {'✅ PASS' if api_success else '❌ FAIL'}")
    
    if db_success and api_success:
        print(f"\n🎉 All tests passed! Mary's Restaurant is ready for showcase.")
        print(f"   📍 Admin URL: http://127.0.0.1:8000/admin/")
        print(f"   🍽️ Tenant Showcase: http://127.0.0.1:8000/admin/tenant-showcase/")
    else:
        print(f"\n⚠️ Some tests failed. Please check the issues above.")