#!/usr/bin/env python
"""
Restore HQ homepage slider that was deleted
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, HomepageSlider, HomepageSlide

def restore_hq_homepage_slider():
    """Restore the homepage slider for HQ website"""
    
    print("🎬 Restoring JustCodeWorks HQ Homepage Slider\n")
    
    # Get HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if not hq_project:
        print("❌ No HQ project found! Please create HQ project first.")
        return
    
    print(f"🎯 HQ Project: {hq_project.name}")
    
    # Create the homepage slider with darker blue gradient
    slider, created = HomepageSlider.objects.get_or_create(
        slug='hq-homepage-hero',
        defaults={
            'name': 'JustCodeWorks HQ Homepage Hero',
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
            
            # Darker blue gradient
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
    
    # Slide 1: Professional Website Development
    slide1, slide1_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=0,
        defaults={
            'title': 'Everything you need to get your business online',
            'subtitle': 'Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.',
            'content': 'Launch a modern website, order your print materials, connect simple POS tools and let your AI assistant do the heavy lifting – all from one place.',
            
            # CTA Buttons
            'primary_cta_text': 'Start in 2 minutes',
            'primary_cta_url': '/dashboard',
            'secondary_cta_text': 'View demo website',
            'secondary_cta_url': '/sites/marys-restaurant',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'fade',
            'is_active': True,
        }
    )
    
    if slide1_created:
        print(f"✅ Created slide 1: {slide1.title}")
    else:
        print(f"ℹ️ Slide 1 already exists: {slide1.title}")
    
    # Slide 2: Professional Website Development
    slide2, slide2_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=1,
        defaults={
            'title': 'Professional Website Development',
            'subtitle': 'We build modern, fast, and beautiful websites for your business',
            'content': 'Get a custom website that works perfectly on all devices and helps you grow your business online.',
            
            # CTA Buttons
            'primary_cta_text': 'Create Website',
            'primary_cta_url': '/websites',
            'secondary_cta_text': 'View Templates',
            'secondary_cta_url': '/templates',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'slide',
            'is_active': True,
        }
    )
    
    if slide2_created:
        print(f"✅ Created slide 2: {slide2.title}")
    else:
        print(f"ℹ️ Slide 2 already exists: {slide2.title}")
    
    # Slide 3: Print Lab Services
    slide3, slide3_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=2,
        defaults={
            'title': 'Professional Print Lab',
            'subtitle': 'High-quality business cards, flyers, brochures, and marketing materials',
            'content': 'From business cards to large format printing, we deliver professional quality prints that make your business look its best.',
            
            # CTA Buttons
            'primary_cta_text': 'Order Prints',
            'primary_cta_url': '/print-lab',
            'secondary_cta_text': 'View Samples',
            'secondary_cta_url': '/print-lab#samples',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'fade',
            'is_active': True,
        }
    )
    
    if slide3_created:
        print(f"✅ Created slide 3: {slide3.title}")
    else:
        print(f"ℹ️ Slide 3 already exists: {slide3.title}")
    
    # Slide 4: POS Systems
    slide4, slide4_created = HomepageSlide.objects.get_or_create(
        slider=slider,
        order=3,
        defaults={
            'title': 'Modern Point of Sale Systems',
            'subtitle': 'Complete retail and restaurant POS solutions that grow with your business',
            'content': 'Streamline your operations with our intuitive POS systems. Perfect for retail stores, restaurants, and service businesses.',
            
            # CTA Buttons
            'primary_cta_text': 'Get POS System',
            'primary_cta_url': '/pos-systems',
            'secondary_cta_text': 'Schedule Demo',
            'secondary_cta_url': '/pos-systems#demo',
            
            # Styling
            'text_color': '#ffffff',
            'text_alignment': 'center',
            'animation_type': 'slide',
            'is_active': True,
        }
    )
    
    if slide4_created:
        print(f"✅ Created slide 4: {slide4.title}")
    else:
        print(f"ℹ️ Slide 4 already exists: {slide4.title}")
    
    # Show configuration summary
    print(f"\n🎨 Slider Configuration:")
    print(f"   • Name: {slider.name}")
    print(f"   • Slug: {slider.slug}")
    print(f"   • Project: {slider.site_project.name} ({slider.site_project.get_site_type_display()})")
    print(f"   • Active: {slider.is_active}")
    print(f"   • Auto Play: {slider.auto_play} ({slider.auto_play_interval}ms)")
    print(f"   • Particles: {'Enabled' if slider.particles_enabled else 'Disabled'}")
    print(f"   • Particle Density: {slider.particles_density}")
    print(f"   • Particle Speed: {slider.particles_speed}")
    print(f"   • Gradient: {slider.gradient_from} to {slider.gradient_to}")
    print(f"   • Direction: {slider.gradient_direction}")
    
    # Show slides
    slides = HomepageSlide.objects.filter(slider=slider, is_active=True).order_by('order')
    print(f"\n📊 Active Slides ({slides.count()} total):")
    for slide in slides:
        print(f"   {slide.order + 1}. {slide.title}")
        print(f"      Subtitle: {slide.subtitle}")
        print(f"      Primary CTA: {slide.primary_cta_text} → {slide.primary_cta_url}")
        print(f"      Secondary CTA: {slide.secondary_cta_text} → {slide.secondary_cta_url}")
    
    print(f"\n🔗 Admin URL: http://127.0.0.1:8000/admin/sites/homepageslider/{slider.pk}/change/")
    
    return {
        'slider': slider,
        'slides_count': slides.count(),
        'created': created
    }

if __name__ == '__main__':
    try:
        results = restore_hq_homepage_slider()
        print(f"\n✅ Successfully restored HQ homepage slider with {results['slides_count']} slides!")
    except Exception as e:
        print(f"❌ Error restoring slider: {e}")
        import traceback
        traceback.print_exc()