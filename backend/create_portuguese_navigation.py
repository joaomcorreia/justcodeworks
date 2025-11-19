#!/usr/bin/env python
"""
Create Portuguese navigation items to match the English ones
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainNavigationItem, MainPage
from django.db import transaction


def create_portuguese_navigation():
    """Create Portuguese navigation items matching the English structure"""
    
    print("🇵🇹 Creating Portuguese navigation items...")
    
    # Portuguese translations mapping
    translations = {
        'Home': 'Início',
        'Website Builder': 'Criador de Sites',
        'Websites': 'Sites',
        'POS Systems': 'Sistemas POS', 
        'Services': 'Serviços',
        'Print Lab': 'Laboratório de Impressão',
        'Help Center': 'Centro de Ajuda',
        'Documentation': 'Documentação'
    }
    
    with transaction.atomic():
        # Get all English navigation items
        english_nav_items = MainNavigationItem.objects.filter(locale='en').order_by('location', 'order')
        
        print(f"📋 Found {english_nav_items.count()} English navigation items to translate")
        
        created_count = 0
        
        for en_item in english_nav_items:
            # Skip if Portuguese version already exists
            pt_exists = MainNavigationItem.objects.filter(
                locale='pt',
                location=en_item.location,
                order=en_item.order,
                column=en_item.column
            ).exists()
            
            if pt_exists:
                print(f"  ⏭️  Skipping {en_item.label} - Portuguese version already exists")
                continue
            
            # Translate the label
            pt_label = translations.get(en_item.label, en_item.label)
            
            # Get the corresponding Portuguese page if it exists
            pt_page = None
            if en_item.page:
                try:
                    pt_page = MainPage.objects.get(slug=en_item.page.slug, locale='pt')
                except MainPage.DoesNotExist:
                    # Use the English page as fallback
                    pt_page = en_item.page
                    print(f"  ⚠️  Using English page for {en_item.label} - Portuguese page not found")
            
            # Create Portuguese navigation item
            pt_nav_item = MainNavigationItem.objects.create(
                locale='pt',
                location=en_item.location,
                column=en_item.column,
                label=pt_label,
                page=pt_page,
                url=en_item.url,
                is_external=en_item.is_external,
                order=en_item.order,
                parent=None  # Handle parent relationships separately if needed
            )
            
            print(f"  ✅ Created: {pt_label} ({en_item.location}) - Order: {en_item.order}")
            created_count += 1
        
        print(f"\n🎉 Successfully created {created_count} Portuguese navigation items!")
        
        # Verify the result
        pt_nav_count = MainNavigationItem.objects.filter(locale='pt').count()
        en_nav_count = MainNavigationItem.objects.filter(locale='en').count()
        
        print(f"\n📊 Final navigation item counts:")
        print(f"   • English (en): {en_nav_count} items")
        print(f"   • Portuguese (pt): {pt_nav_count} items")
        
        if en_nav_count == pt_nav_count:
            print(f"✅ Perfect! Navigation is now balanced in both languages")
            return "balanced"
        else:
            print(f"⚠️  Still unbalanced: EN={en_nav_count}, PT={pt_nav_count}")
            return "unbalanced"


if __name__ == '__main__':
    result = create_portuguese_navigation()
    print(f"\n🎯 Result: {result}")