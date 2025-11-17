#!/usr/bin/env python3
"""
Add a tire-specialized Why Choose Us section to Joe's Tire Center
"""

import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def add_tire_why_choose_section():
    """Add tire-specialized Why Choose Us section"""
    
    try:
        # Get Joe's Tire Center project
        project = SiteProject.objects.get(slug='joes-garage')
        print(f"🔧 Updating: {project.name}")
        
        # Get home page
        home_page = Page.objects.get(project=project, slug='home')
        
        # Update the contact section to be Why Choose Us instead
        contact_section = Section.objects.get(page=home_page, order=6)
        print(f"Converting section: {contact_section.internal_name}")
        
        # Change to Why Choose Us section
        contact_section.identifier = 'jcw-auto-garage-modern-01-why-choose-01'
        contact_section.internal_name = 'Why Choose Joe\'s Tire Center'
        contact_section.save()
        
        # Clear existing fields
        Field.objects.filter(section=contact_section).delete()
        
        # Create tire-specialized Why Choose Us fields
        tire_features = [
            {
                'key': 'title',
                'value': 'Why Choose Joe\'s Tire Center?'
            },
            {
                'key': 'subtitle',
                'value': 'Over 15 years serving the community with honest service and competitive prices'
            },
            {
                'key': 'feature_1_icon',
                'value': 'shield-check'
            },
            {
                'key': 'feature_1_title',
                'value': 'Lifetime Warranty'
            },
            {
                'key': 'feature_1_description',
                'value': 'All tire installations include our comprehensive lifetime warranty on mounting and balancing services.'
            },
            {
                'key': 'feature_2_icon',
                'value': 'wrench'
            },
            {
                'key': 'feature_2_title',
                'value': 'Expert Technicians'
            },
            {
                'key': 'feature_2_description',
                'value': 'ASE-certified tire specialists with decades of experience on all vehicle makes and models.'
            },
            {
                'key': 'feature_3_icon',
                'value': 'clock'
            },
            {
                'key': 'feature_3_title',
                'value': 'Same-Day Service'
            },
            {
                'key': 'feature_3_description',
                'value': 'Most tire services completed the same day. No appointment necessary for basic services.'
            },
            {
                'key': 'feature_4_icon',
                'value': 'euro'
            },
            {
                'key': 'feature_4_title',
                'value': 'Best Price Guarantee'
            },
            {
                'key': 'feature_4_description',
                'value': 'We match any competitor\'s written estimate and beat it by 5%. No hidden fees or surprises.'
            }
        ]
        
        # Create the fields
        for field_data in tire_features:
            Field.objects.create(
                section=contact_section,
                key=field_data['key'],
                value=field_data['value']
            )
        
        print(f"✅ Created {len(tire_features)} Why Choose Us fields")
        
        # Now create a proper contact section at the end
        contact_section = Section.objects.create(
            page=home_page,
            identifier='jcw-auto-garage-modern-01-contact-01',
            internal_name='Contact & Location',
            order=7
        )
        
        contact_fields = [
            {'key': 'title', 'value': 'Visit Our Tire Center'},
            {'key': 'address_title', 'value': 'Location'},
            {'key': 'address', 'value': '456 Tire Avenue\nDowntown District, NY 10001'},
            {'key': 'phone_title', 'value': 'Call Us'},
            {'key': 'phone', 'value': '(555) 987-6543'},
            {'key': 'email_title', 'value': 'Email'},
            {'key': 'email', 'value': 'info@joestirecenter.com'},
            {'key': 'hours_title', 'value': 'Business Hours'},
            {'key': 'hours_weekdays', 'value': 'Monday - Friday: 7:00 AM - 7:00 PM'},
            {'key': 'hours_saturday', 'value': 'Saturday: 8:00 AM - 5:00 PM'},
            {'key': 'hours_sunday', 'value': 'Sunday: 9:00 AM - 4:00 PM'},
            {'key': 'map_title', 'value': 'Find Us'},
            {'key': 'map_link', 'value': 'https://maps.google.com/?q=456+Tire+Avenue+Downtown+NY'},
            {'key': 'directions', 'value': 'Easy parking available. Located next to AutoZone on Tire Avenue.'}
        ]
        
        for field_data in contact_fields:
            Field.objects.create(
                section=contact_section,
                key=field_data['key'],
                value=field_data['value']
            )
        
        print(f"✅ Created new contact section with {len(contact_fields)} fields")
        
        print(f"\n✅ Joe's Tire Center now has proper tire-specialized sections!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

def main():
    print("🔧 Adding Tire-Specialized Why Choose Us Section")
    print("=" * 60)
    
    success = add_tire_why_choose_section()
    
    if success:
        print(f"\n🎉 Joe's Tire Center sections updated!")
        print("   New structure: Hero → Services → Technology → Testimonials → Quote → Why Choose Us → Contact")

if __name__ == "__main__":
    main()