#!/usr/bin/env python3
"""
Test Script: Check Image URLs
Check what URLs are being returned for uploaded images
"""

import os
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SectionDraft
from sites.serializers import SectionDraftSerializer

def test_image_urls():
    """Test image URL generation in serializer"""
    
    print("🔍 Testing Image URLs...")
    
    # Get recent uploads
    recent_drafts = SectionDraft.objects.order_by('-created_at')[:3]
    
    if not recent_drafts:
        print("❌ No uploads found to test")
        return
    
    print(f"\nFound {recent_drafts.count()} recent uploads:")
    
    for draft in recent_drafts:
        print(f"\n📄 Draft: {draft.section_name}")
        print(f"   File path: {draft.image.name}")
        print(f"   Django URL: {draft.image.url}")
        
        # Test serializer without request context
        serializer_no_context = SectionDraftSerializer(draft)
        print(f"   Serializer (no context): {serializer_no_context.data.get('image_url')}")
        
        # Test serializer with mock request
        class MockRequest:
            def build_absolute_uri(self, path):
                return f"http://localhost:8000{path}"
        
        mock_request = MockRequest()
        serializer_with_context = SectionDraftSerializer(draft, context={'request': mock_request})
        print(f"   Serializer (with context): {serializer_with_context.data.get('image_url')}")
        
        # Test if URL is accessible
        full_url = f"http://localhost:8000{draft.image.url}"
        print(f"   Testing accessibility: {full_url}")
        
        try:
            response = requests.head(full_url, timeout=5)
            print(f"   ✅ Accessible (Status: {response.status_code})")
        except Exception as e:
            print(f"   ❌ Not accessible: {e}")

if __name__ == "__main__":
    test_image_urls()