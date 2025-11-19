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
        'Print Lab': 'Print Laboratorium',
        'Help Center': 'Helpcentrum',
        'Documentation': 'Documentatie'
    }
    
    # Dutch page title translations
    page_translations = {
        'Home': 'Home',
        'Websites': 'Websites',
        'POS Systems': 'POS Systemen',
        'Services': 'Diensten',
        'Print Lab': 'Print Laboratorium',
        'Help Center': 'Helpcentrum'
    }
    
    # Meta descriptions in Dutch
    meta_descriptions = {
        'home': 'JustCodeWorks - Professionele website ontwikkeling, POS systemen en print diensten. Volledige digitale oplossingen voor uw bedrijf.',
        'websites': 'Professionele en gepersonaliseerde website ontwikkeling. Moderne templates, responsive design en SEO optimalisatie.',
        'pos-systems': 'Volledige POS systemen voor restaurants, winkels en bedrijven. Verkoop beheer, voorraad en rapportage.',
        'services': 'Volledige digitale diensten: web ontwikkeling, digitale marketing, SEO en technische ondersteuning.',
        'print-lab': 'Professioneel print laboratorium. Visitekaartjes, flyers, banners en promotie materialen.',
        'help-center': 'Helpcentrum en technische ondersteuning. Tutorials, FAQs en documentatie voor al onze diensten.'
    }
    
    with transaction.atomic():
        print("📄 Creating Dutch pages first...")
        
        # Get all English pages
        english_pages = MainPage.objects.filter(locale='en').order_by('slug')
        
        created_pages = 0
        for en_page in english_pages:
            # Skip if Dutch version already exists
            nl_exists = MainPage.objects.filter(slug=en_page.slug, locale='nl').exists()
            
            if nl_exists:
                print(f"  ⏭️  Skipping {en_page.title} page - Dutch version already exists")
                continue
            
            # Translate the title and meta description
            nl_title = page_translations.get(en_page.title, en_page.title)
            nl_meta_description = meta_descriptions.get(en_page.slug, f"Pagina {nl_title} - JustCodeWorks")
            
            # Create Dutch page
            nl_page = MainPage.objects.create(
                slug=en_page.slug,  # Keep the same slug for URL consistency
                title=nl_title,
                locale='nl',
                meta_description=nl_meta_description,
                meta_title=nl_title,  # Use translated title for SEO
                indexable=en_page.indexable
            )
            
            print(f"  ✅ Created page: {nl_title} ({en_page.slug})")
            created_pages += 1
        
        print(f"\n🧭 Creating Dutch navigation items...")
        
        # Get all English navigation items
        english_nav_items = MainNavigationItem.objects.filter(locale='en').order_by('location', 'order')
        
        created_nav = 0
        for en_nav in english_nav_items:
            # Skip if Dutch version already exists
            nl_nav_exists = MainNavigationItem.objects.filter(
                locale='nl',
                location=en_nav.location,
                order=en_nav.order,
                column=en_nav.column
            ).exists()
            
            if nl_nav_exists:
                print(f"  ⏭️  Skipping {en_nav.label} nav - Dutch version already exists")
                continue
            
            # Translate the label
            nl_label = nav_translations.get(en_nav.label, en_nav.label)
            
            # Get the corresponding Dutch page if it exists
            nl_page = None
            if en_nav.page:
                try:
                    nl_page = MainPage.objects.get(slug=en_nav.page.slug, locale='nl')
                except MainPage.DoesNotExist:
                    # Use the English page as fallback
                    nl_page = en_nav.page
                    print(f"    ⚠️  Using English page for {en_nav.label} - Dutch page not found")
            
            # Create Dutch navigation item
            nl_nav_item = MainNavigationItem.objects.create(
                locale='nl',
                location=en_nav.location,
                column=en_nav.column,
                label=nl_label,
                page=nl_page,
                url=en_nav.url,
                is_external=en_nav.is_external,
                order=en_nav.order,
                parent=None  # Handle parent relationships separately if needed
            )
            
            print(f"  ✅ Created nav: {nl_label} ({en_nav.location}) - Order: {en_nav.order}")
            created_nav += 1
        
        print(f"\n🎉 Successfully created {created_pages} Dutch pages and {created_nav} Dutch navigation items!")
        
        # Verify the result
        for locale in ['en', 'pt', 'nl']:
            page_count = MainPage.objects.filter(locale=locale).count()
            nav_count = MainNavigationItem.objects.filter(locale=locale).count()
            locale_name = {'en': 'English', 'pt': 'Portuguese', 'nl': 'Dutch'}[locale]
            print(f"   • {locale_name} ({locale}): {page_count} pages, {nav_count} nav items")
        
        return created_pages, created_nav


if __name__ == '__main__':
    pages, nav_items = create_dutch_navigation_and_pages()
    print(f"\n🎯 Created {pages} pages and {nav_items} navigation items for Dutch!")