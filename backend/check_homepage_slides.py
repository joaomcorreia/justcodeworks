#!/usr/bin/env python
"""
Check existing slides in the old HomepageSlide model
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import HomepageSlide
from main_site.models import MainSlider

def main():
    print("=== Checking existing HomepageSlides ===")
    slides = HomepageSlide.objects.all().select_related('slider')
    print(f"Found {slides.count()} slides:")
    
    for slide in slides:
        print(f"\nSlide ID: {slide.id}")
        print(f"  Title: {slide.title}")
        print(f"  Subtitle: {slide.subtitle}")
        print(f"  Slider: {slide.slider.name if slide.slider else 'None'}")
        print(f"  Order: {slide.order}")
        print(f"  Content: {slide.content}")
        print(f"  Is Active: {slide.is_active}")
        print(f"  Primary CTA: {slide.primary_cta_text}")
        print(f"  Primary CTA URL: {slide.primary_cta_url}")
        print(f"  Slide Image: {slide.slide_image}")
        print(f"  Animation: {slide.animation_type}")
        print(f"  Text Color: {slide.text_color}")
        print(f"  Text Alignment: {slide.text_alignment}")
    
    print("\n=== Checking MainSliders ===")
    main_sliders = MainSlider.objects.all()
    print(f"Found {main_sliders.count()} main sliders:")
    
    for slider in main_sliders:
        print(f"\nMainSlider: {slider.name} (slug: {slider.slug})")
        slides_count = slider.slides.count() if hasattr(slider, 'slides') else 0
        print(f"  Has {slides_count} slides")

if __name__ == "__main__":
    main()