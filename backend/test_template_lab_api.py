#!/usr/bin/env python3

"""
Template Lab API Testing Script

This script tests the newly created Template Lab API endpoints:
- GET /api/admin/templates/site/ (SiteTemplate list)
- GET /api/admin/templates/internal/ (Template list)
"""

import os
import sys
import django

# Add the project path to Django settings
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')

try:
    django.setup()
    from sites.models import SiteTemplate, Template
    from django.contrib.auth.models import User
    from django.test import Client
    from django.urls import reverse
    import json
    
    print("🧪 Template Lab API Testing")
    print("=" * 50)
    
    # Check if we have any templates in the database
    print(f"\n📊 Database Status:")
    site_template_count = SiteTemplate.objects.count()
    template_count = Template.objects.count()
    user_count = User.objects.count()
    
    print(f"   SiteTemplate count: {site_template_count}")
    print(f"   Template count: {template_count}")
    print(f"   User count: {user_count}")
    
    if site_template_count == 0:
        print("\n🚧 Creating test SiteTemplate...")
        SiteTemplate.objects.create(
            key="test-template",
            name="Test Template",
            description="Template for testing Template Lab API",
            status="published"
        )
        print("   ✅ Test SiteTemplate created")
    
    if template_count == 0:
        print("\n🚧 Creating test Template...")
        Template.objects.create(
            slug="test-internal",
            name="Test Internal Template", 
            category="one-page",
            complexity="starter",
            short_description="Internal template for testing"
        )
        print("   ✅ Test Template created")
    
    # Create a staff user for testing if none exists
    staff_user = User.objects.filter(is_staff=True).first()
    if not staff_user:
        print("\n🚧 Creating test staff user...")
        staff_user = User.objects.create_user(
            username="stafftest",
            email="staff@test.com", 
            password="testpass123",
            is_staff=True
        )
        print("   ✅ Test staff user created")
    
    print(f"\n🔐 Testing with staff user: {staff_user.username}")
    
    # Test the API endpoints using Django's test client
    client = Client()
    client.force_login(staff_user)
    
    print("\n🎯 Testing Template Lab API Endpoints:")
    
    # Test site templates endpoint
    print("\n1. Testing /api/admin/templates/site/")
    try:
        response = client.get("/api/admin/templates/site/")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   📋 Returned {len(data)} site templates")
            if data:
                print(f"   🔍 Sample: {data[0]['name']} (key: {data[0]['key']})")
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   📄 Response: {response.content.decode()}")
    except Exception as e:
        print(f"   💥 Error: {e}")
    
    # Test internal templates endpoint  
    print("\n2. Testing /api/admin/templates/internal/")
    try:
        response = client.get("/api/admin/templates/internal/")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Status: {response.status_code}")
            print(f"   📋 Returned {len(data)} internal templates")
            if data:
                print(f"   🔍 Sample: {data[0]['name']} (slug: {data[0]['slug']})")
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   📄 Response: {response.content.decode()}")
    except Exception as e:
        print(f"   💥 Error: {e}")
    
    # Test non-staff user access
    print("\n3. Testing non-staff access control")
    regular_user = User.objects.filter(is_staff=False).first()
    if not regular_user:
        regular_user = User.objects.create_user(
            username="regulartest",
            email="regular@test.com",
            password="testpass123",
            is_staff=False
        )
    
    client.force_login(regular_user)
    response = client.get("/api/admin/templates/site/")
    if response.status_code == 403:
        print("   ✅ Non-staff user correctly blocked (403)")
    else:
        print(f"   ❌ Non-staff user got {response.status_code}, should be 403")
    
    print("\n🎉 Template Lab API testing complete!")
    print("\nNext step: Test the frontend at http://localhost:3000/admin/jcw/templates")

except Exception as e:
    print(f"❌ Setup Error: {e}")
    print(f"Make sure you're running this from the backend directory")
    sys.exit(1)