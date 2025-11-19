#!/usr/bin/env python
"""
Check for existing HQ website pages: Websites, Print Lab, POS Systems, Services, Help Center
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, Page, Section, Field

def check_hq_pages():
    """Check for existing HQ website pages"""
    
    print("🔍 Checking HQ Website Pages\n")
    
    # Get HQ projects
    hq_projects = SiteProject.objects.filter(is_headquarters=True)
    
    if not hq_projects.exists():
        print("❌ No HQ projects found!")
        return
    
    print(f"Found {hq_projects.count()} HQ project(s):")
    for hq_project in hq_projects:
        print(f"  📍 {hq_project.name} (ID: {hq_project.id})")
    
    # Target pages to look for
    target_pages = [
        "Websites",
        "Print Lab", 
        "POS Systems",
        "Services",
        "Help Center"
    ]
    
    print(f"\n--- Searching for Target Pages ---")
    
    # Get all pages from HQ projects
    all_hq_pages = Page.objects.filter(project__is_headquarters=True)
    print(f"Total HQ pages found: {all_hq_pages.count()}\n")
    
    # Check each target page
    found_pages = []
    missing_pages = []
    
    for target_page in target_pages:
        # Search by title (exact match)
        exact_matches = all_hq_pages.filter(title=target_page)
        
        # Search by slug or path (flexible matching)
        slug_matches = all_hq_pages.filter(
            models.Q(slug__icontains=target_page.lower().replace(' ', '-')) |
            models.Q(path__icontains=target_page.lower().replace(' ', '-')) |
            models.Q(title__icontains=target_page)
        )
        
        if exact_matches.exists():
            page = exact_matches.first()
            print(f"✅ FOUND: {target_page}")
            print(f"   📄 Title: {page.title}")
            print(f"   🔗 Slug: {page.slug}")  
            print(f"   📍 Path: {page.path}")
            print(f"   🏢 Project: {page.project.name}")
            print(f"   📊 Sections: {page.sections.count()}")
            print(f"   🌐 Locale: {page.locale}")
            print(f"   ✅ Published: {page.is_published}")
            found_pages.append(target_page)
        elif slug_matches.exists():
            print(f"🔍 PARTIAL MATCH: {target_page}")
            for match in slug_matches[:3]:  # Show first 3 matches
                print(f"   📄 Title: {match.title}")
                print(f"   🔗 Slug: {match.slug}")
                print(f"   📍 Path: {match.path}")
            found_pages.append(f"{target_page} (partial)")
        else:
            print(f"❌ MISSING: {target_page}")
            missing_pages.append(target_page)
        
        print()  # Empty line for readability
    
    # Show all HQ pages for reference
    if all_hq_pages.exists():
        print(f"--- All HQ Pages ({all_hq_pages.count()}) ---")
        for page in all_hq_pages.order_by('title'):
            sections_count = page.sections.count()
            print(f"📄 {page.title} | {page.slug} | {sections_count} sections | {page.locale}")
    
    # Summary
    print(f"\n--- Summary ---")
    print(f"✅ Found: {len([p for p in found_pages if 'partial' not in p])}")
    print(f"🔍 Partial: {len([p for p in found_pages if 'partial' in p])}")
    print(f"❌ Missing: {len(missing_pages)}")
    
    if missing_pages:
        print(f"\nMissing pages: {', '.join(missing_pages)}")
    
    return {
        'found': found_pages,
        'missing': missing_pages,
        'total_hq_pages': all_hq_pages.count()
    }

if __name__ == '__main__':
    try:
        from django.db import models
        results = check_hq_pages()
    except Exception as e:
        print(f"✗ Error checking HQ pages: {e}")
        import traceback
        traceback.print_exc()