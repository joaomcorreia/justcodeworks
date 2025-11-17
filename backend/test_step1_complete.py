#!/usr/bin/env python3

"""
Complete test of Step 1: SectionDraft Upload API with authentication
Tests the full upload workflow from frontend to backend
"""

import os
import sys
import django
import requests
import json
from io import BytesIO
from PIL import Image

# Setup Django
sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, User, SectionDraft

def create_test_image():
    """Create a simple test PNG image in memory."""
    # Create a simple blue gradient image with some text placeholder
    from PIL import Image, ImageDraw, ImageFont
    
    img = Image.new('RGB', (1200, 800), color='lightblue')
    draw = ImageDraw.Draw(img)
    
    # Add some basic shapes to simulate a website screenshot
    draw.rectangle([50, 50, 1150, 200], fill='darkblue', outline='navy', width=3)
    draw.rectangle([100, 250, 500, 500], fill='white', outline='gray', width=2)
    draw.rectangle([550, 250, 1100, 400], fill='lightgray', outline='gray', width=2)
    draw.rectangle([550, 450, 1100, 600], fill='lightyellow', outline='gray', width=2)
    
    # Try to add text (will work if font is available)
    try:
        draw.text((60, 80), "COMPANY LOGO", fill='white')
        draw.text((110, 270), "Hero Section", fill='black')
        draw.text((560, 270), "About Us", fill='black')
        draw.text((560, 470), "Services", fill='black')
    except:
        pass  # Skip text if font not available
    
    img_buffer = BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    return img_buffer

def login_and_get_session():
    """Login to get session cookies."""
    session = requests.Session()
    
    # Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    if csrf_response.status_code != 200:
        print("❌ Failed to get CSRF token")
        return None, None
    
    csrf_token = csrf_response.json().get('csrfToken')
    
    # Login
    login_data = {
        'email': 'joao@example.com',  # Adjust to your admin user
        'password': '123',            # Adjust to your admin password
        'csrfmiddlewaretoken': csrf_token
    }
    
    login_response = session.post(
        'http://localhost:8000/api/auth/login/',
        data=login_data,
        headers={'X-CSRFToken': csrf_token}
    )
    
    if login_response.status_code == 200:
        print("✅ Login successful")
        return session, csrf_token
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return None, None

def test_authenticated_upload():
    """Test the SectionDraft upload with authentication."""
    print("🔐 Testing SectionDraft Upload with Authentication...")
    
    # Login first
    session, csrf_token = login_and_get_session()
    if not session:
        return
    
    # Get a project to use
    try:
        project = SiteProject.objects.first()
        if not project:
            print("❌ No projects found in database.")
            return
        
        print(f"📋 Using project: {project.name} (ID: {project.id})")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return
    
    # Create test image
    test_image = create_test_image()
    
    # Prepare the request
    api_url = 'http://localhost:8000/api/sections/upload-screenshot/'
    
    files = {
        'image': ('test_website_screenshot.png', test_image, 'image/png')
    }
    
    data = {
        'project': str(project.id),
        'section_name': 'Hero Section from Screenshot',
        'locale': 'en'
    }
    
    print(f"📤 Uploading authenticated test to: {api_url}")
    
    try:
        # Make the authenticated request
        response = session.post(api_url, files=files, data=data)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            print("🎉 SUCCESS: Section draft created with authentication!")
            result = response.json()
            print(f"📋 Draft ID: {result.get('id')}")
            print(f"🖼️  Image URL: {result.get('image_url')}")
            print(f"📊 Status: {result.get('status')}")
            print(f"📝 Section Name: {result.get('section_name')}")
            print(f"🌍 Locale: {result.get('locale')}")
            
            # Check if draft was created in database
            draft_id = result.get('id')
            try:
                draft = SectionDraft.objects.get(id=draft_id)
                print(f"✅ Verified in database: {draft}")
                print(f"📁 Image path: {draft.image.name}")
                print(f"📂 Full path: {draft.image.path}")
            except SectionDraft.DoesNotExist:
                print("❌ Draft not found in database")
                
        elif response.status_code == 400:
            print("⚠️  Validation error:")
            print(f"📝 Response: {response.text}")
        elif response.status_code == 403:
            print("🔒 Authentication/permission error:")
            print(f"📝 Response: {response.text}")
        else:
            print(f"❌ Unexpected status: {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

def show_database_status():
    """Show current SectionDrafts in database."""
    print("\n📊 Current SectionDrafts in Database:")
    drafts = SectionDraft.objects.all()
    
    if not drafts.exists():
        print("   No drafts found")
    else:
        for draft in drafts:
            print(f"   • {draft.id} - {draft.section_name or 'Unnamed'} ({draft.status})")
            print(f"     Project: {draft.project.name}")
            print(f"     Created: {draft.created_at}")
            print(f"     Image: {draft.image.name}")

if __name__ == '__main__':
    print("🚀 Step 1 Complete Test: Screenshot Upload API\n")
    
    # Show current status
    show_database_status()
    
    # Test the API
    test_authenticated_upload()
    
    # Show final status
    print("\n" + "="*60)
    show_database_status()
    
    print("\n✅ Step 1 Test Complete!")
    print("📋 Next Steps:")
    print("   - Step 2: AI processing to generate HTML/JSON from screenshot")
    print("   - Step 3: Convert AI output to website sections")
    print("   - Step 4: Integration with website builder")