#!/usr/bin/env python
"""
Migrate HQ fields from sites app to main_site app.
This script copies fields from HQ site projects to the new MainField model.
"""
import os
import sys
import django
from django.conf import settings

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field
from main_site.models import MainPage, MainSection, MainField

def main():
    print("🔄 MIGRATING HQ FIELDS TO MAIN WEBSITE SECTION")
    print("=" * 60)
    
    # Find HQ site project
    try:
        hq_project = SiteProject.objects.get(is_headquarters=True)
        print(f"✅ Found HQ Project: {hq_project.name}")
    except SiteProject.DoesNotExist:
        print("❌ No HQ project found! Cannot migrate fields.")
        return
    except SiteProject.MultipleObjectsReturned:
        print("❌ Multiple HQ projects found! Please fix data integrity first.")
        return
    
    # Get HQ pages from sites app
    hq_pages = Page.objects.filter(project=hq_project)
    print(f"📄 Found {hq_pages.count()} HQ pages in sites app")
    
    if not hq_pages.exists():
        print("ℹ️  No HQ pages found in sites app - nothing to migrate")
        return
    
    migrated_sections = 0
    migrated_fields = 0
    
    # Process each HQ page
    for site_page in hq_pages:
        print(f"\n📄 Processing page: {site_page.slug} ({site_page.locale})")
        
        # Find or create corresponding MainPage
        main_page, page_created = MainPage.objects.get_or_create(
            slug=site_page.slug,
            locale=site_page.locale,
            defaults={
                'path': site_page.path,
                'title': site_page.title,
                'order': site_page.order,
                'is_published': site_page.is_published,
                'meta_title': site_page.meta_title,
                'meta_description': site_page.meta_description,
                'meta_slug': site_page.meta_slug,
                'indexable': site_page.indexable,
            }
        )
        
        if page_created:
            print(f"   ✅ Created MainPage: {main_page.slug}")
        else:
            print(f"   ℹ️  MainPage already exists: {main_page.slug}")
        
        # Get sections for this page
        sections = Section.objects.filter(page=site_page)
        print(f"   📂 Found {sections.count()} sections")
        
        for site_section in sections:
            # Create or get corresponding MainSection
            main_section, section_created = MainSection.objects.get_or_create(
                page=main_page,
                identifier=site_section.identifier,
                defaults={
                    'internal_name': site_section.internal_name,
                    'order': site_section.order,
                }
            )
            
            if section_created:
                print(f"      ✅ Created MainSection: {main_section.identifier}")
                migrated_sections += 1
            else:
                print(f"      ℹ️  MainSection already exists: {main_section.identifier}")
            
            # Get fields for this section
            fields = Field.objects.filter(section=site_section)
            print(f"      🏷️  Found {fields.count()} fields")
            
            for site_field in fields:
                # Create or get corresponding MainField
                main_field, field_created = MainField.objects.get_or_create(
                    section=main_section,
                    key=site_field.key,
                    defaults={
                        'label': site_field.label,
                        'value': site_field.value,
                        'order': site_field.order,
                    }
                )
                
                if field_created:
                    print(f"         ✅ Migrated field: {main_field.key} = '{main_field.value[:50]}...'")
                    migrated_fields += 1
                else:
                    # Update existing field value if different
                    if main_field.value != site_field.value:
                        main_field.value = site_field.value
                        main_field.label = site_field.label
                        main_field.order = site_field.order
                        main_field.save()
                        print(f"         🔄 Updated field: {main_field.key}")
                    else:
                        print(f"         ℹ️  Field already exists: {main_field.key}")
    
    print(f"\n📊 MIGRATION SUMMARY:")
    print(f"   📄 HQ Pages processed: {hq_pages.count()}")
    print(f"   📂 MainSections created: {migrated_sections}")  
    print(f"   🏷️  MainFields migrated: {migrated_fields}")
    print(f"   📊 Total MainPages: {MainPage.objects.count()}")
    print(f"   📊 Total MainSections: {MainSection.objects.count()}")
    print(f"   📊 Total MainFields: {MainField.objects.count()}")
    
    print(f"\n🌐 ADMIN ACCESS:")
    print(f"   Main Website Sections: http://127.0.0.1:8000/admin/main_site/mainsection/")
    print(f"   Main Website Fields: http://127.0.0.1:8000/admin/main_site/mainfield/")
    
    if migrated_fields > 0:
        print(f"\n✅ Migration completed successfully!")
        print(f"🔗 HQ content is now available in the Main Website section")
    else:
        print(f"\nℹ️  No new fields to migrate - everything already in sync")

if __name__ == "__main__":
    main()