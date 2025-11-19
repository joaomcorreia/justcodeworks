#!/usr/bin/env python
"""
Check current main website content structure and language support
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainPage, MainSection, MainField


def check_content_languages():
    """Check what language content exists for main website"""
    
    print("🔍 Checking main website content language support...")
    
    # Check pages by locale
    print("\n📄 Pages by locale:")
    for locale in ['en', 'pt', 'nl']:
        pages = MainPage.objects.filter(locale=locale)
        locale_name = {'en': 'English', 'pt': 'Portuguese', 'nl': 'Dutch'}[locale]
        print(f"   • {locale_name} ({locale}): {pages.count()} pages")
        
        if pages.exists():
            for page in pages.order_by('slug'):
                sections = page.sections.all()
                total_fields = MainField.objects.filter(section__page=page).count()
                print(f"     - {page.title} ({page.slug}): {sections.count()} sections, {total_fields} fields")
    
    # Check sections - they might not be locale-aware
    print(f"\n📂 Total sections: {MainSection.objects.count()}")
    
    # Sample a few sections to see their structure
    sample_sections = MainSection.objects.all()[:5]
    for section in sample_sections:
        fields_count = section.fields.count()
        print(f"   • Section {section.identifier} (Page: {section.page.title}): {fields_count} fields")
        
        # Sample a few fields
        sample_fields = section.fields.all()[:3]
        for field in sample_fields:
            value_preview = field.value[:50] + "..." if len(field.value) > 50 else field.value
            print(f"     - {field.key}: {value_preview}")
    
    # Check if sections have locale info
    first_section = MainSection.objects.first()
    if first_section:
        section_fields = [f.name for f in MainSection._meta.fields]
        print(f"\n🔧 Section model fields: {', '.join(section_fields)}")
        
        field_fields = [f.name for f in MainField._meta.fields]  
        print(f"🔧 Field model fields: {', '.join(field_fields)}")
        
        # Check if locale is in the model
        if 'locale' in section_fields or 'locale' in field_fields:
            print("✅ Models appear to support localization")
        else:
            print("❌ Models do NOT appear to support localization")
            print("   This means all content is shared across languages")
    
    return sample_sections.count()


if __name__ == '__main__':
    check_content_languages()