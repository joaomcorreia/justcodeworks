#!/usr/bin/env python3
"""
Script to create test SiteTemplate data for Template Lab testing.
Run with: python add_test_template.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteTemplate

def create_test_templates():
    """Create test site templates for Template Lab."""
    
    # Template 1: JCW Main
    jcw_main, created = SiteTemplate.objects.get_or_create(
        key='jcw-main',
        defaults={
            'name': 'JCW Main Long Page',
            'description': 'Full-featured business template with hero, services, testimonials, and contact sections.',
            'type': 'website',
            'category': 'Business',
            'status': 'published',
            'sections_count': 6,
            'usage_count': 15,
            'is_active': True,
            'version': 'v1.2'
        }
    )
    if created:
        print(f"✓ Created: {jcw_main.name}")
    else:
        print(f"- Exists: {jcw_main.name}")
    
    # Template 2: One Page Basic
    one_page, created = SiteTemplate.objects.get_or_create(
        key='one-page-basic',
        defaults={
            'name': 'One Page Basic',
            'description': 'Simple single-page template perfect for portfolios and small businesses.',
            'type': 'website',
            'category': 'Portfolio',
            'status': 'published',
            'sections_count': 4,
            'usage_count': 8,
            'is_active': True,
            'version': 'v1.0'
        }
    )
    if created:
        print(f"✓ Created: {one_page.name}")
    else:
        print(f"- Exists: {one_page.name}")
    
    # Template 3: Restaurant Modern
    restaurant, created = SiteTemplate.objects.get_or_create(
        key='restaurant-modern',
        defaults={
            'name': 'Restaurant Modern',
            'description': 'Stylish restaurant template with menu showcase and reservation system.',
            'type': 'website',
            'category': 'Restaurant',
            'status': 'draft',
            'sections_count': 7,
            'usage_count': 3,
            'is_active': True,
            'version': 'v1.1'
        }
    )
    if created:
        print(f"✓ Created: {restaurant.name}")
    else:
        print(f"- Exists: {restaurant.name}")
    
    # Template 4: E-commerce Basic
    ecommerce, created = SiteTemplate.objects.get_or_create(
        key='ecommerce-basic',
        defaults={
            'name': 'E-commerce Basic',
            'description': 'Complete online store template with product showcase and shopping cart.',
            'type': 'website',
            'category': 'E-commerce',
            'status': 'published',
            'sections_count': 8,
            'usage_count': 12,
            'is_active': True,
            'version': 'v2.0'
        }
    )
    if created:
        print(f"✓ Created: {ecommerce.name}")
    else:
        print(f"- Exists: {ecommerce.name}")
    
    # Template 5: Email Newsletter
    email_template, created = SiteTemplate.objects.get_or_create(
        key='email-newsletter',
        defaults={
            'name': 'Newsletter Weekly',
            'description': 'Professional email newsletter template with sections for articles and updates.',
            'type': 'email',
            'category': 'Newsletter',
            'status': 'published',
            'sections_count': 5,
            'usage_count': 25,
            'is_active': True,
            'version': 'v1.0'
        }
    )
    if created:
        print(f"✓ Created: {email_template.name}")
    else:
        print(f"- Exists: {email_template.name}")
    
    # Template 6: Landing Page Conversion
    landing, created = SiteTemplate.objects.get_or_create(
        key='landing-conversion',
        defaults={
            'name': 'High-Conversion Landing',
            'description': 'Optimized landing page template focused on conversions with clear CTAs.',
            'type': 'landing',
            'category': 'Marketing',
            'status': 'published',
            'sections_count': 3,
            'usage_count': 18,
            'is_active': True,
            'version': 'v1.3'
        }
    )
    if created:
        print(f"✓ Created: {landing.name}")
    else:
        print(f"- Exists: {landing.name}")

    print(f"\n📊 Summary:")
    print(f"   Total templates: {SiteTemplate.objects.count()}")
    print(f"   Website templates: {SiteTemplate.objects.filter(type='website').count()}")
    print(f"   Email templates: {SiteTemplate.objects.filter(type='email').count()}")
    print(f"   Landing templates: {SiteTemplate.objects.filter(type='landing').count()}")
    print(f"   Published: {SiteTemplate.objects.filter(status='published').count()}")
    print(f"   Draft: {SiteTemplate.objects.filter(status='draft').count()}")

if __name__ == '__main__':
    print("🏗️  Creating test SiteTemplate data...")
    create_test_templates()
    print("✅ Test template data creation completed!")

# List all templates
print('\nAll templates in database:')
for t in Template.objects.all():
    print(f'  - {t.name} (slug: {t.slug}, category: {t.category})')
