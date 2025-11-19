#!/usr/bin/env python
"""
Migrate slides from sites.HomepageSlide to main_site.MainSlide
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import HomepageSlide
from main_site.models import MainSlider, MainSlide

def migrate_slides():
    print("=== Migrating Homepage Slides ===")
    
    # Get the main slider
    try:
        main_slider = MainSlider.objects.get(slug='hq-homepage-hero')
        print(f"Found MainSlider: {main_slider.name}")
    except MainSlider.DoesNotExist:
        print("ERROR: MainSlider 'hq-homepage-hero' not found!")
        return
    
    # Get old slides
    old_slides = HomepageSlide.objects.filter(
        slider__name='JustCodeWorks HQ Homepage Hero'
    ).order_by('order')
    
    print(f"Found {old_slides.count()} old slides to migrate")
    
    # Clear existing MainSlides for this slider
    existing_count = MainSlide.objects.filter(slider=main_slider).count()
    print(f"Existing MainSlides: {existing_count}")
    
    if existing_count > 0:
        print("Clearing existing MainSlides...")
        MainSlide.objects.filter(slider=main_slider).delete()
    
    # Migrate each slide
    migrated_count = 0
    for old_slide in old_slides:
        # Map fields from HomepageSlide to MainSlide
        new_slide = MainSlide.objects.create(
            slider=main_slider,
            title=old_slide.title,
            subtitle=old_slide.subtitle or '',
            content=old_slide.content or '',
            
            # CTA mapping
            primary_cta_text=old_slide.primary_cta_text or '',
            primary_cta_url=old_slide.primary_cta_url or '',
            secondary_cta_text=old_slide.secondary_cta_text or '',
            secondary_cta_url=old_slide.secondary_cta_url or '',
            
            # Styling
            text_color=old_slide.text_color,
            text_alignment=old_slide.text_alignment,
            
            # Media (use correct field names)
            slide_image=old_slide.slide_image or '',
            slide_video=old_slide.slide_video or '',
            
            # Display
            order=old_slide.order,
            is_active=old_slide.is_active,
            
            # Animation
            animation_type=old_slide.animation_type,
        )
        
        print(f"✅ Migrated slide: {new_slide.title} (order: {new_slide.order})")
        migrated_count += 1
    
    print(f"\n✅ Successfully migrated {migrated_count} slides")
    
    # Verify
    final_count = MainSlide.objects.filter(slider=main_slider).count()
    print(f"Final MainSlide count: {final_count}")

if __name__ == "__main__":
    migrate_slides()