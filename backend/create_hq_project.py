#!/usr/bin/env python
"""
Script to create HQ (Headquarters) project for testing the HQ/Tenant separation system
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from sites.models import SiteProject, SiteTemplate

User = get_user_model()

def create_hq_project():
    """Create HQ project with proper template and user"""
    
    # Get or create HQ template
    hq_template, created = SiteTemplate.objects.get_or_create(
        key='jcw-main',
        defaults={
            'name': 'JCW Main Long Page',
            'description': 'Main JustCodeWorks headquarters website template'
        }
    )
    
    if created:
        print(f"✓ Created HQ template: {hq_template.name}")
    else:
        print(f"✓ Found existing HQ template: {hq_template.name}")
    
    # Get or create admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@justcodeworks.com',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"✓ Created admin user: {admin_user.username}")
    else:
        print(f"✓ Found existing admin user: {admin_user.username}")
    
    # Create or update HQ project
    hq_project, created = SiteProject.objects.get_or_create(
        site_template=hq_template,
        owner=admin_user,
        defaults={
            'name': 'JustCodeWorks HQ Website',
            'slug': 'justcodeworks-hq',
            'is_headquarters': True
        }
    )
    
    if created:
        print(f"✓ Created HQ project: {hq_project.name}")
    else:
        # Update existing project to be HQ
        hq_project.is_headquarters = True
        hq_project.save()
        print(f"✓ Updated existing project to HQ: {hq_project.name}")
    
    # Show summary
    print(f"\n--- HQ Project Summary ---")
    print(f"Name: {hq_project.name}")
    print(f"Slug: {hq_project.slug}")
    print(f"Template: {hq_project.site_template.name}")
    print(f"Owner: {hq_project.owner.username}")
    print(f"Is HQ: {hq_project.is_headquarters}")
    print(f"Site Type: {hq_project.get_site_type_display()}")
    
    return hq_project

if __name__ == '__main__':
    try:
        hq_project = create_hq_project()
        print(f"\n✓ Successfully set up HQ project: {hq_project.name}")
    except Exception as e:
        print(f"✗ Error creating HQ project: {e}")
        import traceback
        traceback.print_exc()