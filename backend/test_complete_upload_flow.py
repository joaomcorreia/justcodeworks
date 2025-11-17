#!/usr/bin/env python3
"""
Test Script: Complete Screenshot Upload Flow with CSRF
Tests the full upload workflow including CSRF token handling
"""

import requests
import io
from PIL import Image

def test_complete_upload_flow():
    """Test the complete screenshot upload flow with CSRF protection"""
    
    print("🔍 Testing Complete Screenshot Upload Flow...")
    
    # Test 1: Get CSRF token
    print("\n1. Testing CSRF token endpoint...")
    csrf_response = requests.get('http://localhost:8000/api/csrf/')
    print(f"   CSRF Status: {csrf_response.status_code}")
    
    if csrf_response.status_code == 200:
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get('csrfToken')
        print(f"   CSRF Token: {csrf_token[:20]}..." if csrf_token else "   CSRF Token: Missing!")
    else:
        print(f"   ❌ Failed to get CSRF token: {csrf_response.text}")
        return
    
    # Test 2: Get available projects
    print("\n2. Testing projects API...")
    projects_response = requests.get('http://localhost:8000/api/admin/user-sites/')
    print(f"   Projects Status: {projects_response.status_code}")
    
    if projects_response.status_code == 200:
        projects_data = projects_response.json()
        projects = projects_data if isinstance(projects_data, list) else projects_data.get('results', [])
        print(f"   Available projects: {len(projects)}")
        
        if projects:
            selected_project = projects[0]
            print(f"   Using project: {selected_project['name']} ({selected_project['id']})")
        else:
            print("   ❌ No projects available for testing")
            return
    else:
        print(f"   ❌ Failed to get projects: {projects_response.text}")
        return
    
    # Test 3: Create a test image
    print("\n3. Creating test image...")
    img = Image.new('RGB', (800, 600), color='red')
    img_io = io.BytesIO()
    img.save(img_io, format='PNG')
    img_io.seek(0)
    
    # Test 4: Upload screenshot with CSRF
    print("\n4. Testing screenshot upload...")
    files = {
        'image': ('test-screenshot.png', img_io, 'image/png')
    }
    
    data = {
        'project': selected_project['id'],
        'locale': 'en',
        'section_name': 'Test Section from API'
    }
    
    headers = {
        'X-CSRFToken': csrf_token
    }
    
    upload_response = requests.post(
        'http://localhost:8000/api/sections/upload-screenshot/',
        files=files,
        data=data,
        headers=headers
    )
    
    print(f"   Upload Status: {upload_response.status_code}")
    
    if upload_response.status_code == 201:
        upload_data = upload_response.json()
        print("   ✅ Upload successful!")
        print(f"   Draft ID: {upload_data.get('id')}")
        print(f"   Status: {upload_data.get('status')}")
        print(f"   Section Name: {upload_data.get('section_name')}")
        print(f"   Image URL: {upload_data.get('image_url', 'N/A')}")
    else:
        try:
            error_data = upload_response.json()
            print(f"   ❌ Upload failed: {error_data}")
        except:
            print(f"   ❌ Upload failed: {upload_response.text}")
    
    # Test 5: Check if draft was created in database
    print("\n5. Checking database...")
    try:
        import os, django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
        django.setup()
        
        from sites.models import SectionDraft
        recent_drafts = SectionDraft.objects.order_by('-created_at')[:3]
        print(f"   Recent drafts in DB: {recent_drafts.count()}")
        
        for draft in recent_drafts:
            print(f"   - {draft.section_name} ({draft.status}) - {draft.created_at.strftime('%H:%M:%S')}")
            
    except Exception as e:
        print(f"   Database check error: {e}")

if __name__ == "__main__":
    test_complete_upload_flow()