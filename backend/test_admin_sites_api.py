#!/usr/bin/env python3
"""
Test the Admin Sites Explorer API endpoints
"""

import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject
from django.contrib.auth.models import User

def test_admin_site_projects_api():
    print("🏗️ Admin Sites Explorer API Test")
    print("=" * 50)
    
    # Check data exists
    projects = SiteProject.objects.all()
    print(f"\n📊 SiteProjects in database: {projects.count()}")
    for project in projects[:3]:  # Show first 3
        owner_email = project.owner.email if project.owner else "No owner"
        print(f"  • {project.name} ({project.slug}) - {owner_email}")
    
    # Check admin user exists
    admin_users = User.objects.filter(is_staff=True)
    print(f"\n👑 Staff users: {admin_users.count()}")
    if not admin_users.exists():
        print("⚠️ No staff users found. Creating one...")
        admin_user = User.objects.create_user(
            username='testadmin',
            email='admin@test.com',
            password='admin123',
            is_staff=True,
            is_superuser=True
        )
        print(f"✓ Created staff user: {admin_user.email}")
    else:
        admin_user = admin_users.first()
        print(f"✓ Using staff user: {admin_user.email}")
    
    api_base = "http://127.0.0.1:8000/api"
    
    print(f"\n🔑 Testing authentication...")
    # Login as staff user
    try:
        login_response = requests.post(f"{api_base}/auth/login/", json={
            "username": "teststaff",
            "password": "testpass123"
        })
        
        if login_response.status_code == 200:
            headers = {}  # We'll use session auth instead
            print("✓ Login successful (session auth)")
            
            # Get session cookies
            session_cookies = login_response.cookies
            
        else:
            print(f"✗ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to Django server")
        print("Make sure Django is running: python manage.py runserver 8000")
        return
    
    print(f"\n📋 Testing admin site projects list...")
    try:
        response = requests.get(f"{api_base}/admin/site-projects/", cookies=session_cookies)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Admin site projects list: {len(data)} projects")
            
            for project in data[:2]:  # Show first 2
                print(f"  • {project['name']} - {project['owner_email']}")
                print(f"    Slug: {project['slug']}")
                print(f"    Template: {project.get('site_template_name', 'None')}")
                
                # Test detail endpoint
                print(f"\n🔍 Testing detail for project {project['id']}...")
                detail_response = requests.get(
                    f"{api_base}/admin/site-projects/{project['id']}/", 
                    cookies=session_cookies
                )
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    print(f"✓ Detail API works: {detail_data['name']}")
                else:
                    print(f"✗ Detail API failed: {detail_response.status_code}")
                
                break  # Just test one detail
                
        else:
            print(f"✗ Admin site projects failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"✗ Error: {e}")
    
    print(f"\n🎉 Admin Sites Explorer API Test Complete!")
    print(f"   📍 Frontend URL: http://localhost:3005/en/admin/sites")
    print(f"   📍 API Endpoints:")
    print(f"      • GET {api_base}/admin/site-projects/")
    print(f"      • GET {api_base}/admin/site-projects/<id>/")

if __name__ == '__main__':
    test_admin_site_projects_api()