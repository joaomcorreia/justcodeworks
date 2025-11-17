#!/usr/bin/env python
"""
Test admin templates API endpoint
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('C:/projects/justcodeworks/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.test import Client
from sites.models import SiteTemplate

def test_admin_templates_api():
    print("🔍 Testing Admin Templates API...")
    
    # Create test user if needed
    user, created = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True}
    )
    if created:
        user.set_password('admin123')
        user.save()
        print(f"✅ Created admin user: {user.username}")
    else:
        print(f"✅ Using existing admin user: {user.username}")
    
    # Test API endpoint
    client = Client()
    client.force_login(user)
    
    response = client.get('/api/admin/templates/')
    print(f"📡 API Response Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"📋 Found {len(data)} templates")
        
        if data:
            template = data[0]
            print(f"\n🎨 First template:")
            print(f"   - Key: {template.get('key')}")
            print(f"   - Name: {template.get('name')}")
            print(f"   - Category: {template.get('category')}")
            print(f"   - Status: {template.get('status')}")
            print(f"   - Site Count: {template.get('site_count')}")
            print(f"   - Preview Image: {template.get('preview_image')}")
            print(f"   - Created At: {template.get('created_at')}")
            print(f"   - Updated At: {template.get('updated_at')}")
        
        print(f"\n🔢 Template breakdown:")
        for template in data:
            status = template.get('status', 'unknown')
            category = template.get('category', 'uncategorized')
            preview = '🖼️' if template.get('preview_image') else '❌'
            print(f"   {preview} {template.get('key')} ({status}) - {category}")
            
    else:
        print(f"❌ API Error: {response.content.decode()}")
    
    # Test template count in database
    total_templates = SiteTemplate.objects.count()
    published_templates = SiteTemplate.objects.filter(status='published').count()
    
    print(f"\n📊 Database Stats:")
    print(f"   - Total templates: {total_templates}")
    print(f"   - Published: {published_templates}")
    print(f"   - Draft: {total_templates - published_templates}")

if __name__ == "__main__":
    test_admin_templates_api()