#!/usr/bin/env python
"""
Update Portuguese navigation items to point to Portuguese pages
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainNavigationItem, MainPage
from django.db import transaction


def update_portuguese_navigation():
    """Update Portuguese navigation items to use Portuguese pages"""
    
    print("🔗 Updating Portuguese navigation items to use Portuguese pages...")
    
    with transaction.atomic():
        # Get all Portuguese navigation items that link to pages
        pt_nav_items = MainNavigationItem.objects.filter(
            locale='pt',
            page__isnull=False
        )
        
        print(f"📋 Found {pt_nav_items.count()} Portuguese navigation items with page links")
        
        updated_count = 0
        
        for pt_nav in pt_nav_items:
            # Find the corresponding Portuguese page
            try:
                pt_page = MainPage.objects.get(
                    slug=pt_nav.page.slug,
                    locale='pt'
                )
                
                # Update the navigation item to point to the Portuguese page
                old_page_title = pt_nav.page.title if pt_nav.page else "None"
                pt_nav.page = pt_page
                pt_nav.save()
                
                print(f"  ✅ Updated {pt_nav.label}: {old_page_title} → {pt_page.title}")
                updated_count += 1
                
            except MainPage.DoesNotExist:
                print(f"  ⚠️  Portuguese page not found for {pt_nav.label} (slug: {pt_nav.page.slug})")
        
        print(f"\n🎉 Successfully updated {updated_count} Portuguese navigation items!")
        
        return updated_count


def verify_navigation_structure():
    """Verify the final navigation structure"""
    
    print("\n🔍 Verifying final navigation structure...")
    
    for locale in ['en', 'pt']:
        locale_name = "English" if locale == "en" else "Portuguese"
        nav_items = MainNavigationItem.objects.filter(locale=locale).order_by('location', 'order')
        
        print(f"\n🌐 {locale_name} ({locale}) navigation:")
        
        for location in ['header', 'footer']:
            location_items = nav_items.filter(location=location)
            if location_items.exists():
                print(f"  📍 {location.title()}:")
                for item in location_items:
                    page_info = f"→ {item.page.title} ({item.page.locale})" if item.page else f"→ {item.url}"
                    print(f"    • {item.label} {page_info}")


if __name__ == '__main__':
    updated_count = update_portuguese_navigation()
    verify_navigation_structure()
    print(f"\n🎯 Updated {updated_count} navigation items successfully!")