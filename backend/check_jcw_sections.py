#!/usr/bin/env python3
"""
Check the sections created for Just Code Works project
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section

def check_jcw_sections():
    print("🔍 CHECKING JUST CODE WORKS SECTIONS")
    print("==================================================")
    
    # Note: The 'just-code-works' tenant site has been removed
    # jcw-main is now the platform template, not a separate tenant
    print("ℹ️  The 'just-code-works' tenant site has been removed.")
    print("    jcw-main is now the platform template used by the main site at /[locale]")
    print("    Use other tenant sites for testing (e.g., marys-restaurant, oficina-paulo-calibra)")
    return

    # Get home page
    try:
        home_page = jcw_project.pages.get(slug='home')
        print(f"\n📄 Home Page: {home_page.title}")
        print(f"   ID: {home_page.id}")
        
        # Get sections
        sections = home_page.sections.all().order_by('order')
        print(f"\n📋 Sections ({sections.count()}):")
        
        for section in sections:
            fields_count = section.fields.count()
            print(f"   • {section.internal_name}")
            print(f"     ID: {section.id} | Identifier: {section.identifier}")
            print(f"     Order: {section.order} | Fields: {fields_count}")
            
            # Show recent AI sections (those with ai- prefix)
            if section.identifier.startswith('ai-'):
                print("     🤖 AI-GENERATED SECTION")
                for field in section.fields.all()[:3]:  # Show first 3 fields
                    value_preview = field.value[:50] + "..." if len(field.value) > 50 else field.value
                    print(f"       - {field.key}: {value_preview}")
            print()
            
    except Page.DoesNotExist:
        print("❌ Home page not found")
        return

    print("\n🎯 ALTERNATIVE PREVIEW OPTIONS:")
    print("1. Mary's Restaurant: http://localhost:8000/sites/marys-restaurant/")
    print("2. Paulo's Garage: http://localhost:8000/sites/oficina-paulo-calibra/")
    print("3. Admin Backend: http://localhost:8000/admin/sites/section/")

if __name__ == "__main__":
    check_jcw_sections()