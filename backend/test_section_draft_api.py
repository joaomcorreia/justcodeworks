#!/usr/bin/env python3

"""
Test script for SectionDraft API - Step 1 implementation
Tests the /api/sections/upload-screenshot/ endpoint
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

from sites.models import SiteProject, User

def create_test_image():
    """Create a simple test PNG image in memory."""
    img = Image.new('RGB', (800, 600), color='lightblue')
    img_buffer = BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    return img_buffer

def test_section_draft_api():
    """Test the SectionDraft upload API."""
    print("🚀 Testing SectionDraft Upload API...")
    
    # First, test if the server is running
    try:
        response = requests.get('http://localhost:8000/api/csrf/')
        print(f"✅ Server is running (CSRF: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start with: python manage.py runserver 8000")
        return
    
    # Get a test project
    try:
        admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            print("❌ No admin user found. Please create one.")
            return
        
        project = SiteProject.objects.first()
        if not project:
            print("❌ No projects found in database.")
            return
        
        print(f"📋 Using project: {project.name} (ID: {project.id})")
        print(f"👤 Using admin user: {admin_user.username}")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return
    
    # Test the API endpoint
    api_url = 'http://localhost:8000/api/sections/upload-screenshot/'
    
    # Create test image
    test_image = create_test_image()
    
    # Prepare the request data
    files = {
        'image': ('test_screenshot.png', test_image, 'image/png')
    }
    
    data = {
        'project': str(project.id),
        'section_name': 'Test Hero Section',
        'locale': 'en'
    }
    
    print(f"📤 Uploading test image to: {api_url}")
    
    try:
        # Make the request (without auth first to test)
        response = requests.post(api_url, files=files, data=data)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 401:
            print("🔐 Authentication required (expected)")
            print("📝 Response:", response.text)
        elif response.status_code == 201:
            print("✅ SUCCESS: Section draft created!")
            result = response.json()
            print(f"📋 Draft ID: {result.get('id')}")
            print(f"🖼️  Image URL: {result.get('image_url')}")
            print(f"📊 Status: {result.get('status')}")
        else:
            print(f"⚠️  Unexpected status: {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request error: {e}")

if __name__ == '__main__':
    test_section_draft_api()