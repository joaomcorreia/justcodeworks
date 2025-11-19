#!/usr/bin/env python
"""
Check the status of main website fields and populate if needed
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainField, MainSection, MainPage
from sites.models import Field


def check_main_website_fields():
    """Check main website fields status and populate if needed"""
    
    print("🔍 Checking main website fields status...")
    
    # Check MainField count
    main_fields_count = MainField.objects.count()
    main_sections_count = MainSection.objects.count()
    main_pages_count = MainPage.objects.count()
    
    print(f"📊 Current main website content:")
    print(f"   • Pages: {main_pages_count}")
    print(f"   • Sections: {main_sections_count}")
    print(f"   • Fields: {main_fields_count}")
    
    # Check tenant sites fields (what might have been accidentally deleted)
    tenant_fields_count = Field.objects.count()
    print(f"   • Tenant fields remaining: {tenant_fields_count}")
    
    if main_fields_count == 0:
        print("\n⚠️  No main website fields found!")
        print("📝 This suggests the main website fields might need to be recreated.")
        
        if main_pages_count > 0:
            print(f"✅ Found {main_pages_count} main pages - structure exists")
            if main_sections_count > 0:
                print(f"✅ Found {main_sections_count} sections - ready for field creation")
                return "need_fields"
            else:
                print("❌ No sections found - need to create sections first")
                return "need_sections_and_fields"
        else:
            print("❌ No main pages found - need full structure")
            return "need_everything"
    else:
        print(f"✅ Found {main_fields_count} main website fields")
        
        # Show breakdown by page
        for page in MainPage.objects.all():
            page_sections = page.sections.count()
            page_fields = MainField.objects.filter(section__page=page).count()
            print(f"   📄 {page.title}: {page_sections} sections, {page_fields} fields")
        
        return "all_good"


if __name__ == '__main__':
    status = check_main_website_fields()
    print(f"\n🎯 Status: {status}")