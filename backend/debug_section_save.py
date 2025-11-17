#!/usr/bin/env python
"""
Debug script for section save functionality.
Tests the API endpoint that the builder uses.
"""
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import Section

def test_section_save():
    """Test section content save API"""
    print("=" * 50)
    print("DEBUGGING SECTION SAVE FUNCTIONALITY")
    print("=" * 50)
    
    # 1. Find a test user and section
    users = User.objects.all()[:5]
    print(f"Available users: {list(users)}")
    
    sections = Section.objects.select_related('page', 'page__project', 'page__project__owner').all()[:10]
    print(f"\nAvailable sections: {len(sections)}")
    
    for section in sections:
        project_owner = section.page.project.owner if section.page and section.page.project else "NO OWNER"
        print(f"  Section {section.id}: {section.identifier} - Owner: {project_owner} - Fields: {section.fields.count()}")
    
    if not sections:
        print("ERROR: No sections found!")
        return
    
    # Find a section owned by mary_restaurant (known password)
    mary_sections = [s for s in sections if s.page.project.owner.username == 'mary_restaurant']
    if mary_sections:
        test_section = mary_sections[0]
        print(f"\nUsing section owned by mary_restaurant: {test_section.id}")
    else:
        test_section = sections[0]
        print(f"\nNo mary_restaurant sections, using: {test_section.id}")
    section_owner = test_section.page.project.owner
    
    print(f"\nTesting with Section ID: {test_section.id}")
    print(f"Section Identifier: {test_section.identifier}")
    print(f"Owner: {section_owner}")
    print(f"Fields: {test_section.fields.count()}")
    
    # Show fields
    for field in test_section.fields.all():
        print(f"  - {field.key}: '{field.value}' (order: {field.order})")
    
    # 2. Test login to get token
    print(f"\n2. Testing login for user: {section_owner.username}")
    
    # Use known password for mary_restaurant
    if section_owner.username == 'mary_restaurant':
        password = 'mary123'
    else:
        password = 'testpass123'
        
    login_data = {
        'username': section_owner.username,
        'password': password
    }
    
    try:
        login_response = requests.post('http://127.0.0.1:8000/api/auth/login/', json=login_data)
        print(f"Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get('access_token')
            print(f"Access token: {'YES' if access_token else 'NO'}")
        else:
            print(f"Login failed: {login_response.text}")
            print("Try creating test user with known password...")
            return
            
    except Exception as e:
        print(f"Login request failed: {e}")
        return
    
    # 3. Test section update
    print(f"\n3. Testing section update API")
    
    # Prepare payload
    fields_data = []
    for field in test_section.fields.all()[:3]:  # Test with first 3 fields
        fields_data.append({
            'key': field.key,
            'value': f"UPDATED_{field.value}_TEST"
        })
    
    update_payload = {
        'fields': fields_data
    }
    
    print(f"Update payload: {json.dumps(update_payload, indent=2)}")
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        update_response = requests.patch(
            f'http://127.0.0.1:8000/api/sections/{test_section.id}/content/',
            json=update_payload,
            headers=headers
        )
        
        print(f"Update status: {update_response.status_code}")
        print(f"Update response: {update_response.text}")
        
        if update_response.status_code == 200:
            print("✅ Section update SUCCESS!")
            
            # Verify fields were updated
            test_section.refresh_from_db()
            print("\nVerifying updated fields:")
            for field in test_section.fields.all():
                print(f"  - {field.key}: '{field.value}'")
                
        else:
            print("❌ Section update FAILED!")
            
    except Exception as e:
        print(f"Update request failed: {e}")
    
    print("\n" + "=" * 50)

if __name__ == '__main__':
    test_section_save()