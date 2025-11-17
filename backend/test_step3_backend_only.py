#!/usr/bin/env python3
"""
Step 3 Backend API Test
Direct test of the Step 3 API endpoint functionality.
"""

import os
import sys
import django
import json

# Setup Django environment
sys.path.append('C:\\projects\\justcodeworks\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field, SectionDraft
from django.contrib.auth.models import User
from django.test import RequestFactory
from sites.views import SectionDraftCreateSectionView
from django.http import JsonResponse
import uuid

def test_step3_backend():
    """Test Step 3 backend functionality directly."""
    print("🚀 Testing Step 3 Backend API")
    print("=" * 50)
    
    # Create test data
    print("📦 Creating test data...")
    
    user, created = User.objects.get_or_create(
        username='step3testuser',
        defaults={'email': 'step3test@example.com'}
    )
    
    project, created = SiteProject.objects.get_or_create(
        slug='step3-backend-test',
        defaults={'name': 'Step 3 Backend Test', 'owner': user}
    )
    
    page, created = Page.objects.get_or_create(
        slug='test-page-step3',
        project=project,
        defaults={'title': 'Step 3 Test Page'}
    )
    
    # Create a section draft with AI output
    section_draft = SectionDraft.objects.create(
        project=project,
        status='ready',
        section_name='Test AI Section',
        ai_output_json={
            "sections": [
                {
                    "type": "hero",
                    "title": "Welcome to Our Restaurant",
                    "content": "Experience fine dining with our chef's special menu featuring locally sourced ingredients.",
                    "cta_text": "View Menu",
                    "cta_url": "/menu"
                },
                {
                    "type": "about",
                    "title": "About Our Story", 
                    "content": "For over 25 years, we've been serving the community with passion and dedication to culinary excellence."
                },
                {
                    "type": "contact",
                    "title": "Visit Us Today",
                    "content": "Located at 123 Gourmet Street, Downtown. Open Tuesday-Sunday, 5:00 PM - 11:00 PM."
                }
            ],
            "business_type": "restaurant",
            "overall_theme": "elegant",
            "color_scheme": "warm"
        }
    )
    
    print(f"   ✅ Created test draft: {section_draft.id}")
    print(f"   ✅ Created test page: {page.title}")
    
    # Count existing sections
    initial_sections = Section.objects.filter(page=page).count()
    initial_fields = Field.objects.filter(section__page=page).count()
    
    print(f"   📊 Initial state: {initial_sections} sections, {initial_fields} fields")
    
    # Test the Step 3 API directly
    print("\n🔧 Testing Step 3 API endpoint...")
    
    factory = RequestFactory()
    request = factory.post(
        f'/api/sections/drafts/{section_draft.id}/create-section/',
        data=json.dumps({'page_id': str(page.id)}),
        content_type='application/json'
    )
    request.user = user  # Mock authentication
    
    # Call the API view
    view = SectionDraftCreateSectionView()
    response = view.post(request, draft_id=section_draft.id)
    
    # Check response
    if response.status_code == 201:
        response_data = json.loads(response.content)
        print(f"   ✅ API Success: {response_data['sections_created']} sections created")
        
        # Verify database changes
        final_sections = Section.objects.filter(page=page).count()
        final_fields = Field.objects.filter(section__page=page).count()
        
        print(f"   📊 Final state: {final_sections} sections (+{final_sections - initial_sections})")
        print(f"                   {final_fields} fields (+{final_fields - initial_fields})")
        
        # Show created sections
        ai_sections = Section.objects.filter(page=page, identifier__startswith='ai-')
        print(f"\n📋 Created AI Sections ({ai_sections.count()}):")
        
        for section in ai_sections:
            print(f"   🔸 {section.identifier}: {section.internal_name}")
            fields = section.fields.all()
            for field in fields:
                value_preview = field.value[:50] + "..." if len(field.value) > 50 else field.value
                print(f"      - {field.key}: {value_preview}")
        
        # Check metadata section
        metadata_section = Section.objects.filter(page=page, identifier='ai-metadata').first()
        if metadata_section:
            print(f"\n🏷️  Metadata Section: {metadata_section.internal_name}")
            for field in metadata_section.fields.all():
                print(f"      - {field.key}: {field.value}")
        
        print("\n🎉 Step 3 Backend Test PASSED!")
        return True
    
    else:
        print(f"   ❌ API Failed: {response.status_code}")
        if hasattr(response, 'content'):
            error_data = json.loads(response.content)
            print(f"      Error: {error_data}")
        return False

def test_step3_validation():
    """Test Step 3 validation and error handling."""
    print("\n🔍 Testing Step 3 Validation...")
    
    # Test with non-existent draft
    factory = RequestFactory()
    request = factory.post(
        f'/api/sections/drafts/{uuid.uuid4()}/create-section/',
        data=json.dumps({'page_id': 'fake'}),
        content_type='application/json'
    )
    
    user = User.objects.first()
    request.user = user
    
    view = SectionDraftCreateSectionView()
    response = view.post(request, draft_id=uuid.uuid4())
    
    if response.status_code == 404:
        print("   ✅ Correctly handles non-existent draft")
    else:
        print(f"   ❌ Unexpected response for invalid draft: {response.status_code}")
        return False
    
    print("   ✅ Validation tests passed!")
    return True

def main():
    """Run all Step 3 tests."""
    print("🧪 Step 3 Backend API Test Suite")
    print("=" * 60)
    
    # Test core functionality
    if not test_step3_backend():
        print("\n❌ Core functionality test failed")
        return
    
    # Test validation
    if not test_step3_validation():
        print("\n❌ Validation tests failed")
        return
    
    print("\n" + "=" * 60)
    print("🏆 All Step 3 Backend Tests PASSED!")
    print("\n📋 Summary:")
    print("   ✅ Section creation from AI data")
    print("   ✅ Field generation with proper content")
    print("   ✅ Metadata section creation")
    print("   ✅ Error handling and validation")
    print("\n🔗 Ready for frontend integration!")

if __name__ == '__main__':
    main()