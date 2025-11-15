#!/usr/bin/env python3
"""
Test script to verify locale fallback functionality for Page API.

This script tests:
1. Getting a page that exists in the requested locale (PT) → should return PT version
2. Getting a page that doesn't exist in PT but exists in EN → should return EN version
3. Getting a page that doesn't exist in any locale → should return empty result
"""

import os
import sys
import django
import requests
import json

# Add parent directory to path so we can import Django modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

API_BASE = "http://127.0.0.1:8000/api"

def create_test_data():
    """Create test pages for locale fallback testing."""
    print("🔧 Creating test data...")
    
    # Get or create a test project
    project, created = SiteProject.objects.get_or_create(
        slug="test-locale-fallback",
        defaults={
            'name': 'Test Locale Fallback Project',
            'is_active': True,
        }
    )
    
    # Create test pages
    # 1. Home page - exists in both EN and PT
    home_en, _ = Page.objects.get_or_create(
        project=project,
        slug="home",
        locale="en",
        defaults={
            'title': 'Home (English)',
            'path': '/',
            'is_published': True,
        }
    )
    
    home_pt, _ = Page.objects.get_or_create(
        project=project,
        slug="home",
        locale="pt",
        defaults={
            'title': 'Página Inicial (Português)',
            'path': '/',
            'is_published': True,
        }
    )
    
    # 2. About page - exists only in EN (no PT version)
    about_en, _ = Page.objects.get_or_create(
        project=project,
        slug="about",
        locale="en",
        defaults={
            'title': 'About Us (English only)',
            'path': '/about',
            'is_published': True,
        }
    )
    
    print(f"✅ Project: {project.name} (ID: {project.id})")
    print(f"✅ Home EN: {home_en.title}")
    print(f"✅ Home PT: {home_pt.title}")
    print(f"✅ About EN: {about_en.title}")
    print()
    
    return project

def test_locale_fallback():
    """Test the locale fallback API functionality."""
    project = create_test_data()
    
    print("🧪 Testing Locale Fallback API...")
    print("=" * 50)
    
    test_cases = [
        {
            "name": "Home page with PT locale (should return PT version)",
            "slug": "home",
            "locale": "pt",
            "expected_locale": "pt",
            "expected_title": "Página Inicial (Português)"
        },
        {
            "name": "Home page with EN locale (should return EN version)",
            "slug": "home", 
            "locale": "en",
            "expected_locale": "en",
            "expected_title": "Home (English)"
        },
        {
            "name": "About page with PT locale (should fallback to EN)",
            "slug": "about",
            "locale": "pt", 
            "expected_locale": "en",
            "expected_title": "About Us (English only)"
        },
        {
            "name": "About page with EN locale (should return EN)",
            "slug": "about",
            "locale": "en",
            "expected_locale": "en", 
            "expected_title": "About Us (English only)"
        },
        {
            "name": "Non-existent page (should return empty)",
            "slug": "nonexistent",
            "locale": "pt",
            "expected_locale": None,
            "expected_title": None
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. {test_case['name']}")
        print("-" * 40)
        
        # Make API request
        url = f"{API_BASE}/pages/?project={project.id}&slug={test_case['slug']}&locale={test_case['locale']}"
        print(f"📡 GET {url}")
        
        try:
            response = requests.get(url)
            print(f"📊 Response: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"📝 Result count: {len(data)}")
                
                if len(data) == 0:
                    if test_case['expected_locale'] is None:
                        print("✅ PASS: Correctly returned empty result for non-existent page")
                    else:
                        print(f"❌ FAIL: Expected page but got empty result")
                elif len(data) == 1:
                    page = data[0]
                    actual_locale = page.get('locale')
                    actual_title = page.get('title')
                    
                    print(f"🌍 Returned locale: {actual_locale}")
                    print(f"📄 Returned title: {actual_title}")
                    
                    if actual_locale == test_case['expected_locale'] and actual_title == test_case['expected_title']:
                        print("✅ PASS: Locale fallback worked correctly")
                    else:
                        print(f"❌ FAIL: Expected locale={test_case['expected_locale']}, title='{test_case['expected_title']}'")
                        print(f"        Got locale={actual_locale}, title='{actual_title}'")
                else:
                    print(f"❌ FAIL: Expected single result, got {len(data)} results")
            else:
                print(f"❌ FAIL: API returned status {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ ERROR: {e}")

def cleanup_test_data():
    """Clean up test data."""
    print("\n🧹 Cleaning up test data...")
    try:
        project = SiteProject.objects.get(slug="test-locale-fallback")
        # Delete pages first (due to foreign key constraints)
        Page.objects.filter(project=project).delete()
        project.delete()
        print("✅ Test data cleaned up")
    except SiteProject.DoesNotExist:
        print("ℹ️ No test data to clean up")

if __name__ == "__main__":
    try:
        test_locale_fallback()
    finally:
        cleanup_test_data()
    
    print("\n" + "=" * 50)
    print("🎯 Testing complete!")
    print("\nIf all tests passed, the locale fallback is working correctly:")
    print("- PT requests → return PT version if available")
    print("- PT requests → fallback to EN if PT not available") 
    print("- EN requests → return EN version")
    print("- Non-existent pages → return empty result")