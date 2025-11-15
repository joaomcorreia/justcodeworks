#!/usr/bin/env python
"""
Create a test project for user Joao to fix template assignment issue
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, SiteTemplate
from django.contrib.auth.models import User
import uuid

def create_test_project():
    print("=== CREATING TEST PROJECT FOR USER ===")
    
    # Get user Joao
    try:
        joao = User.objects.get(username="Joao")
        print(f"Found user: {joao.username}")
    except User.DoesNotExist:
        print("User 'Joao' not found")
        return
    
    # Check if Joao already has projects
    existing_projects = SiteProject.objects.filter(owner=joao)
    if existing_projects.exists():
        print(f"User {joao.username} already has {existing_projects.count()} projects:")
        for project in existing_projects:
            print(f"  - {project.name}")
        return
    
    # Get the jcw-main template as default
    try:
        jcw_template = SiteTemplate.objects.get(key="jcw-main")
        print(f"Using default template: {jcw_template.name}")
    except SiteTemplate.DoesNotExist:
        print("jcw-main template not found")
        jcw_template = None
    
    # Create a test project for Joao
    project = SiteProject.objects.create(
        name=f"Test Site for {joao.username}",
        slug=f"test-site-{joao.username.lower()}",
        owner=joao,
        site_template=jcw_template,
        primary_goal="show-info",
        business_type="Test Business",
        notes="Test project for template assignment"
    )
    
    print(f"✅ Created project: {project.name} (id={str(project.id)[:8]}...)")
    print(f"   Owner: {project.owner.username}")
    print(f"   Template: {project.site_template.name if project.site_template else 'None'}")
    
    print("\n=== VERIFICATION ===")
    joao_projects = SiteProject.objects.filter(owner=joao)
    print(f"Projects owned by {joao.username}: {joao_projects.count()}")
    for p in joao_projects:
        print(f"  - {p.name} (id={str(p.id)[:8]}...)")

if __name__ == "__main__":
    create_test_project()