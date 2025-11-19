#!/usr/bin/env python
"""
Create Dutch navigation items and pages to complete multilingual support
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainNavigationItem, MainPage
from django.db import transaction


def create_dutch_navigation_and_pages():
    """Create Dutch navigation items and pages matching the English structure"""
    
    print("🇳🇱 Creating Dutch navigation items and pages...")
    
    # Dutch translations mapping
    nav_translations = {
        'Home': 'Home',
        'Website Builder': 'Website Bouwer', 
        'Websites': 'Websites',
        'POS Systems': 'POS Systemen',
        'Services': 'Diensten',
        'Print Lab': 'Print Lab',
        'Help Center': 'Helpcentrum',
        'Documentation': 'Documentatie'
    }
    
    page_translations = {
        'Home': 'Home',
        'Websites': 'Websites', 
        'POS Systems': 'POS Systemen',
        'Services': 'Diensten',
        'Print Lab': 'Print Lab',
        'Help Center': 'Helpcentrum'
    }
    
    # Dutch meta descriptions
    meta_descriptions = {
        'home': 'JustCodeWorks - Professionele website ontwikkeling, POS systemen en printdiensten. Volledige digitale oplossingen voor uw bedrijf.',
        'websites': 'Professionele en aangepaste website ontwikkeling. Moderne templates, responsive design en SEO optimalisatie.',
        'pos-systems': 'Complete POS systemen voor restaurants, winkels en bedrijven. Verkoop-, inventaris- en rapportagebeheer.',
        'services': 'Complete digitale diensten: webontwikkeling, digitale marketing, SEO en technische ondersteuning.',
        'print-lab': 'Professionele printlaboratorium. Visitekaartjes, flyers, banners en promotiemateriaal.',
        'help-center': 'Helpcentrum en technische ondersteuning. Tutorials, FAQ\'s en documentatie voor al onze diensten.'
    }
    
    with transaction.atomic():
        # First create Dutch pages
        print("\n📄 Creating Dutch pages...")
        english_pages = MainPage.objects.filter(locale='en').order_by('slug')
        
        created_pages = 0
        for en_page in english_pages:
            # Skip if Dutch version already exists
            nl_exists = MainPage.objects.filter(slug=en_page.slug, locale='nl').exists()
            if nl_exists:
                print(f"  ⏭️  Skipping page {en_page.title} - Dutch version already exists")
                continue
            
            nl_title = page_translations.get(en_page.title, en_page.title)
            nl_meta_description = meta_descriptions.get(en_page.slug, f"Pagina {nl_title} - JustCodeWorks")
            
            nl_page = MainPage.objects.create(
                slug=en_page.slug,
                title=nl_title,
                locale='nl',
                meta_description=nl_meta_description,
                meta_title=nl_title,
                indexable=en_page.indexable
            )
            
            print(f"  ✅ Created page: {nl_title} ({en_page.slug})")
            created_pages += 1
        
        # Then create Dutch navigation items
        print(f"\n🧭 Creating Dutch navigation items...")
        english_nav_items = MainNavigationItem.objects.filter(locale='en').order_by('location', 'order')
        
        created_nav = 0
        for en_item in english_nav_items:
            # Skip if Dutch version already exists
            nl_exists = MainNavigationItem.objects.filter(
                locale='nl',
                location=en_item.location,
                order=en_item.order,
                column=en_item.column
            ).exists()
            if nl_exists:
                print(f"  ⏭️  Skipping nav {en_item.label} - Dutch version already exists")
                continue
            
            nl_label = nav_translations.get(en_item.label, en_item.label)
            
            # Get corresponding Dutch page
            nl_page = None
            if en_item.page:
                try:
                    nl_page = MainPage.objects.get(slug=en_item.page.slug, locale='nl')
                except MainPage.DoesNotExist:
                    nl_page = en_item.page  # Fallback to English page
                    print(f"  ⚠️  Using English page for {en_item.label}")
            
            nl_nav_item = MainNavigationItem.objects.create(
                locale='nl',
                location=en_item.location,
                column=en_item.column,
                label=nl_label,
                page=nl_page,
                url=en_item.url,
                is_external=en_item.is_external,
                order=en_item.order
            )
            
            print(f"  ✅ Created nav: {nl_label} ({en_item.location}) - Order: {en_item.order}")
            created_nav += 1
        
        # Final verification
        print(f"\n📊 Results:")
        print(f"   • Pages created: {created_pages}")
        print(f"   • Navigation items created: {created_nav}")
        
        # Show counts by locale
        for locale in ['en', 'pt', 'nl']:
            locale_name = {"en": "English", "pt": "Portuguese", "nl": "Dutch"}[locale]
            page_count = MainPage.objects.filter(locale=locale).count()
            nav_count = MainNavigationItem.objects.filter(locale=locale).count()
            print(f"   • {locale_name}: {page_count} pages, {nav_count} nav items")
        
        return created_pages, created_nav


if __name__ == '__main__':
    pages, nav = create_dutch_navigation_and_pages()
    print(f"\n🎉 Dutch localization complete! Created {pages} pages and {nav} navigation items.")