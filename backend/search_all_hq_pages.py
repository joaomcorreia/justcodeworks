#!/usr/bin/env python
"""
Search for HQ-related pages across all projects
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, Page, Section

def search_all_hq_pages():
    """Search for HQ-related pages across all projects"""
    
    print("🔍 Searching for HQ Pages Across All Projects\n")
    
    # Target pages to look for
    target_pages = [
        "websites",
        "print-lab", 
        "pos-systems", 
        "pos",
        "services",
        "help-center",
        "help",
        "support",
        "contact",
        "about"
    ]
    
    # Get all projects
    all_projects = SiteProject.objects.all()
    print(f"📊 Total Projects: {all_projects.count()}")
    
    for project in all_projects:
        hq_status = "🏢 HQ" if project.is_headquarters else "👤 Tenant"
        print(f"  {hq_status} {project.name} ({project.slug})")
    
    # Get all pages
    all_pages = Page.objects.all()
    print(f"\n📄 Total Pages: {all_pages.count()}")
    
    if all_pages.count() == 0:
        print("❌ No pages found in the entire system!")
        return
    
    print(f"\n--- All Pages by Project ---")
    for project in all_projects:
        pages = Page.objects.filter(project=project)
        hq_status = "🏢" if project.is_headquarters else "👤"
        print(f"\n{hq_status} {project.name} ({pages.count()} pages):")
        
        for page in pages:
            print(f"    • {page.title} (/{page.path})")
    
    print(f"\n--- Searching for Target Pages ---")
    found_matches = []
    
    for target in target_pages:
        print(f"\n🔍 Looking for '{target}':")
        
        # Search by slug
        slug_matches = Page.objects.filter(slug__icontains=target)
        # Search by path
        path_matches = Page.objects.filter(path__icontains=target)
        # Search by title
        title_matches = Page.objects.filter(title__icontains=target.replace('-', ' '))
        
        all_matches = slug_matches.union(path_matches).union(title_matches)
        
        if all_matches.exists():
            for page in all_matches:
                hq_status = "🏢 HQ" if page.project.is_headquarters else "👤 Tenant"
                print(f"  ✅ {hq_status} {page.title} (/{page.path}) in {page.project.name}")
                found_matches.append({
                    'target': target,
                    'page': page,
                    'is_hq': page.project.is_headquarters
                })
        else:
            print(f"  ❌ No matches found")
    
    # Check if we need to migrate pages to HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if hq_project and found_matches:
        print(f"\n--- Migration Analysis ---")
        print(f"🎯 Target HQ Project: {hq_project.name}")
        
        tenant_pages_that_should_be_hq = [
            match for match in found_matches 
            if not match['is_hq']
        ]
        
        if tenant_pages_that_should_be_hq:
            print(f"\n🔄 Pages that might need to be moved to HQ:")
            for match in tenant_pages_that_should_be_hq:
                page = match['page']
                print(f"  • {page.title} (currently in {page.project.name})")
        else:
            print(f"\n✅ All found pages are already in appropriate projects")
    
    return found_matches

if __name__ == '__main__':
    try:
        results = search_all_hq_pages()
    except Exception as e:
        print(f"✗ Error searching for HQ pages: {e}")
        import traceback
        traceback.print_exc()