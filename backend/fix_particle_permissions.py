#!/usr/bin/env python
"""
Fix 403 Forbidden particle settings error by ensuring proper user permissions.
This script provides multiple solutions to resolve the permission issue.
"""
import os
import sys
import django
from django.conf import settings

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteProject, HomepageSlider

def main():
    print("🛠️ FIXING PARTICLE SETTINGS 403 FORBIDDEN ERROR")
    print("=" * 50)
    
    # Show current staff users (who CAN save particle settings)
    staff_users = User.objects.filter(is_active=True, is_staff=True)
    print("✅ EXISTING STAFF USERS (can save particle settings):")
    for user in staff_users:
        print(f"   👤 {user.username} - {user.email}")
        print(f"      Staff: {user.is_staff}, Superuser: {user.is_superuser}")
    
    # Show non-staff users (who get 403 Forbidden)
    non_staff_users = User.objects.filter(is_active=True, is_staff=False)
    print(f"\n❌ NON-STAFF USERS (get 403 Forbidden): {non_staff_users.count()} users")
    
    # Show the most likely candidates for fixing
    likely_users = ['User1', 'joeclark@mail.com', 'mary_restaurant']
    print(f"\n🎯 LIKELY USERS TO FIX:")
    
    for username in likely_users:
        try:
            user = User.objects.get(username=username)
            if not user.is_staff:
                print(f"   👤 {user.username} - Currently NOT staff")
        except User.DoesNotExist:
            continue
    
    print(f"\n📋 SOLUTION OPTIONS:")
    print(f"1. Use existing staff user (Recommended)")
    print(f"   - Login with: Joao, admin, teststaff, or stafftest")
    print(f"   - These users already have particle settings permissions")
    
    print(f"\n2. Make specific user staff (Quick fix)")
    print(f"   - Choose which user should have admin access to HQ")
    
    print(f"\n3. Create new HQ admin user")
    print(f"   - python manage.py createsuperuser")
    
    # Interactive choice
    print(f"\n🤔 Which solution would you like?")
    print(f"[1] Show staff user login credentials")
    print(f"[2] Make a user staff")
    print(f"[3] Exit (I'll handle it manually)")
    
    choice = input("Enter choice (1-3): ").strip()
    
    if choice == "1":
        print(f"\n🔑 STAFF USER LOGIN CREDENTIALS:")
        print(f"You can login with any of these existing staff users:")
        for user in staff_users[:5]:  # Show top 5
            print(f"\n   👤 Username: {user.username}")
            print(f"      Email: {user.email}")
            print(f"      Status: ✅ Staff (can save particle settings)")
            print(f"      Last login: {user.last_login}")
        
        print(f"\n💡 RECOMMENDED: Login as 'Joao' or 'admin' on the frontend")
        print(f"   These users have full permissions for HQ slider management.")
    
    elif choice == "2":
        print(f"\n👤 MAKE USER STAFF:")
        username = input("Enter username to make staff: ").strip()
        
        try:
            user = User.objects.get(username=username)
            if user.is_staff:
                print(f"   ✅ {username} is already staff!")
            else:
                user.is_staff = True
                user.save()
                print(f"   ✅ {username} is now staff and can save particle settings!")
                print(f"   🔄 User needs to login again for permissions to take effect")
        except User.DoesNotExist:
            print(f"   ❌ User '{username}' not found")
    
    elif choice == "3":
        print(f"   👍 Manual handling selected")
    
    else:
        print(f"   ❌ Invalid choice")
    
    print(f"\n🎯 SUMMARY:")
    print(f"The 403 Forbidden error occurs because particle settings require staff privileges.")
    print(f"Either use an existing staff user or promote the current user to staff.")
    print(f"HQ website management should use admin/staff accounts for security.")

if __name__ == "__main__":
    main()