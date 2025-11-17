#!/usr/bin/env python3
"""
Create the first homepage slider with darker blue gradient and particle effects
for the HQ website homepage.
"""

import os
import django
import sys

# Add backend to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, HomepageSlider, HomepageSlide

def create_hq_homepage_slider():
    """Create the homepage slider for HQ website with darker blue gradient."""
    
    # Get the HQ project (assuming it exists)
    try:
        hq_project = SiteProject.objects.filter(name__icontains="justcodeworks").first()
        if not hq_project:
            hq_project = SiteProject.objects.filter(name__icontains="hq").first()
        if not hq_project:
            # Get the first project as fallback
            hq_project = SiteProject.objects.first()
        
        if not hq_project:
            print("❌ No site projects found. Please create a project first.")
            return
        
        print(f"🎯 Using project: {hq_project.name}")
        
    except Exception as e:
        print(f"❌ Error finding project: {e}")
        return
    
    # Create the homepage slider with darker blue gradient
    slider, created = HomepageSlider.objects.get_or_create(
        slug='hq-homepage-hero',
        defaults={
            'name': 'HQ Homepage Hero Slider',
            'site_project': hq_project,
            'is_active': True,
            'auto_play': True,
            'auto_play_interval': 6000,
            'show_navigation': True,
            'show_pagination': True,
            
            # Particle Effects (enabled)
            'particles_enabled': True,
            'particles_density': 120,
            'particles_speed': 1.2,
            'particles_size_min': 1,
            'particles_size_max': 4,
            'particles_color': '#ffffff',
            'particles_opacity': 0.7,
            
            # Darker blue gradient (was: from-blue-50 via-white to-purple-50)
            'background_type': 'gradient',
            'gradient_from': '#1e3a8a',  # Darker blue (blue-800)
            'gradient_to': '#7dd3fc',    # Sky blue (sky-300)
            'gradient_direction': 'to-br',
            
            'background_overlay_opacity': 0.1,
        }
    )
    
    if created:
        print(f"✅ Created homepage slider: {slider.name}")
    else:
        print(f"ℹ️ Homepage slider already exists: {slider.name}")
    
    # Create the first slide
    slide, slide_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=1,
        defaults={
            'title': 'Professional Website Development',
            'subtitle': 'We build modern, fast, and beautiful websites for your business',
            'content': 'Get a custom website that works perfectly on all devices and helps you grow your business online.',
            
            # CTA Buttons
            'primary_cta_text': 'Get Started',
            'primary_cta_url': '/contact',
            'secondary_cta_text': 'View Portfolio',
            'secondary_cta_url': '/portfolio',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'fade',
            'is_active': True,
        }
    )
    
    if slide_created:
        print(f"✅ Created slide: {slide.title}")
    else:
        print(f"ℹ️ Slide already exists: {slide.title}")
    
    # Create a second slide for variety
    slide2, slide2_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=2,
        defaults={
            'title': 'Fast & Reliable Solutions',
            'subtitle': 'Lightning-fast websites with modern technology',
            'content': 'Built with the latest web technologies for optimal performance and user experience.',
            
            # CTA Buttons
            'primary_cta_text': 'Learn More',
            'primary_cta_url': '/services',
            'secondary_cta_text': 'Contact Us',
            'secondary_cta_url': '/contact',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'slide',
            'is_active': True,
        }
    )
    
    if slide2_created:
        print(f"✅ Created second slide: {slide2.title}")
    else:
        print(f"ℹ️ Second slide already exists: {slide2.title}")
    
    print(f"\n🎨 Slider Configuration:")
    print(f"   • Name: {slider.name}")
    print(f"   • Particles: {'Enabled' if slider.particles_enabled else 'Disabled'}")
    print(f"   • Particle Density: {slider.particles_density}")
    print(f"   • Particle Speed: {slider.particles_speed}")
    print(f"   • Gradient: {slider.gradient_from} to {slider.gradient_to}")
    print(f"   • Direction: {slider.gradient_direction}")
    print(f"   • Auto Play: {slider.auto_play_interval}ms")
    
    print(f"\n📊 Slides: {slider.slides.count()} active slides")
    for s in slider.slides.filter(is_active=True).order_by('order'):
        print(f"   {s.order}. {s.title}")
    
    print(f"\n🔗 Admin URL: /admin/sites/homepageslider/{slider.pk}/change/")

if __name__ == "__main__":
    print("🚀 Creating HQ Homepage Slider with Darker Blue Gradient...")
    create_hq_homepage_slider()
    print("✨ Done!")