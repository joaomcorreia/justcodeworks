import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Page, SiteProject
from django.contrib.auth.models import User

try:
    user = User.objects.get(username='Joao')
    print(f"User: {user.username}")
    
    projects = SiteProject.objects.filter(owner=user)
    print(f"User has {projects.count()} projects:")
    for p in projects:
        print(f"- {p.name} ({p.slug})")
    
    pages = Page.objects.filter(project__owner=user)
    print(f"\nUser has {pages.count()} pages:")
    for p in pages[:5]:
        print(f"- {p.title} ({p.slug}) - Project: {p.project.name}")
        print(f"  Path: {p.path} | Locale: {p.locale} | Published: {p.is_published}")
        
except Exception as e:
    print(f"Error: {e}")