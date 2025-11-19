#!/usr/bin/env python
"""
Check current navigation items and their language support
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainNavigationItem


def check_navigation_languages():
    """Check current navigation items and their language support"""
    
    print("🔍 Checking Main Website Navigation Items...")
    
    # Get all navigation items
    nav_items = MainNavigationItem.objects.all().order_by('order', 'locale')
    
    print(f"📊 Found {nav_items.count()} navigation items total")
    
    # Group by locale
    locales = {}
    for item in nav_items:
        if item.locale not in locales:
            locales[item.locale] = []
        locales[item.locale].append(item)
    
    print(f"\n🌐 Navigation items by language:")
    for locale, items in locales.items():
        locale_name = "English" if locale == "en" else "Portuguese" if locale == "pt" else locale
        print(f"   • {locale_name} ({locale}): {len(items)} items")
        
        for item in items:
            url_display = item.url if item.url else f"page:{item.page.slug if item.page else 'none'}"
            print(f"     - {item.label} ({url_display}) - Order: {item.order}")
    
    # Check if we have balanced languages
    if 'en' in locales and 'pt' not in locales:
        print(f"\n⚠️  Missing Portuguese translations!")
        print(f"   You have {len(locales['en'])} English items but 0 Portuguese items")
        return "missing_portuguese"
    elif 'pt' in locales and 'en' not in locales:
        print(f"\n⚠️  Missing English translations!")
        print(f"   You have {len(locales['pt'])} Portuguese items but 0 English items")
        return "missing_english"
    elif 'en' in locales and 'pt' in locales:
        en_count = len(locales['en'])
        pt_count = len(locales['pt'])
        if en_count != pt_count:
            print(f"\n⚠️  Unbalanced translations!")
            print(f"   English: {en_count} items, Portuguese: {pt_count} items")
            return "unbalanced"
        else:
            print(f"\n✅ Balanced navigation: {en_count} items in both languages")
            return "balanced"
    else:
        print(f"\n❌ No navigation items found in en or pt locales")
        return "no_standard_locales"


if __name__ == '__main__':
    status = check_navigation_languages()
    print(f"\n🎯 Status: {status}")