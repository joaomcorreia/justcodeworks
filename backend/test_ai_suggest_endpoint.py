#!/usr/bin/env python3
"""Test script for the AI section suggestion endpoint."""

import os
import sys
import django
import requests
import json
from django.contrib.auth.models import User
from django.test import Client

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def test_ai_suggest_endpoint():
    print("🧱 Testing AI Suggestion Endpoint")
    print("=" * 50)
    
    try:
        # Find a test section
        section = Section.objects.select_related('page__project').first()
        if not section:
            print("❌ No sections found in database")
            return
            
        print(f"✅ Found section: {section.identifier}")
        print(f"   Project: {section.page.project.name}")
        print(f"   Owner: {section.page.project.owner.username}")
        print(f"   Section ID: {section.id}")
        
        # Check fields
        fields = section.fields.all()
        print(f"   Fields: {[f.key for f in fields]}")
        
        # Test the endpoint (without OpenAI key - expect error)
        client = Client()
        
        # Login as the section owner
        client.force_login(section.page.project.owner)
        
        response = client.post(f'/api/builder/sections/{section.id}/ai-suggest/', 
                              data=json.dumps({
                                  'locale': 'en',
                                  'tone': 'friendly'
                              }),
                              content_type='application/json')
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data}")
        elif response.status_code == 503:
            print("   ⚠️  Expected error: OpenAI API key not configured")
            print("   This is normal - endpoint is working, just needs API key")
        else:
            print(f"   Response: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ai_suggest_endpoint()