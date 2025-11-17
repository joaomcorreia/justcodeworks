#!/usr/bin/env python3
"""
Debug section ordering for Oficina Paulo Calibra site
"""

import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def debug_section_ordering():
    """Debug the exact section ordering for the site"""
    
    try:
        # Get the Oficina Paulo Calibra project
        project = SiteProject.objects.get(slug='oficina-paulo-calibra')
        print(f"📋 Project: {project.name}")
        
        # Get all pages
        pages = Page.objects.filter(project=project).order_by('order')
        
        all_sections = []
        for page in pages:
            sections = Section.objects.filter(page=page).order_by('order')
            print(f"\n📄 Page: {page.slug} (order: {page.order})")
            for section in sections:
                all_sections.append({
                    'page': page.slug,
                    'page_order': page.order, 
                    'section_order': section.order,
                    'identifier': section.identifier,
                    'internal_name': section.internal_name
                })
                print(f"   🔧 Section {section.order}: {section.identifier} - '{section.internal_name}'")
        
        print(f"\n🔄 Combined ordering (as rendered on site):")
        print("=" * 60)
        
        # Sort all sections by page order first, then section order
        all_sections.sort(key=lambda x: (x['page_order'], x['section_order']))
        
        for i, section in enumerate(all_sections, 1):
            print(f"Position {i}: {section['identifier']} ({section['page']} page)")
            print(f"           '{section['internal_name']}'")
            
        return all_sections
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def main():
    print("🔍 Debugging Oficina Paulo Calibra Section Ordering")
    print("=" * 60)
    
    sections = debug_section_ordering()
    
    if len(sections) > 6:
        print(f"\n⚠️  Found {len(sections)} sections total")
        print("   This might explain why sections appear duplicated")

if __name__ == "__main__":
    main()