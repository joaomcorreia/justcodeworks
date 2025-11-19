#!/usr/bin/env python
"""
Check if all slider-related components have been removed
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.db import connection
from sites.models import HomepageSlider, HomepageSlide

def check_slider_removal():
    print("🔍 CHECKING SLIDER REMOVAL STATUS")
    print("=" * 50)
    
    # Check database data
    old_sliders = HomepageSlider.objects.count()
    old_slides = HomepageSlide.objects.count()
    
    print(f"📊 Database Data:")
    print(f"   Old HomepageSliders: {old_sliders}")
    print(f"   Old HomepageSlides: {old_slides}")
    
    # Check database tables
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE '%slider%' OR name LIKE '%slide%')")
    tables = cursor.fetchall()
    
    print(f"\n📋 Database Tables:")
    if tables:
        for table in tables:
            print(f"   - {table[0]}")
    else:
        print("   No slider/slide tables found")
    
    # Check models
    try:
        from main_site.models import MainSlider
        print(f"\n⚠️  MainSlider model still exists!")
    except ImportError:
        print(f"\n✅ MainSlider model removed")
    
    try:
        from main_site.models import MainSlide
        print(f"⚠️  MainSlide model still exists!")
    except ImportError:
        print(f"✅ MainSlide model removed")
    
    print(f"\n{'✅ SLIDERS COMPLETELY REMOVED' if old_sliders == 0 and old_slides == 0 else '⚠️ SLIDERS STILL PRESENT'}")

if __name__ == "__main__":
    check_slider_removal()