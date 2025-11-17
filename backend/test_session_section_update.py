#!/usr/bin/env python
"""
Test section update with session authentication like frontend does.
"""
import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Section

def test_session_auth_section_update():
    """Test section update with session authentication"""
    print("=" * 60)
    print("TESTING SESSION AUTH SECTION UPDATE")
    print("=" * 60)
    
    # Find a section owned by admin (we know admin password)
    sections = Section.objects.select_related('page', 'page__project', 'page__project__owner').all()
    admin_sections = [s for s in sections if s.page.project.owner.username == 'admin']
    
    if not admin_sections:
        print("❌ No sections owned by admin found!")
        return
    
    test_section = admin_sections[0]
    print(f"Testing with section {test_section.id}: {test_section.identifier}")
    print(f"Owner: {test_section.page.project.owner.username}")
    print(f"Fields: {test_section.fields.count()}")
    
    # Create session for requests
    session = requests.Session()
    
    # 1. Get CSRF token
    print("\n1. Getting CSRF token...")
    csrf_response = session.get('http://127.0.0.1:8000/api/csrf/')
    print(f"CSRF request: {csrf_response.status_code}")
    
    if csrf_response.status_code != 200:
        print("❌ Failed to get CSRF token")
        return
    
    # Extract CSRF token from cookies
    csrf_token = None
    for cookie in session.cookies:
        if cookie.name == 'csrftoken':
            csrf_token = cookie.value
            break
    
    print(f"CSRF token: {'YES' if csrf_token else 'NO'}")
    
    # 2. Login with session
    print("\n2. Logging in with session...")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    if csrf_token:
        headers['x-csrftoken'] = csrf_token
    
    login_response = session.post(
        'http://127.0.0.1:8000/api/auth/login/',
        json=login_data,
        headers=headers
    )
    
    print(f"Login status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.text}")
        return
    
    print("✅ Login successful")
    
    # 3. Test section update
    print("\n3. Testing section content update...")
    
    # Build test payload
    fields_data = []
    for field in test_section.fields.all()[:2]:  # Test first 2 fields
        fields_data.append({
            'key': field.key,
            'value': f"UPDATED_{field.value}_SESSION_TEST"
        })
    
    update_payload = {
        'fields': fields_data
    }
    
    print(f"Update payload: {update_payload}")
    
    # Make update request with session cookies
    update_headers = {'Content-Type': 'application/json'}
    if csrf_token:
        update_headers['x-csrftoken'] = csrf_token
    
    update_response = session.patch(
        f'http://127.0.0.1:8000/api/sections/{test_section.id}/content/',
        json=update_payload,
        headers=update_headers
    )
    
    print(f"Update status: {update_response.status_code}")
    print(f"Update response: {update_response.text}")
    
    if update_response.status_code == 200:
        print("✅ Section update SUCCESS with session auth!")
        
        # Verify the update worked
        test_section.refresh_from_db()
        print("\nVerifying updated fields:")
        for field in test_section.fields.all():
            print(f"  - {field.key}: '{field.value}'")
            
    else:
        print("❌ Section update FAILED!")
        
    print("\n" + "=" * 60)

if __name__ == '__main__':
    test_session_auth_section_update()