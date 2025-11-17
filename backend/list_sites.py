#!/usr/bin/env python3
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

print("📋 Available Sites:")
for p in SiteProject.objects.all():
    template_key = p.site_template.key if p.site_template else "No template"
    print(f"   {p.slug} -> {template_key}")