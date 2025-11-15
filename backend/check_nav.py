#!/usr/bin/env python3
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import NavigationItem, SiteProject

print("=== Projects ===")
for p in SiteProject.objects.all():
    print(f"{p.id}: {p.name}")

print("\n=== Navigation Items (EN, Header) ===")
for n in NavigationItem.objects.filter(locale='en', location='header')[:10]:
    print(f"{n.label}: {n.url or n.page}")

print("\n=== Navigation Items (PT, Header) ===") 
for n in NavigationItem.objects.filter(locale='pt', location='header')[:10]:
    print(f"{n.label}: {n.url or n.page}")