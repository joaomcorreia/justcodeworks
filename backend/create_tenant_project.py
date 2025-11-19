#!/usr/bin/env python
"""
Create a sample tenant project to test HQ vs Tenant filtering
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

def create_tenant_project():
    """Create a sample tenant project for comparison"""
    
    # Get a different template for tenant
    tenant_template = SiteTemplate.objects.filter(is_user_selectable=True).exclude(key='jcw-main').first()
    
    if not tenant_template:
        # Create a basic tenant template
        tenant_template = SiteTemplate.objects.create(
            key='basic-business',
            name='Basic Business Template',
            description='A simple template for small businesses',
            is_user_selectable=True
        )
        print(f"✓ Created tenant template: {tenant_template.name}")
    else:
        print(f"✓ Using existing tenant template: {tenant_template.name}")
    
    # Get or create tenant user
    tenant_user, created = User.objects.get_or_create(
        username='tenant_user',
        defaults={
            'email': 'tenant@example.com',
            'first_name': 'Test',
            'last_name': 'Tenant'
        }
    )
    
    if created:
        tenant_user.set_password('tenant123')
        tenant_user.save()
        print(f"✓ Created tenant user: {tenant_user.username}")
    else:
        print(f"✓ Found existing tenant user: {tenant_user.username}")
    
    # Create tenant project
    tenant_project, created = SiteProject.objects.get_or_create(
        name='Sample Restaurant Site',
        defaults={
            'slug': 'sample-restaurant',
            'site_template': tenant_template,
            'owner': tenant_user,
            'business_type': 'Restaurant',
            'primary_goal': 'get-leads',
            'is_headquarters': False  # Explicitly set as tenant
        }
    )
    
    if created:
        print(f"✓ Created tenant project: {tenant_project.name}")
    else:
        print(f"✓ Found existing tenant project: {tenant_project.name}")
    
    print(f"\n--- Tenant Project Summary ---")
    print(f"Name: {tenant_project.name}")
    print(f"Slug: {tenant_project.slug}")
    print(f"Template: {tenant_project.site_template.name}")
    print(f"Owner: {tenant_project.owner.username}")
    print(f"Business Type: {tenant_project.business_type}")
    print(f"Is HQ: {tenant_project.is_headquarters}")
    print(f"Site Type: {tenant_project.get_site_type_display()}")
    
    return tenant_project

if __name__ == '__main__':
    try:
        tenant_project = create_tenant_project()
        print(f"\n✓ Successfully set up tenant project: {tenant_project.name}")
    except Exception as e:
        print(f"✗ Error creating tenant project: {e}")
        import traceback
        traceback.print_exc()