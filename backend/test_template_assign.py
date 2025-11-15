#!/usr/bin/env python
"""
Quick test script to debug template assignment API
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, SiteTemplate
from django.contrib.auth.models import User

def test_template_assignment():
    print("=== TEMPLATE ASSIGNMENT DEBUG TEST ===")
    
    # Check users
    print("\n1. USERS:")
    users = User.objects.all()
    for user in users:
        print(f"  - {user.username} (id={user.id}, active={user.is_active})")
    
    # Check projects
    print("\n2. SITE PROJECTS:")
    projects = SiteProject.objects.all()
    for project in projects:
        print(f"  - {project.name} (id={str(project.id)[:8]}...) - Owner: {project.owner.username if project.owner else 'None'}")
    
    # Check user-selectable templates
    print("\n3. USER-SELECTABLE TEMPLATES:")
    templates = SiteTemplate.objects.filter(
        is_active=True,
        is_user_selectable=True,
        status="published"
    )
    for template in templates:
        print(f"  - {template.name} (id={template.id}) - key={template.key}")
    
    # Try to simulate assignment logic
    if projects.exists() and templates.exists() and users.exists():
        test_user = users.first()
        test_project = projects.filter(owner=test_user).first()
        test_template = templates.first()
        
        print(f"\n4. SIMULATION TEST:")
        print(f"  User: {test_user.username}")
        
        if test_project:
            print(f"  Project: {test_project.name} (owned by {test_project.owner.username})")
        else:
            print(f"  No projects owned by {test_user.username}")
            
        if test_template:
            print(f"  Template: {test_template.name}")
            print(f"  Assignment would work: {test_project and test_template and test_project.owner == test_user}")
        else:
            print("  No user-selectable templates available")
    
    print("\n=== END DEBUG TEST ===")

if __name__ == "__main__":
    test_template_assignment()