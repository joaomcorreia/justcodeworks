#!/usr/bin/env python3
"""Check and fix user-site assignments to ensure each user sees their own content"""
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

def check_assignments():
    print("=== CURRENT USER-SITE ASSIGNMENTS ===")
    
    # Get all users and their sites
    users = User.objects.all()
    for user in users:
        print(f"\nUser: {user.username} (ID: {user.id})")
        sites = SiteProject.objects.filter(owner=user)
        if sites:
            for site in sites:
                print(f"  - Site: {site.name} (Slug: {site.slug}) - Template: {site.site_template.name if site.site_template else 'None'}")
        else:
            print("  - No sites assigned")
    
    print("\n=== ANALYZING EXPECTED ASSIGNMENTS ===")
    
    # Expected mappings based on our setup
    expected_mappings = {
        'Joao': ['Joe\'s Tire Center', 'Just Code Works'],  # Main user should have JCW + Joe's
        'mary': ['Mary\'s Restaurant'],  # Mary should have restaurant
    }
    
    issues = []
    
    for username, expected_sites in expected_mappings.items():
        try:
            user = User.objects.get(username=username)
            actual_sites = list(SiteProject.objects.filter(owner=user).values_list('name', flat=True))
            
            print(f"\nUser '{username}':")
            print(f"  Expected: {expected_sites}")
            print(f"  Actual: {actual_sites}")
            
            # Check for missing or extra sites
            missing = set(expected_sites) - set(actual_sites)
            extra = set(actual_sites) - set(expected_sites)
            
            if missing:
                print(f"  MISSING: {missing}")
                issues.append(f"User '{username}' missing sites: {missing}")
            if extra:
                print(f"  EXTRA: {extra}")
                issues.append(f"User '{username}' has extra sites: {extra}")
                
        except User.DoesNotExist:
            print(f"\nUser '{username}' does not exist!")
            issues.append(f"User '{username}' not found")
    
    return issues

def fix_assignments():
    print("\n=== FIXING SITE ASSIGNMENTS ===")
    
    with transaction.atomic():
        # Get users
        try:
            joao = User.objects.get(username='Joao')
            mary = User.objects.get(username='mary')
        except User.DoesNotExist as e:
            print(f"Error: User not found - {e}")
            return False
        
        # Get sites by name
        sites = {}
        site_names = ['Joe\'s Tire Center', 'Mary\'s Restaurant', 'Just Code Works']
        for name in site_names:
            try:
                site = SiteProject.objects.get(name=name)
                sites[name] = site
                print(f"Found site: {name} (current owner: {site.owner.username})")
            except SiteProject.DoesNotExist:
                print(f"Warning: Site '{name}' not found")
        
        # Fix assignments
        changes_made = False
        
        # Assign Joe's Tire Center to Joao
        if 'Joe\'s Tire Center' in sites:
            joes_site = sites['Joe\'s Tire Center']
            if joes_site.owner != joao:
                print(f"Assigning 'Joe's Tire Center' to Joao (was {joes_site.owner.username})")
                joes_site.owner = joao
                joes_site.save()
                changes_made = True
        
        # Assign Mary's Restaurant to Mary
        if 'Mary\'s Restaurant' in sites:
            marys_site = sites['Mary\'s Restaurant']
            if marys_site.owner != mary:
                print(f"Assigning 'Mary's Restaurant' to mary (was {marys_site.owner.username})")
                marys_site.owner = mary
                marys_site.save()
                changes_made = True
        
        # Assign Just Code Works to Joao
        if 'Just Code Works' in sites:
            jcw_site = sites['Just Code Works']
            if jcw_site.owner != joao:
                print(f"Assigning 'Just Code Works' to Joao (was {jcw_site.owner.username})")
                jcw_site.owner = joao
                jcw_site.save()
                changes_made = True
        
        if changes_made:
            print("Site assignments have been corrected!")
        else:
            print("No changes needed - assignments are correct")
        
        return True

def check_dashboard_logic():
    print("\n=== CHECKING DASHBOARD LOGIC ===")
    
    # Check what happens when Joao logs in
    joao = User.objects.get(username='Joao')
    joao_sites = SiteProject.objects.filter(owner=joao)
    
    print(f"When user 'Joao' accesses dashboard:")
    print(f"  - Has {joao_sites.count()} sites")
    for site in joao_sites:
        print(f"    * {site.name} (slug: {site.slug})")
    
    # The dashboard should show the first site or a specific one
    if joao_sites.exists():
        first_site = joao_sites.first()
        print(f"  - Dashboard should show: {first_site.name}")
        print(f"  - Site slug for URLs: {first_site.slug}")

if __name__ == "__main__":
    print("Checking user-site assignments...")
    
    # Step 1: Check current state
    issues = check_assignments()
    
    if issues:
        print(f"\n{len(issues)} issues found:")
        for issue in issues:
            print(f"  - {issue}")
        
        # Step 2: Fix assignments
        if fix_assignments():
            print("\nRe-checking after fixes...")
            new_issues = check_assignments()
            if not new_issues:
                print("✅ All assignments corrected!")
            else:
                print(f"❌ Still have {len(new_issues)} issues")
        
    else:
        print("✅ No assignment issues found")
    
    # Step 3: Check dashboard logic
    check_dashboard_logic()
    
    print("\n=== SUMMARY ===")
    print("Each user should now see their own content in the dashboard:")
    print("- Joao: Joe's Tire Center or Just Code Works")
    print("- Mary: Mary's Restaurant")