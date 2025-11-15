"""
Test script for Template Builder v1 functionality
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, SiteProject
from sites.utils import ensure_template_skeleton, clone_project_structure
from django.contrib.auth.models import User

def test_template_builder():
    print("=== Template Builder v1 Test ===\n")
    
    # 1. Create a test SiteTemplate
    print("1. Creating test SiteTemplate...")
    site_template, created = SiteTemplate.objects.get_or_create(
        key='test-template-v1',
        defaults={
            'name': 'Test Template v1',
            'description': 'A test template for the Template Builder',
            'type': 'website',
            'category': 'Testing',
            'status': 'draft',
            'version': 'v1.0',
            'is_active': True
        }
    )
    if created:
        print(f"   ✓ Created SiteTemplate: {site_template.name}")
    else:
        print(f"   ✓ Using existing SiteTemplate: {site_template.name}")
    
    # 2. Generate skeleton for the template
    print("\n2. Generating template skeleton...")
    try:
        master_project = ensure_template_skeleton(site_template)
        print(f"   ✓ Generated master project: {master_project.name}")
        print(f"   ✓ Master template flag: {master_project.is_master_template}")
        print(f"   ✓ Pages created: {master_project.pages.count()}")
        
        # Show page details
        for page in master_project.pages.all():
            sections_count = page.sections.count()
            fields_count = sum(s.fields.count() for s in page.sections.all())
            print(f"     - {page.title} ({page.locale}): {sections_count} sections, {fields_count} fields")
            
    except Exception as e:
        print(f"   ✗ Error generating skeleton: {e}")
        return
    
    # 3. Test cloning to a new project
    print("\n3. Testing project cloning...")
    try:
        # Get or create a test user
        test_user, created = User.objects.get_or_create(
            username='test_clone_user',
            defaults={
                'email': 'test@clone.com',
                'first_name': 'Test',
                'last_name': 'Clone'
            }
        )
        
        cloned_project = clone_project_structure(
            master_project,
            owner=test_user,
            name='Cloned Test Project',
            slug='cloned-test-project-v1',
            locales=['en']
        )
        
        print(f"   ✓ Cloned project: {cloned_project.name}")
        print(f"   ✓ Owner: {cloned_project.owner}")
        print(f"   ✓ Master template flag: {cloned_project.is_master_template}")
        print(f"   ✓ Pages cloned: {cloned_project.pages.count()}")
        print(f"   ✓ Navigation items: {cloned_project.navigation_items.count()}")
        
    except Exception as e:
        print(f"   ✗ Error cloning project: {e}")
        return
    
    print(f"\n=== Template Builder Test Complete ===")
    print(f"SiteTemplate ID: {site_template.id}")
    print(f"Master Project ID: {master_project.id}")  
    print(f"Cloned Project ID: {cloned_project.id}")

if __name__ == '__main__':
    test_template_builder()