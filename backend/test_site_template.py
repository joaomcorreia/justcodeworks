#!/usr/bin/env python3
"""Test the SiteTemplate implementation."""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, SiteProject

print("🧪 Testing SiteTemplate Implementation")
print("=" * 50)

print("\n📋 SiteTemplates:")
for st in SiteTemplate.objects.all():
    print(f"  {st.key}: {st.name} (active: {st.is_active})")

print("\n🏗️ Projects with site_template:")
for sp in SiteProject.objects.all():
    template_info = sp.site_template.key if sp.site_template else "None"
    print(f"  {sp.name}: {template_info}")

print("\n🎯 Testing SiteProject serializer output:")
from sites.serializers import SiteProjectSerializer
project = SiteProject.objects.first()
if project:
    serializer = SiteProjectSerializer(project)
    template_data = {
        'template_key': serializer.data.get('template_key'),
        'template_name': serializer.data.get('template_name'),
        'site_template': serializer.data.get('site_template')
    }
    print(f"  Template fields: {template_data}")
else:
    print("  No projects found")

print("\n" + "=" * 50)
print("✅ SiteTemplate implementation test complete!")