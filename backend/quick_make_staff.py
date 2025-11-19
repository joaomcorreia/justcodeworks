#!/usr/bin/env python
"""
Quick fix: Make a specific user staff to resolve particle settings 403 error.
Run this if you want to keep using your current user account.
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User

# Common users who might need staff access
likely_users = ['User1', 'joeclark@mail.com', 'mary_restaurant']

print("🛠️ QUICK STAFF PROMOTION")
print("=" * 25)
print("This will make a user 'staff' so they can save particle settings.")
print("\nLikely candidates:")
for username in likely_users:
    try:
        user = User.objects.get(username=username)
        status = "✅ STAFF" if user.is_staff else "❌ Not Staff"
        print(f"   {username} - {status}")
    except User.DoesNotExist:
        print(f"   {username} - Not found")

username = input("\nEnter username to make staff: ").strip()

try:
    user = User.objects.get(username=username)
    if user.is_staff:
        print(f"✅ {username} is already staff!")
    else:
        user.is_staff = True
        user.save()
        print(f"✅ {username} is now STAFF!")
        print(f"🔄 User needs to logout/login for changes to take effect")
        print(f"🎯 Particle settings should now work for this user")
except User.DoesNotExist:
    print(f"❌ User '{username}' not found")