#!/usr/bin/env python3
"""
Check field content directly
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Field

print("=== Field Content Check ===")

# Get Mary's Restaurant project
projects = SiteProject.objects.filter(owner__username='mary_restaurant')
print(f"Found {projects.count()} projects for mary_restaurant")

for project in projects:
    print(f"\nProject: {project.name}")
    for page in project.pages.all():
        print(f"  Page: {page.title}")
        for section in page.sections.all():
            print(f"    Section: {section.identifier}")
            for field in section.fields.all():
                if field.key in ['title', 'subtitle', 'heading', 'description', 'content']:
                    value = field.value[:200] if field.value else "(empty)"
                    print(f"      {field.key}: {value}")
                    if "<" in value and ">" in value:
                        print(f"        ^ CONTAINS HTML TAGS")