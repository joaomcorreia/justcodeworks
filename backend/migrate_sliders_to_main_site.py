#!/usr/bin/env python3
"""
Migrate homepage sliders from sites app to main_site app for the HQ website
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, HomepageSlider, HomepageSlide
from main_site.models import MainSlider, MainSlide


def migrate_hq_sliders():
    """Migrate HQ sliders from sites app to main_site app"""
    
    print("🎬 Migrating HQ Sliders from sites to main_site app\n")
    
    # Get HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if not hq_project:
        print("❌ No HQ project found!")
        return
    
    print(f"🎯 HQ Project: {hq_project.name}")
    
    # Find HQ sliders in the sites app
    hq_sliders = HomepageSlider.objects.filter(site_project=hq_project)
    
    print(f"📊 Found {hq_sliders.count()} HQ sliders to migrate")
    
    if not hq_sliders.exists():
        print("ℹ️ No HQ sliders found to migrate")
        return
    
    migrated_count = 0
    
    for old_slider in hq_sliders:
        print(f"\n🎥 Migrating slider: {old_slider.name}")
        
        # Check if slider already exists in main_site
        existing = MainSlider.objects.filter(slug=old_slider.slug).first()
        
        if existing:
            print(f"  ⚠️ Slider with slug '{old_slider.slug}' already exists in main_site")
            continue
        
        # Create new MainSlider
        new_slider = MainSlider.objects.create(
            name=old_slider.name,
            slug=old_slider.slug,
            is_active=old_slider.is_active,
            auto_play=old_slider.auto_play,
            auto_play_interval=old_slider.auto_play_interval,
            show_navigation=old_slider.show_navigation,
            show_pagination=old_slider.show_pagination,
            
            # Particle settings
            particles_enabled=old_slider.particles_enabled,
            particles_density=old_slider.particles_density,
            particles_speed=old_slider.particles_speed,
            particles_size_min=old_slider.particles_size_min,
            particles_size_max=old_slider.particles_size_max,
            particles_color=old_slider.particles_color,
            particles_colors=old_slider.particles_colors or "",
            particles_opacity=old_slider.particles_opacity,
            particles_multi_color=old_slider.particles_multi_color,
            
            # Background settings
            background_type=old_slider.background_type,
            gradient_from=old_slider.gradient_from,
            gradient_to=old_slider.gradient_to,
            gradient_direction=old_slider.gradient_direction,
            background_image=old_slider.background_image,
            background_video=old_slider.background_video,
            background_overlay_opacity=old_slider.background_overlay_opacity,
        )
        
        print(f"  ✅ Created MainSlider: {new_slider.name}")
        
        # Migrate all slides for this slider
        old_slides = HomepageSlide.objects.filter(slider=old_slider).order_by('order')
        slide_count = 0
        
        for old_slide in old_slides:
            new_slide = MainSlide.objects.create(
                slider=new_slider,
                title=old_slide.title,
                subtitle=old_slide.subtitle,
                content=old_slide.content,
                
                # CTA buttons
                primary_cta_text=old_slide.primary_cta_text,
                primary_cta_url=old_slide.primary_cta_url,
                secondary_cta_text=old_slide.secondary_cta_text,
                secondary_cta_url=old_slide.secondary_cta_url,
                
                # Styling
                text_color=old_slide.text_color,
                text_alignment=old_slide.text_alignment,
                
                # Media
                slide_image=old_slide.slide_image,
                slide_video=old_slide.slide_video,
                
                # Display
                order=old_slide.order,
                is_active=old_slide.is_active,
                animation_type=old_slide.animation_type,
            )
            slide_count += 1
            print(f"    📄 Migrated slide: {new_slide.title}")
        
        print(f"  📊 Migrated {slide_count} slides")
        migrated_count += 1
    
    print(f"\n✅ Migration complete! Migrated {migrated_count} sliders to main_site app")
    
    # Show new admin URL
    if migrated_count > 0:
        print(f"\n🔗 New Admin URL: http://localhost:8000/admin/main_site/mainslider/")
        
        # List migrated sliders
        main_sliders = MainSlider.objects.all()
        if main_sliders.exists():
            print(f"\n📋 Main Website Sliders:")
            for slider in main_sliders:
                slides_count = slider.slides.count()
                print(f"  🎥 {slider.name} ({slider.slug}) - {slides_count} slides")
                print(f"     Admin: http://localhost:8000/admin/main_site/mainslider/{slider.pk}/change/")
    
    return migrated_count


def verify_migration():
    """Verify the migration was successful"""
    
    print("\n🔍 Verifying migration...")
    
    # Check main_site sliders
    main_sliders = MainSlider.objects.all()
    print(f"📊 MainSlider count: {main_sliders.count()}")
    
    for slider in main_sliders:
        slides_count = slider.slides.count()
        print(f"  🎥 {slider.name}: {slides_count} slides")
        for slide in slider.slides.all()[:2]:  # Show first 2 slides
            print(f"    - {slide.title}")
    
    # Check if old HQ sliders still exist
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    if hq_project:
        old_hq_sliders = HomepageSlider.objects.filter(site_project=hq_project)
        if old_hq_sliders.exists():
            print(f"\n⚠️ Note: {old_hq_sliders.count()} old HQ sliders still exist in sites app")
            print("   Consider removing them after verifying the migration works correctly")
        else:
            print(f"\n✅ No old HQ sliders remain in sites app")


if __name__ == '__main__':
    try:
        migrated_count = migrate_hq_sliders()
        verify_migration()
        
        if migrated_count > 0:
            print(f"\n🎉 Success! Migrated {migrated_count} sliders to main_site app")
            print(f"🔗 Visit: http://localhost:8000/admin/main_site/mainslider/")
        else:
            print(f"\n✅ No migration needed")
            
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        import traceback
        traceback.print_exc()