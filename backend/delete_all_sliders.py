#!/usr/bin/env python
"""
Delete ALL sliders from the JCW project - both old and new systems.
This will completely clean up the slider system.
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import HomepageSlider, HomepageSlide
from main_site.models import MainSlider, MainSlide

def delete_all_sliders():
    print("🗑️  DELETING ALL SLIDERS")
    print("=" * 50)
    
    # Count existing data
    old_sliders = HomepageSlider.objects.count()
    old_slides = HomepageSlide.objects.count()
    new_sliders = MainSlider.objects.count()
    new_slides = MainSlide.objects.count()
    
    print(f"📊 Current counts:")
    print(f"   Old HomepageSliders: {old_sliders}")
    print(f"   Old HomepageSlides: {old_slides}")
    print(f"   New MainSliders: {new_sliders}")
    print(f"   New MainSlides: {new_slides}")
    print()
    
    # Delete old system sliders
    if old_slides > 0:
        print("🗑️  Deleting old HomepageSlides...")
        deleted_slides = HomepageSlide.objects.all().delete()
        print(f"✅ Deleted {deleted_slides[0]} HomepageSlides")
    
    if old_sliders > 0:
        print("🗑️  Deleting old HomepageSliders...")
        deleted_sliders = HomepageSlider.objects.all().delete()
        print(f"✅ Deleted {deleted_sliders[0]} HomepageSliders")
    
    # Delete new system sliders
    if new_slides > 0:
        print("🗑️  Deleting new MainSlides...")
        deleted_main_slides = MainSlide.objects.all().delete()
        print(f"✅ Deleted {deleted_main_slides[0]} MainSlides")
    
    if new_sliders > 0:
        print("🗑️  Deleting new MainSliders...")
        deleted_main_sliders = MainSlider.objects.all().delete()
        print(f"✅ Deleted {deleted_main_sliders[0]} MainSliders")
    
    print("\n✅ ALL SLIDERS DELETED")
    
    # Verify deletion
    print(f"\n📊 Final counts:")
    print(f"   Old HomepageSliders: {HomepageSlider.objects.count()}")
    print(f"   Old HomepageSlides: {HomepageSlide.objects.count()}")
    print(f"   New MainSliders: {MainSlider.objects.count()}")
    print(f"   New MainSlides: {MainSlide.objects.count()}")

if __name__ == "__main__":
    delete_all_sliders()