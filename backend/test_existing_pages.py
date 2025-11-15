#!/usr/bin/env python3
"""Simple test to verify locale fallback works with existing pages."""

import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

API_BASE = "http://127.0.0.1:8000/api"

# Get the first active project
project = SiteProject.objects.filter(is_active=True).first()
if not project:
    print("No active project found")
    exit(1)

print(f"Testing with project: {project.name} (ID: {project.id})")

# Test scenarios
tests = [
    {"slug": "home", "locale": "pt", "name": "Home page with PT locale"},
    {"slug": "home", "locale": "en", "name": "Home page with EN locale"},
]

for test in tests:
    url = f"{API_BASE}/pages/?project={project.id}&slug={test['slug']}&locale={test['locale']}"
    print(f"\n🧪 {test['name']}")
    print(f"📡 GET {url}")
    
    try:
        resp = requests.get(url)
        print(f"📊 Status: {resp.status_code}")
        
        if resp.status_code == 200:
            pages = resp.json()
            print(f"📝 Results: {len(pages)}")
            
            for page in pages:
                print(f"   → {page['title']} (locale: {page['locale']})")
        else:
            print(f"❌ Error: {resp.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")