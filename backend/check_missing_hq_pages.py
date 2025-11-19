#!/usr/bin/env python
"""
Check if HQ website pages exist: Websites, Print Lab, POS Systems, Services, Help Center
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, Page, Section

def check_hq_pages():
    """Check for specific HQ website pages"""
    
    print("🔍 Checking HQ Website Pages\n")
    
    # Get HQ project
    hq_projects = SiteProject.objects.filter(is_headquarters=True)
    
    if not hq_projects.exists():
        print("❌ No HQ projects found!")
        return
    
    hq_project = hq_projects.first()
    print(f"📍 HQ Project: {hq_project.name}")
    
    # Target pages to look for
    target_pages = [
        "websites",
        "print-lab", 
        "pos-systems",
        "services",
        "help-center",
        "help",
        "support"
    ]
    
    # Get all pages for HQ project
    hq_pages = Page.objects.filter(project=hq_project)
    print(f"📄 Total HQ Pages: {hq_pages.count()}")
    
    if hq_pages.count() == 0:
        print("\n❌ No pages found for HQ project")
        print("🔨 The HQ project exists but has no pages yet")
        return
    
    print(f"\n--- All HQ Pages ---")
    for page in hq_pages:
        print(f"  • {page.title} (slug: {page.slug}, path: {page.path})")
    
    print(f"\n--- Looking for Target Pages ---")
    found_pages = []
    missing_pages = []
    
    for target in target_pages:
        # Look for pages with matching slug or path
        matching_pages = hq_pages.filter(
            slug__icontains=target
        ).union(
            hq_pages.filter(path__icontains=target)
        ).union(
            hq_pages.filter(title__icontains=target.replace('-', ' '))
        )
        
        if matching_pages.exists():
            found_pages.append(target)
            for page in matching_pages:
                print(f"  ✅ Found: {target} → {page.title} ({page.slug})")
        else:
            missing_pages.append(target)
    
    # Report missing pages
    if missing_pages:
        print(f"\n--- Missing Pages ---")
        for missing in missing_pages:
            display_name = missing.replace('-', ' ').title()
            print(f"  ❌ Missing: {display_name}")
    
    # Check for sections in existing pages
    if hq_pages.exists():
        print(f"\n--- HQ Page Sections ---")
        for page in hq_pages[:3]:  # Show first 3 pages
            sections = Section.objects.filter(page=page)
            print(f"  📄 {page.title}: {sections.count()} sections")
            for section in sections[:2]:  # Show first 2 sections per page
                print(f"    • {section.identifier} ({section.internal_name})")
    
    # Summary
    print(f"\n--- Summary ---")
    print(f"✅ Found pages: {len(found_pages)}")
    print(f"❌ Missing pages: {len(missing_pages)}")
    print(f"📊 Total HQ pages: {hq_pages.count()}")
    
    return {
        'hq_project': hq_project,
        'total_pages': hq_pages.count(),
        'found_pages': found_pages,
        'missing_pages': missing_pages,
        'all_pages': list(hq_pages.values('title', 'slug', 'path'))
    }

if __name__ == '__main__':
    try:
        results = check_hq_pages()
    except Exception as e:
        print(f"✗ Error checking HQ pages: {e}")
        import traceback
        traceback.print_exc()