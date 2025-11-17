#!/usr/bin/env python3
"""
Check if Joe's Tire Center has sections that Joao can edit
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from sites.models import SiteProject, Page, Section

User = get_user_model()

def check_joes_sections():
    print("🔍 CHECKING JOE'S TIRE CENTER SECTIONS")
    print("=" * 50)
    
    # Find Joao's project
    joao = User.objects.get(username='Joao')
    joes_project = SiteProject.objects.get(owner=joao)
    
    print(f"Project: {joes_project.name}")
    print(f"Owner: {joes_project.owner.username}")
    print(f"Slug: {joes_project.slug}")
    
    # Check pages
    pages = Page.objects.filter(project=joes_project)
    print(f"\nPages in project: {pages.count()}")
    for page in pages:
        print(f"  - {page.title} (slug: {page.slug})")
    
    # Check sections
    sections = Section.objects.filter(page__project=joes_project)
    print(f"\nSections in project: {sections.count()}")
    for section in sections:
        print(f"  - Section {section.id}: {section.identifier} (Page: {section.page.title})")
    
    if sections.exists():
        print(f"\n✅ Joe's Tire Center has {sections.count()} sections that Joao can edit!")
        test_section = sections.first()
        print(f"Test section: {test_section.id} - {test_section.identifier}")
        print(f"Correct API URL: http://localhost:3002/en/dashboard/website")
    else:
        print(f"\n❌ No sections found in Joe's Tire Center")
        print("This is why you can't edit - the project needs content!")
        print("\nOptions:")
        print("1. Create sections for Joe's Tire Center")
        print("2. Edit a different project (login as admin for 'Just Code Works')")

if __name__ == "__main__":
    check_joes_sections()