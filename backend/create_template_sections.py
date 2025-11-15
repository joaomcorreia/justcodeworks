#!/usr/bin/env python3
"""
Create sample TemplateSection records for testing Template Lab.
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate, TemplateSection

def create_template_sections():
    """Create sample TemplateSection records."""
    
    # Get the restaurant-modern template
    try:
        restaurant_template = SiteTemplate.objects.get(key='restaurant-modern')
        print(f"Found template: {restaurant_template.name}")
    except SiteTemplate.DoesNotExist:
        print("❌ restaurant-modern template not found")
        return

    # Create sections for restaurant-modern
    restaurant_sections = [
        {
            'identifier': 'hero-banner',
            'internal_name': 'Hero – Full-width image + CTA',
            'code': 'jcw-restaurant-modern-01-hero-01',
            'group': 'hero',
            'variant_index': 1,
            'default_order': 1,
            'notes': 'Main hero section with restaurant image and call-to-action'
        },
        {
            'identifier': 'about-us',
            'internal_name': 'About – Story + Chef photo',
            'code': 'jcw-restaurant-modern-02-about-01',
            'group': 'about',
            'variant_index': 1,
            'default_order': 2,
            'notes': 'Restaurant story section with chef introduction'
        },
        {
            'identifier': 'menu-showcase',
            'internal_name': 'Menu – Featured dishes grid',
            'code': 'jcw-restaurant-modern-03-menu-01',
            'group': 'menu',
            'variant_index': 1,
            'default_order': 3,
            'notes': 'Grid display of featured menu items with prices'
        },
        {
            'identifier': 'testimonials',
            'internal_name': 'Reviews – Customer testimonials',
            'code': 'jcw-restaurant-modern-04-testimonials-01',
            'group': 'testimonials',
            'variant_index': 1,
            'default_order': 4,
            'notes': 'Customer review cards with ratings'
        },
        {
            'identifier': 'location-contact',
            'internal_name': 'Contact – Map + hours + reservation',
            'code': 'jcw-restaurant-modern-05-contact-01',
            'group': 'contact',
            'variant_index': 1,
            'default_order': 5,
            'notes': 'Location details, opening hours, and reservation form'
        },
    ]

    for section_data in restaurant_sections:
        section, created = TemplateSection.objects.get_or_create(
            site_template=restaurant_template,
            code=section_data['code'],
            defaults=section_data
        )
        status = "Created" if created else "Already exists"
        print(f"  {status}: {section.internal_name}")

    # Get the jcw-main template
    try:
        jcw_template = SiteTemplate.objects.get(key='jcw-main')
        print(f"\nFound template: {jcw_template.name}")
    except SiteTemplate.DoesNotExist:
        print("❌ jcw-main template not found")
        return

    # Create sections for jcw-main
    jcw_sections = [
        {
            'identifier': 'hero-landing',
            'internal_name': 'Hero – Service landing with CTA',
            'code': 'jcw-main-01-hero-01',
            'group': 'hero',
            'variant_index': 1,
            'default_order': 1,
            'notes': 'Main landing hero for service businesses'
        },
        {
            'identifier': 'features-grid',
            'internal_name': 'Features – Service highlights grid',
            'code': 'jcw-main-02-features-01',
            'group': 'features',
            'variant_index': 1,
            'default_order': 2,
            'notes': 'Grid of key service features with icons'
        },
        {
            'identifier': 'pricing-table',
            'internal_name': 'Pricing – Service packages table',
            'code': 'jcw-main-03-pricing-01',
            'group': 'pricing',
            'variant_index': 1,
            'default_order': 3,
            'notes': 'Pricing table for different service packages'
        },
        {
            'identifier': 'contact-form',
            'internal_name': 'Contact – Lead generation form',
            'code': 'jcw-main-04-contact-01',
            'group': 'contact',
            'variant_index': 1,
            'default_order': 4,
            'notes': 'Contact form optimized for lead generation'
        },
    ]

    for section_data in jcw_sections:
        section, created = TemplateSection.objects.get_or_create(
            site_template=jcw_template,
            code=section_data['code'],
            defaults=section_data
        )
        status = "Created" if created else "Already exists"
        print(f"  {status}: {section.internal_name}")

    print(f"\n✅ Template sections setup complete!")
    
    # Summary
    restaurant_count = TemplateSection.objects.filter(site_template=restaurant_template).count()
    jcw_count = TemplateSection.objects.filter(site_template=jcw_template).count()
    
    print(f"\nSummary:")
    print(f"  restaurant-modern: {restaurant_count} sections")
    print(f"  jcw-main: {jcw_count} sections")

if __name__ == "__main__":
    create_template_sections()