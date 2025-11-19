#!/usr/bin/env python
"""
Test script to verify particle settings API permissions and debug 403 Forbidden error.
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
from sites.models import SiteProject, HomepageSlider, HomepageSlide

def main():
    print("🔍 PARTICLE SETTINGS PERMISSION DEBUGGING")
    print("=" * 50)
    
    # Check HQ project exists
    try:
        hq_project = SiteProject.objects.get(is_headquarters=True)
        print(f"✅ HQ Project found: {hq_project.name} (ID: {hq_project.id})")
    except SiteProject.DoesNotExist:
        print("❌ HQ Project not found!")
        return
    
    # Check slider exists
    try:
        slider = HomepageSlider.objects.get(site_project=hq_project)
        print(f"✅ Homepage Slider found: {slider.name} (ID: {slider.id})")
        print(f"   Slug: {slider.slug}")
        print(f"   Particles enabled: {slider.particles_enabled}")
        print(f"   Particles density: {slider.particles_density}")
        print(f"   Particles speed: {slider.particles_speed}")
    except HomepageSlider.DoesNotExist:
        print("❌ Homepage Slider not found!")
        return
    
    print("\n📊 USER PERMISSIONS ANALYSIS")
    print("-" * 30)
    
    # Check all users and their permissions
    users = User.objects.all()
    if not users:
        print("❌ No users found in database!")
        return
    
    for user in users:
        print(f"\n👤 User: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Is Active: {user.is_active}")
        print(f"   Is Staff: {user.is_staff}")
        print(f"   Is Superuser: {user.is_superuser}")
        print(f"   Last Login: {user.last_login}")
        
        # Check what this user can do with slider API
        if user.is_active:
            if user.is_staff:
                print("   ✅ CAN modify sliders (staff privileges)")
            else:
                print("   ❌ CANNOT modify sliders (not staff)")
                print("      This user will get 403 Forbidden on particle settings updates!")
        else:
            print("   ❌ User is inactive")
    
    print("\n🔧 API ENDPOINT ANALYSIS")
    print("-" * 25)
    print("API URL: /api/homepage-sliders/")
    print("ViewSet: HomepageSliderViewSet")
    print("Permission Requirements:")
    print("  • GET (list/retrieve): AllowAny")
    print("  • POST/PUT/PATCH/DELETE: IsAuthenticated + is_staff=True")
    print("\n💡 SOLUTION: Current user needs 'is_staff=True' to save particle settings")
    
    # Check if we can promote a user to staff
    active_users = User.objects.filter(is_active=True, is_staff=False)
    if active_users:
        print(f"\n🛠️  QUICK FIX OPTIONS:")
        for user in active_users:
            print(f"   Option 1: Make {user.username} staff:")
            print(f"             user = User.objects.get(username='{user.username}')")
            print(f"             user.is_staff = True")
            print(f"             user.save()")
    
    print(f"\n   Option 2: Create admin user:")
    print(f"             python manage.py createsuperuser")
    
    print(f"\n   Option 3: Modify API permissions (not recommended)")

if __name__ == "__main__":
    main()