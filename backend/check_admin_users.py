#!/usr/bin/env python
"""
Check admin users in the database
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User

def check_admin_users():
    print("Checking admin users in database...")
    
    # Get all staff users
    staff_users = User.objects.filter(is_staff=True)
    print(f"\nFound {len(staff_users)} staff users:")
    
    for user in staff_users:
        print(f"- ID: {user.id}")
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Is Staff: {user.is_staff}")
        print(f"  Is Superuser: {user.is_superuser}")
        print(f"  First Name: {user.first_name}")
        print(f"  Last Name: {user.last_name}")
        print()
    
    # If no staff users exist, create one
    if not staff_users.exists():
        print("No staff users found. Creating a test admin user...")
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='admin123',
            is_staff=True,
            is_superuser=True,
            first_name='Admin',
            last_name='User'
        )
        print(f"✓ Created admin user: {admin_user.username}")

if __name__ == "__main__":
    check_admin_users()