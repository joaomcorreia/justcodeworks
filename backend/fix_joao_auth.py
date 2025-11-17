#!/usr/bin/env python3
"""Check and fix Joao user authentication"""
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

def check_users():
    print("=== CHECKING USERS ===")
    users = User.objects.all().order_by('id')
    
    for user in users:
        print(f"ID {user.id}: {user.username} - {user.first_name} {user.last_name}")
        if user.username.lower() in ['joao', 'admin']:
            print(f"  * Email: {user.email}")
            print(f"  * Active: {user.is_active}")
            print(f"  * Staff: {user.is_staff}")
            print(f"  * Superuser: {user.is_superuser}")
    
def fix_joao_password():
    print("\n=== FIXING JOAO PASSWORD ===")
    try:
        joao = User.objects.get(username='Joao')
        joao.set_password('password123')  # Simple password for testing
        joao.save()
        print(f"✅ Updated Joao's password to 'password123'")
        return True
    except User.DoesNotExist:
        print("❌ User 'Joao' not found")
        
        # Check for similar usernames
        similar_users = User.objects.filter(username__icontains='joao')
        if similar_users.exists():
            print("Found similar usernames:")
            for user in similar_users:
                print(f"  - {user.username}")
        return False

def check_joao_sites():
    print("\n=== CHECKING JOAO'S SITES ===")
    try:
        joao = User.objects.get(username='Joao')
        joao_sites = SiteProject.objects.filter(owner=joao)
        
        print(f"Joao owns {joao_sites.count()} sites:")
        for site in joao_sites:
            print(f"  - {site.name} (slug: {site.slug})")
            
        return joao_sites.count()
    except User.DoesNotExist:
        print("❌ User 'Joao' not found")
        return 0

if __name__ == "__main__":
    check_users()
    if fix_joao_password():
        check_joao_sites()
        print(f"\n✅ Try logging in with:")
        print(f"   Username: Joao")
        print(f"   Password: password123")