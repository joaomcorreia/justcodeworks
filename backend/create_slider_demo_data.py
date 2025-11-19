#!/usr/bin/env python
"""
Create test data to demonstrate the separation between Main Website and Tenant sliders
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import MainWebsiteSlider, MainWebsiteSlide, HomepageSlider, HomepageSlide, SiteProject

def create_main_website_slider():
    """Create a slider for the main JustCodeWorks website"""
    
    # Create main website slider
    main_slider, created = MainWebsiteSlider.objects.get_or_create(
        slug='jcw-hero-slider',
        defaults={
            'name': '🏢 JCW Main Hero Slider',
            'is_active': True,
            'auto_play': True,
            'auto_play_interval': 6000,
            'particles_enabled': True,
            'particles_density': 120,
            'gradient_from': '#1e40af',
            'gradient_to': '#3b82f6',
        }
    )
    
    if created:
        print(f"✅ Created main website slider: {main_slider.name}")
        
        # Create slides for main website
        slides_data = [
            {
                'title': 'Everything Connected: Website, Print & AI',
                'subtitle': 'Launch a modern website, order your print materials, and let AI do the heavy lifting',
                'primary_cta_text': 'Start Building',
                'primary_cta_url': '/builder/',
                'order': 1
            },
            {
                'title': 'Perfect for Small Businesses',
                'subtitle': 'No technical skills needed. Perfect for freelancers, local shops, and growing businesses.',
                'primary_cta_text': 'See Demo',
                'primary_cta_url': '/demo/',
                'order': 2
            },
            {
                'title': 'AI-Powered Content Creation',
                'subtitle': 'Generate professional content, images, and layouts with our MagicAI tools.',
                'primary_cta_text': 'Try AI Tools',
                'primary_cta_url': '/ai-tools/',
                'order': 3
            }
        ]
        
        for slide_data in slides_data:
            slide = MainWebsiteSlide.objects.create(
                slider=main_slider,
                **slide_data
            )
            print(f"  📄 Created slide: {slide.title}")
    else:
        print(f"🔄 Main website slider already exists: {main_slider.name}")

def create_tenant_example():
    """Create an example tenant slider to show the separation"""
    
    # Find or create a tenant project
    from django.contrib.auth.models import User
    
    # Get a user to own the project (use the first superuser if available)
    try:
        owner = User.objects.filter(is_superuser=True).first()
        if not owner:
            owner = User.objects.create_superuser('demo', 'demo@example.com', 'demo123')
    except:
        owner = User.objects.first()
    
    tenant_project, created = SiteProject.objects.get_or_create(
        slug='marys-restaurant',
        defaults={
            'name': "Mary's Restaurant",
            'owner': owner,
            'business_type': "Restaurant",
            'is_headquarters': False,  # This is a tenant, not main website
        }
    )
    
    if created:
        print(f"✅ Created tenant project: {tenant_project.name}")
    
    # Create tenant slider
    tenant_slider, created = HomepageSlider.objects.get_or_create(
        slug='marys-hero-slider',
        defaults={
            'name': "Mary's Hero Slider",
            'site_project': tenant_project,
            'is_active': True,
            'auto_play': True,
            'particles_enabled': False,  # Different settings than main site
            'gradient_from': '#dc2626',
            'gradient_to': '#ef4444',
        }
    )
    
    if created:
        print(f"✅ Created tenant slider: {tenant_slider.name}")
        
        # Create tenant slide
        slide = HomepageSlide.objects.create(
            slider=tenant_slider,
            title="Welcome to Mary's Restaurant",
            subtitle="Authentic family recipes since 1985",
            primary_cta_text="View Menu",
            primary_cta_url="/menu/",
            order=1
        )
        print(f"  📄 Created tenant slide: {slide.title}")
    else:
        print(f"🔄 Tenant slider already exists: {tenant_slider.name}")

def main():
    print("🚀 Creating test data to demonstrate Main Website vs Tenant slider separation...\n")
    
    create_main_website_slider()
    print()
    create_tenant_example()
    print()
    
    print("✅ Test data created successfully!")
    print("\n📋 Summary:")
    print(f"🏢 Main Website Sliders: {MainWebsiteSlider.objects.count()}")
    print(f"🏢 Main Website Slides: {MainWebsiteSlide.objects.count()}")
    print(f"👤 Tenant Sliders: {HomepageSlider.objects.count()}")
    print(f"👤 Tenant Slides: {HomepageSlide.objects.count()}")
    print()
    print("🔗 Admin URLs:")
    print("🏢 Main Website Sliders: http://localhost:8000/admin/sites/mainwebsiteslider/")
    print("🏢 Main Website Slides: http://localhost:8000/admin/sites/mainwebsiteslide/")
    print("👤 Tenant Sliders: http://localhost:8000/admin/sites/homepageslider/")
    print("👤 Tenant Slides: http://localhost:8000/admin/sites/homepageslide/")

if __name__ == '__main__':
    main()