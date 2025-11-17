#!/usr/bin/env python3
"""
Quick check to see what templates are available in the database
"""

import os
import sys
import django

# Add the backend directory to Python path
backend_path = 'C:\\projects\\justcodeworks\\backend'
if backend_path not in sys.path:
    sys.path.append(backend_path)

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate

def check_templates():
    """Check available templates in the database."""
    
    print("🔍 Checking available site templates...")
    print("=" * 50)
    
    templates = SiteTemplate.objects.all()
    
    if not templates.exists():
        print("❌ No templates found in database")
        return False
    
    print(f"📋 Found {templates.count()} templates:")
    print()
    
    for template in templates:
        status_emoji = "✅" if template.is_active and template.is_user_selectable else "❌"
        print(f"{status_emoji} {template.key}")
        print(f"   Name: {template.name}")
        print(f"   Active: {template.is_active}")
        print(f"   User Selectable: {template.is_user_selectable}")
        print(f"   Status: {template.status}")
        print()
    
    # Check specifically for the templates our builder tries to use
    template_keys = ['jcw-main', 'restaurant-modern', 'professional-clean', 'portfolio-basic', 'ecommerce-simple', 'business-pro']
    
    print("🎯 Builder Template Availability:")
    print("-" * 30)
    
    for key in template_keys:
        template = templates.filter(key=key, is_active=True, is_user_selectable=True, status="published").first()
        if template:
            print(f"✅ {key}: Available")
        else:
            print(f"❌ {key}: Not available")
    
    return True

if __name__ == "__main__":
    try:
        check_templates()
    except Exception as e:
        print(f"💥 Error: {str(e)}")
        import traceback
        traceback.print_exc()