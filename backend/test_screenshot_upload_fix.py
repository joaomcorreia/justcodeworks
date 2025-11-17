#!/usr/bin/env python3
"""
Test Script: Screenshot Upload Fix Verification
Tests the SectionDraft API after fixing the frontend i18n import issue
"""

import os
import django
import sys

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

import requests
from django.contrib.auth import get_user_model
from sites.models import SiteProject, SectionDraft

User = get_user_model()

def test_section_draft_api():
    """Test the SectionDraft API endpoint after i18n fix"""
    print("🔍 Testing Screenshot Upload API after i18n fix...")
    
    # Test 1: Check if endpoint exists (should get 403 without auth)
    print("\n1. Testing endpoint accessibility...")
    response = requests.post("http://localhost:8000/api/sections/upload-screenshot/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text}")
    
    if response.status_code == 403:
        print("   ✅ Endpoint exists and properly requires authentication")
    else:
        print("   ❌ Unexpected response - endpoint may not be configured correctly")
    
    # Test 2: Check SectionDraft model
    print("\n2. Testing SectionDraft model...")
    try:
        # Count existing drafts
        draft_count = SectionDraft.objects.count()
        print(f"   Current SectionDraft count: {draft_count}")
        
        # Check if we have users and projects for testing
        user_count = User.objects.count()
        project_count = SiteProject.objects.count()
        
        print(f"   Users in system: {user_count}")
        print(f"   Projects in system: {project_count}")
        
        if user_count > 0 and project_count > 0:
            print("   ✅ Database has users and projects for testing")
        else:
            print("   ⚠️  Database needs test data (users/projects)")
            
    except Exception as e:
        print(f"   ❌ Model error: {e}")
    
    # Test 3: Frontend URL accessibility
    print("\n3. Testing frontend admin page accessibility...")
    try:
        response = requests.get("http://localhost:3000/en/admin/sections/create-from-screenshot")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Frontend admin page is accessible")
            # Check if the page loads without the getDictionary error
            if 'getDictionary is not a function' in response.text:
                print("   ❌ getDictionary error still present")
            else:
                print("   ✅ No visible getDictionary errors in response")
        else:
            print(f"   ⚠️  Frontend response: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Frontend connection error: {e}")

if __name__ == "__main__":
    test_section_draft_api()