#!/usr/bin/env python3
"""Fix the specific site ownership issues found"""
import os
import sys
import django

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteProject
from django.db import transaction

def fix_ownership():
    print("=== FIXING SITE OWNERSHIP ===")
    
    with transaction.atomic():
        # Get the main user Joao
        joao = User.objects.get(username='Joao')
        print(f"Found user: {joao.username} (ID: {joao.id})")
        
        # Move Just Code Works from admin to Joao
        try:
            jcw_site = SiteProject.objects.get(name='Just Code Works')
            current_owner = jcw_site.owner.username
            print(f"Just Code Works currently owned by: {current_owner}")
            
            if current_owner != 'Joao':
                jcw_site.owner = joao
                jcw_site.save()
                print(f"✅ Transferred 'Just Code Works' from {current_owner} to Joao")
            else:
                print("✅ Just Code Works already owned by Joao")
                
        except SiteProject.DoesNotExist:
            print("❌ Just Code Works site not found")
        
        # Verify Joe's Tire Center is owned by Joao (should already be correct)
        try:
            joes_site = SiteProject.objects.get(name="Joe's Tire Center")
            if joes_site.owner.username != 'Joao':
                joes_site.owner = joao
                joes_site.save()
                print(f"✅ Fixed Joe's Tire Center ownership to Joao")
            else:
                print("✅ Joe's Tire Center already owned by Joao")
        except SiteProject.DoesNotExist:
            print("❌ Joe's Tire Center not found")
    
    print("\n=== VERIFICATION ===")
    joao_sites = SiteProject.objects.filter(owner=joao)
    print(f"Joao now owns {joao_sites.count()} sites:")
    for site in joao_sites:
        print(f"  - {site.name} (slug: {site.slug})")

if __name__ == "__main__":
    fix_ownership()