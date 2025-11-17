#!/usr/bin/env python3

import os
import sys
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject
from django.contrib.auth.models import User

print("=== DATABASE STATUS ===")
print(f"Total Sites: {SiteProject.objects.count()}")
print(f"Total Users: {User.objects.count()}")

print("\n=== EXISTING SITES ===")
sites = SiteProject.objects.all()[:10]
if sites:
    for site in sites:
        owner_email = site.owner.email if site.owner else "None"
        print(f"- {site.name} (slug: {site.slug}, owner: {owner_email})")
else:
    print("No sites found in database")

print("\n=== EXISTING USERS ===")
users = User.objects.all()[:5]
if users:
    for user in users:
        print(f"- {user.email} (active: {user.is_active}, superuser: {user.is_superuser})")
else:
    print("No users found in database")