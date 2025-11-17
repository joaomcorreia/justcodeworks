#!/usr/bin/env python3
"""
[TEMPLAB] Quick test to verify the template preview API is working.
"""

import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate
from sites.serializers import AdminSiteTemplateSerializer

def test_preview_api():
    """Test that templates have preview images and serializer works."""
    
    print("🧪 Testing Template Preview API...")
    print("=" * 50)
    
    # Check database directly
    templates_with_preview = SiteTemplate.objects.exclude(preview_image_url='')
    print(f"\n📊 Templates with preview URLs: {templates_with_preview.count()}")
    
    for template in templates_with_preview:
        print(f"   ✅ {template.key}: {template.preview_image_url}")
    
    # Test serializer
    print(f"\n🔧 Testing AdminSiteTemplateSerializer...")
    
    template = SiteTemplate.objects.filter(key='restaurant-modern').first()
    if template:
        serializer = AdminSiteTemplateSerializer(template)
        data = serializer.data
        
        print(f"   Template: {data['name']}")
        print(f"   Preview Image: {data.get('preview_image', 'None')}")
        
        if data.get('preview_image'):
            print(f"   ✅ Serializer correctly returns preview_image")
        else:
            print(f"   ❌ Serializer missing preview_image")
    
    print("\n🎯 Test complete!")

if __name__ == "__main__":
    test_preview_api()