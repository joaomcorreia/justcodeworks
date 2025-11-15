#!/usr/bin/env python
"""
Test script to check authentication and template assignment
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteProject, SiteTemplate

def test_auth_and_templates():
    print("=== AUTHENTICATION & TEMPLATE ASSIGNMENT TEST ===")
    
    # Check users and their projects
    print("\n1. USERS AND THEIR PROJECTS:")
    users = User.objects.filter(is_active=True)
    for user in users:
        projects = SiteProject.objects.filter(owner=user)
        print(f"  User: {user.username}")
        for project in projects:
            print(f"    - {project.name} (id={str(project.id)[:8]}...)")
            print(f"      Current site_template: {project.site_template}")
    
    # Check available templates for assignment
    print("\n2. AVAILABLE SITE TEMPLATES:")
    templates = SiteTemplate.objects.filter(is_active=True, is_user_selectable=True, status="published")
    for template in templates:
        print(f"  - {template.name} (id={template.id}, key={template.key})")
    
    # Test assignment logic
    print("\n3. ASSIGNMENT TEST SIMULATION:")
    test_user = User.objects.filter(username="Joao").first()
    if test_user:
        test_project = SiteProject.objects.filter(owner=test_user).first()
        if test_project:
            test_template = templates.first()
            if test_template:
                print(f"  Simulating: User '{test_user.username}' assigns template '{test_template.name}' to project '{test_project.name}'")
                print(f"  ✅ User owns project: {test_project.owner == test_user}")
                print(f"  ✅ Template is available: {test_template in templates}")
                print(f"  Current template: {test_project.site_template}")
                print(f"  Would change to: {test_template}")
    
    print("\n=== END TEST ===")

if __name__ == "__main__":
    test_auth_and_templates()