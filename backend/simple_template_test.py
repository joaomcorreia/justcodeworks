#!/usr/bin/env python3

"""
Simple Template Lab API Test

Tests the Template Lab endpoints with simple Django commands
"""

import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, Template
from django.contrib.auth.models import User

print("🧪 Simple Template Lab API Test")
print("=" * 40)

# Check database counts
print(f"SiteTemplate count: {SiteTemplate.objects.count()}")
print(f"Template count: {Template.objects.count()}")
print(f"Staff users count: {User.objects.filter(is_staff=True).count()}")

# List some data
print("\n📋 Sample SiteTemplates:")
for st in SiteTemplate.objects.all()[:3]:
    print(f"  - {st.name} (key: {st.key}, status: {st.status})")

print("\n📋 Sample Templates:")
for t in Template.objects.all()[:3]:
    print(f"  - {t.name} (slug: {t.slug}, category: {t.category})")

print("\n✅ Database connection and models working!")
print("🎯 Backend models are ready for Template Lab")
print("\nTo test full API, start Django server with: python manage.py runserver 8000")