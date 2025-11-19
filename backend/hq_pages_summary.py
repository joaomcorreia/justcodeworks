#!/usr/bin/env python
"""
Final summary of restored HQ pages
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, Page, Section, Field

def show_hq_pages_summary():
    """Show detailed summary of restored HQ pages"""
    
    print("🏢 JustCodeWorks HQ Website - Restoration Summary\n")
    
    # Get HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if not hq_project:
        print("❌ No HQ project found!")
        return
    
    print(f"🎯 Project: {hq_project.name}")
    print(f"🏷️  Site Type: {hq_project.get_site_type_display()}")
    print(f"📋 Template: {hq_project.site_template.name}")
    
    # Get all HQ pages
    hq_pages = Page.objects.filter(project=hq_project).order_by('order')
    
    print(f"\n📄 Restored Pages ({hq_pages.count()} total):")
    print("─" * 80)
    
    for page in hq_pages:
        sections = Section.objects.filter(page=page).order_by('order')
        fields_count = Field.objects.filter(section__page=page).count()
        
        print(f"\n{page.order + 1}. {page.title}")
        print(f"   📍 Path: {page.path}")
        print(f"   🔗 Slug: {page.slug}")
        print(f"   📊 Sections: {sections.count()} | Fields: {fields_count}")
        
        # Show sections
        for section in sections:
            section_fields = Field.objects.filter(section=section)
            print(f"      ▶ {section.internal_name} ({section.identifier}) - {section_fields.count()} fields")
    
    # Show totals
    total_sections = Section.objects.filter(page__project=hq_project).count()
    total_fields = Field.objects.filter(section__page__project=hq_project).count()
    
    print(f"\n📊 Totals:")
    print(f"   📄 Pages: {hq_pages.count()}")
    print(f"   📝 Sections: {total_sections}")
    print(f"   🏷️  Fields: {total_fields}")
    
    # Verify all target pages exist
    target_pages = ['home', 'websites', 'pos-systems', 'services', 'help-center', 'print-lab']
    existing_slugs = set(hq_pages.values_list('slug', flat=True))
    
    print(f"\n✅ Target Pages Verification:")
    for target in target_pages:
        status = "✅" if target in existing_slugs else "❌"
        display_name = target.replace('-', ' ').title()
        print(f"   {status} {display_name}")
    
    missing = set(target_pages) - existing_slugs
    if missing:
        print(f"\n⚠️  Missing pages: {', '.join(missing)}")
    else:
        print(f"\n🎉 All target pages successfully restored!")
    
    return {
        'pages': hq_pages.count(),
        'sections': total_sections,
        'fields': total_fields,
        'missing': list(missing) if missing else []
    }

if __name__ == '__main__':
    try:
        results = show_hq_pages_summary()
    except Exception as e:
        print(f"❌ Error showing summary: {e}")
        import traceback
        traceback.print_exc()