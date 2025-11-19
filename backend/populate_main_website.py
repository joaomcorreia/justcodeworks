#!/usr/bin/env python
"""
Create initial Main Website pages and navigation items for the JCW HQ site.
"""
import os
import sys
import django
from django.conf import settings

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainPage, MainNavigationItem, MainSiteSettings

def main():
    print("🏗️ POPULATING MAIN WEBSITE CONTENT")
    print("=" * 50)
    
    # Create main site settings if not exists
    settings_obj, created = MainSiteSettings.objects.get_or_create(
        id=1,
        defaults={
            'site_name': 'Just Code Works',
            'hero_title': 'Everything you need to get your business online.',
            'hero_subtitle': 'Launch a modern website, order your print materials, connect simple POS tools and let your AI assistant do the heavy lifting – all from one place.',
            'is_live': True
        }
    )
    
    if created:
        print("✅ Created Main Website Settings")
    else:
        print("ℹ️  Main Website Settings already exist")
    
    # Define main website pages
    main_pages = [
        {
            'slug': 'home',
            'path': '/',
            'title': 'Home',
            'locale': 'en',
            'order': 1,
            'meta_title': 'Just Code Works - Everything you need to get online',
            'meta_description': 'Launch websites, order prints, connect POS tools with AI assistance. Perfect for small businesses, freelancers and local shops.',
        },
        {
            'slug': 'websites', 
            'path': '/websites',
            'title': 'Websites',
            'locale': 'en',
            'order': 2,
            'meta_title': 'Website Builder - Just Code Works',
            'meta_description': 'Create beautiful websites with our easy-to-use builder. Choose from templates or let AI build it for you.',
        },
        {
            'slug': 'pos-systems',
            'path': '/pos-systems', 
            'title': 'POS Systems',
            'locale': 'en',
            'order': 3,
            'meta_title': 'POS Systems - Just Code Works',
            'meta_description': 'Simple point-of-sale solutions for small businesses. Easy setup, powerful features.',
        },
        {
            'slug': 'services',
            'path': '/services',
            'title': 'Services', 
            'locale': 'en',
            'order': 4,
            'meta_title': 'Business Services - Just Code Works',
            'meta_description': 'Complete business solutions including web development, design, and consulting services.',
        },
        {
            'slug': 'help-center',
            'path': '/help-center',
            'title': 'Help Center',
            'locale': 'en', 
            'order': 5,
            'meta_title': 'Help Center - Just Code Works',
            'meta_description': 'Get help with your website, printing, or POS system. Tutorials, guides and support.',
        },
        {
            'slug': 'print-lab',
            'path': '/print-lab',
            'title': 'Print Lab',
            'locale': 'en',
            'order': 6,
            'meta_title': 'Print Lab - Just Code Works',
            'meta_description': 'Professional printing services. Business cards, flyers, brochures and more.',
        },
    ]
    
    created_pages = []
    
    # Create pages
    for page_data in main_pages:
        page, created = MainPage.objects.get_or_create(
            slug=page_data['slug'],
            locale=page_data['locale'],
            defaults=page_data
        )
        
        if created:
            created_pages.append(page)
            print(f"✅ Created page: {page.slug} ({page.locale})")
        else:
            print(f"ℹ️  Page already exists: {page.slug} ({page.locale})")
    
    # Define header navigation items
    header_nav_items = [
        {
            'label': 'Home',
            'location': 'header',
            'locale': 'en',
            'order': 1,
            'page': MainPage.objects.filter(slug='home', locale='en').first(),
        },
        {
            'label': 'Websites',
            'location': 'header',
            'locale': 'en', 
            'order': 2,
            'page': MainPage.objects.filter(slug='websites', locale='en').first(),
        },
        {
            'label': 'POS Systems',
            'location': 'header',
            'locale': 'en',
            'order': 3,
            'page': MainPage.objects.filter(slug='pos-systems', locale='en').first(),
        },
        {
            'label': 'Services',
            'location': 'header',
            'locale': 'en',
            'order': 4,
            'page': MainPage.objects.filter(slug='services', locale='en').first(),
        },
        {
            'label': 'Help Center',
            'location': 'header',
            'locale': 'en',
            'order': 5,
            'page': MainPage.objects.filter(slug='help-center', locale='en').first(),
        },
        {
            'label': 'Print Lab',
            'location': 'header',
            'locale': 'en',
            'order': 6,
            'page': MainPage.objects.filter(slug='print-lab', locale='en').first(),
        },
    ]
    
    # Define footer navigation items  
    footer_nav_items = [
        # Column 1 - Company
        {
            'label': 'About Us',
            'location': 'footer',
            'locale': 'en',
            'column': 1,
            'order': 1,
            'url': '/about',
        },
        {
            'label': 'Contact',
            'location': 'footer',
            'locale': 'en',
            'column': 1,
            'order': 2,
            'url': '/contact',
        },
        {
            'label': 'Careers',
            'location': 'footer',
            'locale': 'en',
            'column': 1,
            'order': 3,
            'url': '/careers',
        },
        
        # Column 2 - Products
        {
            'label': 'Website Builder',
            'location': 'footer',
            'locale': 'en',
            'column': 2,
            'order': 1,
            'page': MainPage.objects.filter(slug='websites', locale='en').first(),
        },
        {
            'label': 'POS Systems',
            'location': 'footer', 
            'locale': 'en',
            'column': 2,
            'order': 2,
            'page': MainPage.objects.filter(slug='pos-systems', locale='en').first(),
        },
        {
            'label': 'Print Lab',
            'location': 'footer',
            'locale': 'en',
            'column': 2,
            'order': 3,
            'page': MainPage.objects.filter(slug='print-lab', locale='en').first(),
        },
        
        # Column 3 - Support
        {
            'label': 'Help Center',
            'location': 'footer',
            'locale': 'en',
            'column': 3,
            'order': 1,
            'page': MainPage.objects.filter(slug='help-center', locale='en').first(),
        },
        {
            'label': 'Documentation',
            'location': 'footer',
            'locale': 'en',
            'column': 3,
            'order': 2,
            'url': '/docs',
        },
        {
            'label': 'Community',
            'location': 'footer',
            'locale': 'en',
            'column': 3,
            'order': 3,
            'url': '/community',
        },
    ]
    
    created_nav_items = []
    
    # Create navigation items
    all_nav_items = header_nav_items + footer_nav_items
    
    for nav_data in all_nav_items:
        # Create unique identifier for get_or_create
        nav_item, created = MainNavigationItem.objects.get_or_create(
            label=nav_data['label'],
            location=nav_data['location'],
            locale=nav_data['locale'],
            defaults=nav_data
        )
        
        if created:
            created_nav_items.append(nav_item)
            print(f"✅ Created nav item: {nav_item.location} - {nav_item.label}")
        else:
            print(f"ℹ️  Nav item already exists: {nav_item.location} - {nav_item.label}")
    
    print(f"\n📊 SUMMARY:")
    print(f"   📄 Pages created: {len(created_pages)}")
    print(f"   🧭 Navigation items created: {len(created_nav_items)}")
    print(f"   🏠 Total main pages: {MainPage.objects.count()}")
    print(f"   📱 Total nav items: {MainNavigationItem.objects.count()}")
    
    print(f"\n🌐 ADMIN ACCESS:")
    print(f"   Main Website Settings: http://127.0.0.1:8000/admin/main_site/mainsitesettings/")
    print(f"   Main Website Pages: http://127.0.0.1:8000/admin/main_site/mainpage/")
    print(f"   Main Website Navigation: http://127.0.0.1:8000/admin/main_site/mainnavigationitem/")
    
    print(f"\n✅ Main Website content populated successfully!")

if __name__ == "__main__":
    main()