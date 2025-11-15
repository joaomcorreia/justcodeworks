#!/usr/bin/env python
"""
Template Section Classification Seeding Script

This script creates a comprehensive set of template sections with proper classification:
- section_type: Categorizes sections by purpose (hero, about, menu, etc.)
- min_plan: Sets minimum subscription tier (free, paid, premium)
- is_interactive: Flags sections requiring user interaction

Usage:
    cd C:\projects\justcodeworks\backend
    python seed_template_sections.py
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, TemplateSection

def seed_template_sections():
    """Create classified template sections for different templates and use cases."""
    
    print("🌱 Starting Template Section Classification Seeding...")
    
    # Get the jcw-main template (our primary template)
    try:
        jcw_main = SiteTemplate.objects.get(key='jcw-main')
        print(f"✅ Found template: {jcw_main.name}")
    except SiteTemplate.DoesNotExist:
        print("❌ Error: 'jcw-main' template not found. Please create it first.")
        return
    
    # Define comprehensive section classifications
    sections_data = [
        # Hero sections - Free tier
        {
            'internal_name': 'Modern Hero Banner',
            'code': 'hero_modern',
            'section_type': 'hero',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Header',
            'variant_index': 1,
            'default_order': 1,
            'notes': 'Clean modern hero with large typography and call-to-action'
        },
        {
            'internal_name': 'Video Background Hero',
            'code': 'hero_video',
            'section_type': 'hero',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Header',
            'variant_index': 2,
            'default_order': 1,
            'notes': 'Hero section with video background and interactive controls'
        },
        {
            'internal_name': 'Premium Animated Hero',
            'code': 'hero_animated',
            'section_type': 'hero',
            'min_plan': 'premium',
            'is_interactive': True,
            'group': 'Header',
            'variant_index': 3,
            'default_order': 1,
            'notes': 'Advanced hero with animations and premium interactions'
        },
        
        # Navigation sections
        {
            'internal_name': 'Standard Navigation Bar',
            'code': 'nav_standard',
            'section_type': 'navigation',
            'min_plan': 'free',
            'is_interactive': True,
            'group': 'Navigation',
            'variant_index': 1,
            'default_order': 0,
            'notes': 'Basic responsive navigation with menu toggle'
        },
        {
            'internal_name': 'Premium Mega Menu',
            'code': 'nav_mega',
            'section_type': 'navigation',
            'min_plan': 'premium',
            'is_interactive': True,
            'group': 'Navigation',
            'variant_index': 2,
            'default_order': 0,
            'notes': 'Advanced mega menu with dropdowns and search'
        },
        
        # About sections
        {
            'internal_name': 'Simple About Text',
            'code': 'about_simple',
            'section_type': 'about',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Content',
            'variant_index': 1,
            'default_order': 2,
            'notes': 'Basic text-based about section'
        },
        {
            'internal_name': 'About with Team Grid',
            'code': 'about_team',
            'section_type': 'about',
            'min_plan': 'paid',
            'is_interactive': False,
            'group': 'Content',
            'variant_index': 2,
            'default_order': 2,
            'notes': 'About section with team member grid layout'
        },
        
        # Menu/Services sections
        {
            'internal_name': 'Basic Menu List',
            'code': 'menu_basic',
            'section_type': 'menu',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Restaurant',
            'variant_index': 1,
            'default_order': 3,
            'notes': 'Simple menu items in list format'
        },
        {
            'internal_name': 'Interactive Menu Cards',
            'code': 'menu_cards',
            'section_type': 'menu',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Restaurant',
            'variant_index': 2,
            'default_order': 3,
            'notes': 'Menu with interactive cards and filtering'
        },
        
        # Gallery sections
        {
            'internal_name': 'Simple Photo Grid',
            'code': 'gallery_grid',
            'section_type': 'gallery',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Media',
            'variant_index': 1,
            'default_order': 4,
            'notes': 'Basic responsive photo grid'
        },
        {
            'internal_name': 'Interactive Lightbox Gallery',
            'code': 'gallery_lightbox',
            'section_type': 'gallery',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Media',
            'variant_index': 2,
            'default_order': 4,
            'notes': 'Gallery with lightbox and image navigation'
        },
        
        # Contact/Form sections
        {
            'internal_name': 'Basic Contact Info',
            'code': 'contact_info',
            'section_type': 'contact',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Contact',
            'variant_index': 1,
            'default_order': 8,
            'notes': 'Simple contact information display'
        },
        {
            'internal_name': 'Contact Form',
            'code': 'contact_form',
            'section_type': 'forms',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Contact',
            'variant_index': 1,
            'default_order': 8,
            'notes': 'Interactive contact form with validation'
        },
        {
            'internal_name': 'Advanced Booking Form',
            'code': 'booking_advanced',
            'section_type': 'forms',
            'min_plan': 'premium',
            'is_interactive': True,
            'group': 'Booking',
            'variant_index': 1,
            'default_order': 7,
            'notes': 'Complex booking form with date picker and payment'
        },
        
        # Pricing sections
        {
            'internal_name': 'Simple Pricing Table',
            'code': 'pricing_simple',
            'section_type': 'pricing',
            'min_plan': 'paid',
            'is_interactive': False,
            'group': 'Commercial',
            'variant_index': 1,
            'default_order': 5,
            'notes': 'Basic pricing table for services'
        },
        {
            'internal_name': 'Interactive Pricing Calculator',
            'code': 'pricing_calculator',
            'section_type': 'pricing',
            'min_plan': 'premium',
            'is_interactive': True,
            'group': 'Commercial',
            'variant_index': 2,
            'default_order': 5,
            'notes': 'Dynamic pricing calculator with options'
        },
        
        # Testimonials
        {
            'internal_name': 'Basic Testimonials',
            'code': 'testimonials_basic',
            'section_type': 'testimonials',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Social Proof',
            'variant_index': 1,
            'default_order': 6,
            'notes': 'Simple testimonials display'
        },
        {
            'internal_name': 'Carousel Testimonials',
            'code': 'testimonials_carousel',
            'section_type': 'testimonials',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Social Proof',
            'variant_index': 2,
            'default_order': 6,
            'notes': 'Interactive testimonials carousel'
        },
        
        # Footer sections
        {
            'internal_name': 'Simple Footer',
            'code': 'footer_simple',
            'section_type': 'footer',
            'min_plan': 'free',
            'is_interactive': False,
            'group': 'Footer',
            'variant_index': 1,
            'default_order': 99,
            'notes': 'Basic footer with links and copyright'
        },
        {
            'internal_name': 'Rich Footer with Newsletter',
            'code': 'footer_rich',
            'section_type': 'footer',
            'min_plan': 'paid',
            'is_interactive': True,
            'group': 'Footer',
            'variant_index': 2,
            'default_order': 99,
            'notes': 'Enhanced footer with newsletter signup'
        },
    ]
    
    # Create or update sections
    created_count = 0
    updated_count = 0
    
    for section_data in sections_data:
        section, created = TemplateSection.objects.update_or_create(
            site_template=jcw_main,
            code=section_data['code'],
            defaults={
                'internal_name': section_data['internal_name'],
                'section_type': section_data['section_type'],
                'min_plan': section_data['min_plan'],
                'is_interactive': section_data['is_interactive'],
                'group': section_data['group'],
                'variant_index': section_data['variant_index'],
                'default_order': section_data['default_order'],
                'notes': section_data['notes'],
                'is_active': True,
            }
        )
        
        if created:
            created_count += 1
            print(f"✅ Created: {section.internal_name} ({section.section_type}, {section.min_plan})")
        else:
            updated_count += 1
            print(f"🔄 Updated: {section.internal_name} ({section.section_type}, {section.min_plan})")
    
    print(f"\n🎉 Seeding Complete!")
    print(f"   Created: {created_count} sections")
    print(f"   Updated: {updated_count} sections")
    print(f"   Total: {len(sections_data)} classified sections")
    
    # Show distribution by plan
    free_count = TemplateSection.objects.filter(site_template=jcw_main, min_plan='free').count()
    paid_count = TemplateSection.objects.filter(site_template=jcw_main, min_plan='paid').count()
    premium_count = TemplateSection.objects.filter(site_template=jcw_main, min_plan='premium').count()
    interactive_count = TemplateSection.objects.filter(site_template=jcw_main, is_interactive=True).count()
    
    print(f"\n📊 Plan Distribution:")
    print(f"   Free: {free_count} sections")
    print(f"   Paid: {paid_count} sections") 
    print(f"   Premium: {premium_count} sections")
    print(f"   Interactive: {interactive_count} sections")
    
    print(f"\n🔗 View in admin: http://localhost:8000/admin/sites/templatesection/")
    print(f"🔗 API endpoint: http://localhost:8000/api/admin/templates/jcw-main/sections/")

if __name__ == '__main__':
    seed_template_sections()