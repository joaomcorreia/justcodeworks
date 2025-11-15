#!/usr/bin/env python
"""
Simple test to create a Django superuser for testing
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_test_superuser():
    print("=== CREATE TEST SUPERUSER ===")
    
    # Check if Joao is superuser
    try:
        joao = User.objects.get(username="Joao")
        if not joao.is_superuser:
            joao.is_superuser = True
            joao.is_staff = True
            joao.save()
            print(f"✅ Made {joao.username} a superuser")
        else:
            print(f"✅ {joao.username} is already a superuser")
    except User.DoesNotExist:
        print("❌ User 'Joao' not found")
    
    # List all users with their status
    print("\n📋 All users:")
    users = User.objects.all()
    for user in users:
        status = []
        if user.is_superuser: status.append("superuser")
        if user.is_staff: status.append("staff")
        if user.is_active: status.append("active")
        print(f"  - {user.username}: {', '.join(status) if status else 'regular user'}")

if __name__ == "__main__":
    create_test_superuser()