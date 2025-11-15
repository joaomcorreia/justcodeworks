#!/usr/bin/env python3
"""Fix the navigation issues by setting proper pages and URLs"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import NavigationItem, Page, SiteProject

# Get the main project
project = SiteProject.objects.get(id="69870a64-4913-4d52-9b35-4d1dfa33632a")
print(f"Working with project: {project.name}")

# Get existing pages
pages = Page.objects.filter(project=project, locale='en')
print(f"\nAvailable pages:")
for page in pages:
    print(f"  {page.id}: {page.slug} -> {page.path}")

# Get existing navigation items
nav_items = NavigationItem.objects.filter(project=project, locale='en', location='header')
print(f"\nCurrent header navigation items:")
for nav in nav_items:
    print(f"  {nav.label}: page={nav.page}, url='{nav.url}'")

print(f"\n🔧 FIXING NAVIGATION ITEMS...")

# Fix the navigation items with proper URLs
fixes = [
    {"label": "Home", "url": "/", "page": None},
    {"label": "Services", "url": "/services", "page": None},
    {"label": "Websites", "url": "/websites", "page": None},
    {"label": "POS Systems", "url": "/pos-systems", "page": None},
    {"label": "Help Center", "url": "/help-center", "page": None},
]

for fix in fixes:
    nav_item = NavigationItem.objects.filter(
        project=project, 
        locale='en', 
        location='header',
        label=fix['label']
    ).first()
    
    if nav_item:
        nav_item.url = fix['url']
        nav_item.page = fix['page']
        nav_item.save()
        print(f"✅ Fixed {fix['label']} -> {fix['url']}")
    else:
        print(f"❌ Could not find navigation item: {fix['label']}")

print(f"\n🔧 CREATING FOOTER HELP & TOOLS ITEMS...")

# Create footer navigation items for Help and Tools
help_tools_items = [
    {"label": "Help Center", "url": "/help-center", "column": 1},
    {"label": "Utilities", "url": "/help-center/utilities", "column": 1},
    {"label": "Contact", "url": "/contact", "column": 1},
    {"label": "Bug Reports", "url": "/bug-reports", "column": 1},
]

for item_data in help_tools_items:
    nav_item, created = NavigationItem.objects.get_or_create(
        project=project,
        locale='en',
        location='footer',
        label=item_data['label'],
        defaults={
            'url': item_data['url'],
            'column': item_data['column'],
            'order': 0,
        }
    )
    
    if created:
        print(f"✅ Created footer item: {item_data['label']} -> {item_data['url']}")
    else:
        print(f"ℹ️  Footer item already exists: {item_data['label']}")

print(f"\n✅ NAVIGATION FIX COMPLETE!")