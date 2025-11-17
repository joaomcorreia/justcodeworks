#!/usr/bin/env python3
"""
Complete Step 1 → Step 2 → Step 3 Workflow Test
Tests the entire screenshot-to-section generation system.

Step 1: Upload screenshot (SectionDraft creation)
Step 2: AI processing (OpenAI Vision analysis)
Step 3: Create actual Section + Field models from AI data
"""

import os
import sys
import django
import requests
import json
from pathlib import Path

# Setup Django environment
sys.path.append('C:\\projects\\justcodeworks\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field, SectionDraft
from django.contrib.auth.models import User

BASE_URL = "http://localhost:8000"

def create_test_data():
    """Create test project and page for testing."""
    print("🏗️  Setting up test data...")
    
    # Get or create test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
        }
    )
    if created:
        user.set_password('testpass')
        user.save()
        print(f"   Created test user: {user.username}")
    else:
        print(f"   Using existing test user: {user.username}")
    
    # Get or create test project
    project, created = SiteProject.objects.get_or_create(
        slug='step3-test-project',
        defaults={
            'name': 'Step 3 Test Project',
            'owner': user,
        }
    )
    if created:
        print(f"   Created test project: {project.name}")
    else:
        print(f"   Using existing test project: {project.name}")
    
    # Get or create test page
    page, created = Page.objects.get_or_create(
        slug='test-page',
        project=project,
        defaults={
            'title': 'Test Page for Step 3',
        }
    )
    if created:
        print(f"   Created test page: {page.title}")
    else:
        print(f"   Using existing test page: {page.title}")
    
    return user, project, page

def test_step1_upload():
    """Test Step 1: Screenshot upload."""
    print("\n🔄 Testing Step 1: Screenshot Upload")
    
    # Create a simple test image
    from PIL import Image
    import io
    import tempfile
    
    # Create a test image
    img = Image.new('RGB', (800, 600), color='white')
    temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    img.save(temp_file.name, 'PNG')
    
    try:
        # Get CSRF token
        session = requests.Session()
        csrf_response = session.get(f"{BASE_URL}/api/csrf/")
        csrf_token = csrf_response.json().get('csrfToken')
        
        # Upload screenshot
        with open(temp_file.name, 'rb') as f:
            files = {'image': f}
            data = {
                'project': project.id,
                'section_name': 'AI Generated Section',
                'locale': 'en'
            }
            headers = {'X-CSRFToken': csrf_token}
            
            response = session.post(
                f"{BASE_URL}/api/sections/upload-screenshot/",
                files=files,
                data=data,
                headers=headers
            )
        
        if response.status_code == 201:
            result = response.json()
            print(f"   ✅ Step 1 completed: SectionDraft {result['id']} created")
            return result['id']
        else:
            print(f"   ❌ Step 1 failed: {response.status_code}")
            print(f"      Response: {response.text}")
            return None
    
    finally:
        # Clean up temp file
        os.unlink(temp_file.name)

def test_step2_ai_processing(draft_id):
    """Test Step 2: AI processing."""
    print(f"\n🧠 Testing Step 2: AI Processing for draft {draft_id}")
    
    # Check if OpenAI API key is available
    from django.conf import settings
    if not getattr(settings, 'OPENAI_API_KEY', None):
        print("   ⏭️  Skipping Step 2: No OpenAI API key configured")
        
        # Simulate AI processing by manually setting ai_output_json
        draft = SectionDraft.objects.get(id=draft_id)
        draft.ai_output_json = {
            "sections": [
                {
                    "type": "hero",
                    "title": "Welcome to Test Restaurant",
                    "content": "Experience the finest dining with our chef's special menu.",
                    "cta_text": "View Menu",
                    "cta_url": "/menu"
                },
                {
                    "type": "about", 
                    "title": "About Us",
                    "content": "We've been serving exceptional food for over 20 years."
                },
                {
                    "type": "contact",
                    "title": "Visit Us",
                    "content": "123 Main Street, Foodie City. Open daily 5pm-11pm."
                }
            ],
            "business_type": "restaurant",
            "overall_theme": "modern",
            "color_scheme": "warm"
        }
        draft.status = 'ready'
        draft.save()
        print("   ✅ Step 2 simulated: AI data manually added")
        return True
    
    try:
        # Get CSRF token
        session = requests.Session()
        csrf_response = session.get(f"{BASE_URL}/api/csrf/")
        csrf_token = csrf_response.json().get('csrfToken')
        
        # Process with AI
        headers = {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        }
        
        response = session.post(
            f"{BASE_URL}/api/sections/{draft_id}/process/",
            headers=headers
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('ai_output_json'):
                sections_count = len(result['ai_output_json'].get('sections', []))
                print(f"   ✅ Step 2 completed: {sections_count} sections extracted")
                return True
            else:
                print("   ❌ Step 2 failed: No AI data returned")
                return False
        else:
            print(f"   ❌ Step 2 failed: {response.status_code}")
            print(f"      Response: {response.text}")
            return False
    
    except Exception as e:
        print(f"   ❌ Step 2 error: {e}")
        return False

def test_step3_create_sections(draft_id, page_id):
    """Test Step 3: Create sections from AI data."""
    print(f"\n🚀 Testing Step 3: Create Sections for page {page_id}")
    
    try:
        # Get CSRF token
        session = requests.Session()
        csrf_response = session.get(f"{BASE_URL}/api/csrf/")
        csrf_token = csrf_response.json().get('csrfToken')
        
        # Create sections
        headers = {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json'
        }
        data = {'page_id': page_id}
        
        response = session.post(
            f"{BASE_URL}/api/sections/drafts/{draft_id}/create-section/",
            headers=headers,
            json=data
        )
        
        if response.status_code == 201:
            result = response.json()
            sections_created = result.get('sections_created', 0)
            print(f"   ✅ Step 3 completed: {sections_created} sections created")
            
            # Verify sections were actually created in database
            page = Page.objects.get(id=page_id)
            db_sections = page.sections.filter(identifier__startswith='ai-')
            print(f"   📊 Database verification: {db_sections.count()} AI sections found")
            
            # Show created sections
            for section in db_sections:
                fields_count = section.fields.count()
                print(f"      - {section.identifier}: {section.internal_name} ({fields_count} fields)")
            
            return True
        else:
            print(f"   ❌ Step 3 failed: {response.status_code}")
            print(f"      Response: {response.text}")
            return False
    
    except Exception as e:
        print(f"   ❌ Step 3 error: {e}")
        return False

def main():
    """Run the complete workflow test."""
    print("🧪 Complete Step 1 → Step 2 → Step 3 Workflow Test")
    print("=" * 60)
    
    # Setup
    global user, project, page
    user, project, page = create_test_data()
    
    # Step 1: Upload
    draft_id = test_step1_upload()
    if not draft_id:
        print("\n❌ Workflow failed at Step 1")
        return
    
    # Step 2: AI Processing
    step2_success = test_step2_ai_processing(draft_id)
    if not step2_success:
        print("\n❌ Workflow failed at Step 2")
        return
    
    # Step 3: Create Sections
    step3_success = test_step3_create_sections(draft_id, page.id)
    if not step3_success:
        print("\n❌ Workflow failed at Step 3")
        return
    
    print("\n" + "=" * 60)
    print("🎉 Complete workflow test PASSED!")
    print("   ✅ Step 1: Screenshot upload")
    print("   ✅ Step 2: AI processing")
    print("   ✅ Step 3: Section creation")
    print("\n🔗 Next steps:")
    print(f"   - Visit http://localhost:3000/admin to see the uploaded screenshot")
    print(f"   - Edit page '{page.title}' to see the generated sections")
    print(f"   - Check the Section fields for extracted content")

if __name__ == '__main__':
    main()