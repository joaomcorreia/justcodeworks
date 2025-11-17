#!/usr/bin/env python
"""
Test Step 0 Onboarding API functionality
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

django.setup()

from django.contrib.auth.models import User
from sites.serializers import Step0OnboardingSerializer
from sites.models import SiteProject

def test_step0_serializer():
    """Test the Step 0 onboarding serializer"""
    
    print("🔧 Testing Step 0 Onboarding Serializer...")
    
    # Test data
    test_data = {
        "entry_intent": "website",
        "business_name": "Test Business Inc",
        "business_type": "Technology Services",
        "primary_country": "United States",
        "primary_language": "en",
        "brand_primary_color": "#1D4ED8",
        "brand_secondary_color": "#6366F1",
        "preferred_theme_mode": "dark",
        "primary_goal": "get-leads",
        "onboarding_notes": "Test onboarding data"
    }
    
    # Test serializer validation
    serializer = Step0OnboardingSerializer(data=test_data)
    
    if serializer.is_valid():
        print("✅ Serializer validation passed")
        print(f"📊 Validated data: {serializer.validated_data}")
        
        # Get or create test user
        user, created = User.objects.get_or_create(
            username='test_onboarding_user',
            defaults={'email': 'test@example.com'}
        )
        
        if created:
            print(f"👤 Created test user: {user.username}")
        else:
            print(f"👤 Using existing test user: {user.username}")
        
        # Test project creation
        try:
            project = serializer.create_or_update_project(serializer.validated_data, user)
            print(f"🏗️ Project created successfully: {project.name} (ID: {project.id})")
            print(f"📍 Project slug: {project.slug}")
            print(f"🎯 Entry intent: {project.entry_intent}")
            print(f"🏢 Business name: {project.business_name}")
            print(f"🎨 Brand colors: {project.brand_primary_color} / {project.brand_secondary_color}")
            
            # Test updating existing project
            print("\n🔄 Testing project update...")
            updated_data = test_data.copy()
            updated_data['business_name'] = "Updated Test Business"
            updated_data['primary_goal'] = "sell-online"
            
            update_serializer = Step0OnboardingSerializer(data=updated_data)
            if update_serializer.is_valid():
                updated_project = update_serializer.create_or_update_project(update_serializer.validated_data, user)
                print(f"✅ Project updated successfully: {updated_project.name}")
                print(f"🎯 Updated primary goal: {updated_project.primary_goal}")
                
        except Exception as e:
            print(f"❌ Error creating/updating project: {e}")
            
    else:
        print("❌ Serializer validation failed")
        print(f"🚨 Validation errors: {serializer.errors}")


def test_api_endpoint_structure():
    """Test that the API endpoint is properly configured"""
    
    print("\n🔌 Testing API endpoint configuration...")
    
    try:
        from sites.views import step0_onboarding_view
        print("✅ step0_onboarding_view function imported successfully")
        
        # Check if it's properly decorated
        if hasattr(step0_onboarding_view, '__wrapped__'):
            print("✅ API view has decorators applied")
            
    except ImportError as e:
        print(f"❌ Failed to import API view: {e}")
    
    try:
        from sites.api_urls import urlpatterns
        step0_url_found = False
        for pattern in urlpatterns:
            if hasattr(pattern, 'name') and pattern.name == 'step0-onboarding':
                step0_url_found = True
                print("✅ Step 0 URL pattern found in api_urls.py")
                break
        
        if not step0_url_found:
            print("❌ Step 0 URL pattern not found in api_urls.py")
            
    except Exception as e:
        print(f"❌ Error checking URL patterns: {e}")


if __name__ == "__main__":
    test_step0_serializer()
    test_api_endpoint_structure()
    print("\n🎉 Step 0 API testing complete!")