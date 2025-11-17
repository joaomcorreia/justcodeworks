#!/usr/bin/env python3
"""
Check authentication and ownership to solve Forbidden error
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from sites.models import SiteProject, Page, Section

User = get_user_model()

def check_auth_and_ownership():
    print("🔍 CHECKING AUTH AND OWNERSHIP")
    print("=" * 50)
    
    # Check users
    users = User.objects.all()
    print(f"Total Users: {users.count()}")
    for user in users:
        print(f"  - {user.username} (ID: {user.id}, Staff: {user.is_staff}, Super: {user.is_superuser})")
    
    # Check projects
    projects = SiteProject.objects.all()
    print(f"\nTotal Projects: {projects.count()}")
    for project in projects:
        owner_info = f"{project.owner.username}" if project.owner else "No Owner"
        print(f"  - {project.name} (ID: {project.id}, Owner: {owner_info})")
    
    # Check sections
    sections = Section.objects.all()[:5]  # First 5 sections
    print(f"\nFirst 5 Sections (Total: {Section.objects.count()}):")
    for section in sections:
        owner_info = f"{section.page.project.owner.username}" if section.page.project.owner else "No Owner"
        print(f"  - Section {section.id}: {section.identifier} (Project: {section.page.project.name}, Owner: {owner_info})")
    
    print("\n" + "="*50)
    print("SOLUTION:")
    print("1. Go to http://localhost:3001/en/auth/login")
    print("2. Log in with a user that owns the project")
    print("3. Then try updating the sections")
    print("\nIf no user exists, create one with:")
    print("python manage.py createsuperuser")

if __name__ == "__main__":
    check_auth_and_ownership()