#!/usr/bin/env python3
"""
[TEMPLAB] Add preview images to templates for auto-scroll demo.

This script adds preview image URLs to our existing templates:
- Mary's Restaurant (restaurant-modern)
- Oficina Paulo Calibra (auto-garage-modern) 
- JCW Main (jcw-main)

For demo purposes, we're using tall placeholder images that simulate 
full website screenshots for the hover scroll effect.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate

def add_preview_images():
    """Add preview image URLs to templates for auto-scroll demo."""
    
    # [TEMPLAB] Template preview image mappings
    # Using tall images that simulate full website screenshots for auto-scroll demo
    preview_mappings = {
        'restaurant-modern': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=2400',  # Restaurant interior, tall
        'auto-garage-modern': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=2200',  # Auto garage, tall
        'jcw-main': 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=2000',  # Modern office, tall
    }
    
    print("🖼️ Adding preview images to templates for auto-scroll demo...")
    print("=" * 60)
    
    updated_count = 0
    
    for template_key, preview_url in preview_mappings.items():
        try:
            template = SiteTemplate.objects.get(key=template_key)
            
            # Check if already has preview_image_url
            if template.preview_image_url:
                print(f"⚠️  {template_key}: Already has preview URL: {template.preview_image_url}")
                continue
            
            # Set the preview image URL for auto-scroll demo
            print(f"✅ {template_key}: Adding preview URL: {preview_url}")
            template.preview_image_url = preview_url
            template.save()
            
            updated_count += 1
            
        except SiteTemplate.DoesNotExist:
            print(f"❌ Template '{template_key}' not found")
            continue
        except Exception as e:
            print(f"❌ Error updating {template_key}: {e}")
            continue
    
    print("=" * 60)
    print(f"✨ Updated {updated_count} templates with preview images")
    
    # Display current status
    print("\n📋 Current template preview status:")
    for template in SiteTemplate.objects.all():
        preview_status = "✅ Has preview URL" if template.preview_image_url else ("✅ Has preview file" if template.preview_image else "❌ No preview")
        print(f"   {template.key}: {preview_status}")

if __name__ == "__main__":
    print("🎨 Template Lab - Preview Image Setup")
    print("This will add demo preview images for auto-scroll functionality\n")
    
    response = input("Continue? (y/N): ").strip().lower()
    if response in ['y', 'yes']:
        add_preview_images()
        print("\n🎉 Done! Templates now have preview images for auto-scroll demo.")
        print("\nNote: In production, upload actual website screenshot files to preview_image field.")
    else:
        print("Cancelled.")