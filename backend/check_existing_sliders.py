#!/usr/bin/env python
"""
Check existing homepage sliders and restore HQ slider if needed
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, HomepageSlider, HomepageSlide

def check_existing_sliders():
    """Check what sliders currently exist"""
    
    print("🎬 Checking Homepage Sliders\n")
    
    # Get HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if not hq_project:
        print("❌ No HQ project found!")
        return
    
    print(f"🎯 HQ Project: {hq_project.name}")
    
    # Check all sliders
    all_sliders = HomepageSlider.objects.all()
    hq_sliders = HomepageSlider.objects.filter(site_project=hq_project)
    
    print(f"📊 Total Sliders: {all_sliders.count()}")
    print(f"🏢 HQ Sliders: {hq_sliders.count()}")
    
    if all_sliders.exists():
        print(f"\n--- All Sliders ---")
        for slider in all_sliders:
            slides_count = HomepageSlide.objects.filter(slider=slider).count()
            hq_status = "🏢 HQ" if slider.site_project.is_headquarters else "👤 Tenant"
            print(f"  {hq_status} {slider.name} ({slider.slug}) - {slides_count} slides")
            print(f"      Project: {slider.site_project.name}")
    
    if hq_sliders.exists():
        print(f"\n--- HQ Slider Details ---")
        for slider in hq_sliders:
            slides = HomepageSlide.objects.filter(slider=slider).order_by('order')
            print(f"  📽️ {slider.name}")
            print(f"     Slug: {slider.slug}")
            print(f"     Active: {slider.is_active}")
            print(f"     Auto-play: {slider.auto_play}")
            print(f"     Slides: {slides.count()}")
            
            for slide in slides:
                print(f"       {slide.order + 1}. {slide.title}")
                print(f"          Subtitle: {slide.subtitle}")
    else:
        print(f"\n❌ No HQ sliders found - needs restoration")
    
    return {
        'total_sliders': all_sliders.count(),
        'hq_sliders': hq_sliders.count(),
        'needs_restoration': hq_sliders.count() == 0
    }

if __name__ == '__main__':
    try:
        results = check_existing_sliders()
        if results['needs_restoration']:
            print(f"\n🔨 HQ slider restoration needed!")
        else:
            print(f"\n✅ HQ slider exists")
    except Exception as e:
        print(f"❌ Error checking sliders: {e}")
        import traceback
        traceback.print_exc()