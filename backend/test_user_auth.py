#!/usr/bin/env python3
"""
Check mary_restaurant user authentication
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

print("=== User Authentication Check ===")

# Check if mary_restaurant user exists
try:
    user = User.objects.get(username='mary_restaurant')
    print(f"✅ User found: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Active: {user.is_active}")
    print(f"   Staff: {user.is_staff}")
    print(f"   Superuser: {user.is_superuser}")
    print(f"   Last login: {user.last_login}")
except User.DoesNotExist:
    print("❌ User 'mary_restaurant' not found")
    # List all users
    users = User.objects.all()
    print(f"\nExisting users ({users.count()}):")
    for u in users:
        print(f"   - {u.username} ({u.email})")
    exit(1)

# Test authentication with the password
print(f"\n=== Testing Authentication ===")
test_password = "3934Ibanez"

authenticated_user = authenticate(username='mary_restaurant', password=test_password)
if authenticated_user:
    print(f"✅ Authentication SUCCESS with password '{test_password}'")
else:
    print(f"❌ Authentication FAILED with password '{test_password}'")
    
    # Try to reset the password
    print(f"\n=== Resetting Password ===")
    user.set_password(test_password)
    user.save()
    print(f"✅ Password reset to '{test_password}'")
    
    # Test again
    authenticated_user = authenticate(username='mary_restaurant', password=test_password)
    if authenticated_user:
        print(f"✅ Authentication SUCCESS after reset")
    else:
        print(f"❌ Authentication still FAILED after reset")