#!/usr/bin/env python
"""
Check if Portuguese pages exist for the main website
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainPage


def check_portuguese_pages():
    """Check if Portuguese pages exist for main website"""
    
    print("🇵🇹 Checking Portuguese pages for main website...")
    
    # Get all pages by locale
    en_pages = MainPage.objects.filter(locale='en').order_by('slug')
    pt_pages = MainPage.objects.filter(locale='pt').order_by('slug')
    
    print(f"📊 Page counts:")
    print(f"   • English (en): {en_pages.count()} pages")
    print(f"   • Portuguese (pt): {pt_pages.count()} pages")
    
    if en_pages.count() == 0:
        print("❌ No English pages found!")
        return "no_pages"
    
    if pt_pages.count() == 0:
        print(f"\n⚠️  No Portuguese pages found!")
        print(f"   English pages that need Portuguese translations:")
        for page in en_pages:
            print(f"     - {page.title} ({page.slug})")
        return "missing_all_portuguese"
    
    # Check which English pages have Portuguese equivalents
    en_slugs = set(en_pages.values_list('slug', flat=True))
    pt_slugs = set(pt_pages.values_list('slug', flat=True))
    
    missing_pt = en_slugs - pt_slugs
    extra_pt = pt_slugs - en_slugs
    
    print(f"\n📋 English pages:")
    for page in en_pages:
        has_pt = page.slug in pt_slugs
        status = "✅" if has_pt else "❌"
        print(f"   {status} {page.title} ({page.slug})")
    
    if pt_pages.count() > 0:
        print(f"\n📋 Portuguese pages:")
        for page in pt_pages:
            print(f"   ✅ {page.title} ({page.slug})")
    
    if missing_pt:
        print(f"\n⚠️  Missing Portuguese translations for:")
        for slug in missing_pt:
            en_page = en_pages.get(slug=slug)
            print(f"   - {en_page.title} ({slug})")
        return "missing_some_portuguese"
    
    if en_pages.count() == pt_pages.count() and not extra_pt:
        print(f"\n✅ Perfect! All pages have Portuguese translations")
        return "balanced"
    else:
        print(f"\n⚠️  Page structure mismatch")
        return "unbalanced"


if __name__ == '__main__':
    status = check_portuguese_pages()
    print(f"\n🎯 Status: {status}")