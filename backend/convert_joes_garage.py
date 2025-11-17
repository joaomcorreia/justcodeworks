#!/usr/bin/env python3
"""
Convert Joe's Garage to a tire-specialized auto garage with proper template
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

from sites.models import SiteProject, Page, Section, Field, SiteTemplate

def convert_to_tire_garage():
    """Convert Joe's Garage to tire-specialized auto garage"""
    
    try:
        # Get Joe's Garage project
        project = SiteProject.objects.get(slug='joes-garage')
        print(f"🔧 Converting: {project.name}")
        
        # Assign auto-garage template
        auto_template = SiteTemplate.objects.get(key='auto-garage-modern')
        project.site_template = auto_template
        project.name = "Joe's Tire Center"
        project.save()
        print("✅ Assigned auto-garage template and updated name")
        
        # Get home page
        home_page = Page.objects.get(project=project, slug='home')
        home_page.title = "Joe's Tire Center - Professional Tire Services"
        home_page.save()
        
        # Clear existing sections
        Section.objects.filter(page=home_page).delete()
        print("✅ Cleared old sections")
        
        # Create new tire-focused sections
        sections_data = [
            {
                'identifier': 'jcw-auto-garage-modern-01-hero-01',
                'internal_name': 'Hero Section',
                'order': 1,
                'fields': [
                    {'key': 'headline', 'value': "Joe's Tire Center"},
                    {'key': 'subheadline', 'value': "Professional tire services, installation, and repair in downtown"},
                    {'key': 'cta_text', 'value': "Get Quote"},
                    {'key': 'cta_link', 'value': "/quote"},
                    {'key': 'background_image', 'value': "/images/tire-shop-hero.jpg"}
                ]
            },
            {
                'identifier': 'jcw-auto-garage-modern-01-services-01',
                'internal_name': 'Tire Services',
                'order': 2,
                'fields': [
                    {'key': 'title', 'value': 'Our Tire Services'},
                    {'key': 'subtitle', 'value': 'Complete tire solutions for all vehicle types'},
                    {'key': 'service_1_title', 'value': 'New Tire Installation'},
                    {'key': 'service_1_description', 'value': 'Full range of premium tires from top brands. Professional mounting and balancing included.'},
                    {'key': 'service_2_title', 'value': 'Tire Repair & Patching'},
                    {'key': 'service_2_description', 'value': 'Expert puncture repairs and patches to extend your tire life safely and affordably.'},
                    {'key': 'service_3_title', 'value': 'Wheel Alignment'},
                    {'key': 'service_3_description', 'value': 'Precision alignment services to prevent uneven wear and improve handling.'},
                    {'key': 'service_4_title', 'value': 'Tire Rotation & Balancing'},
                    {'key': 'service_4_description', 'value': 'Regular maintenance to maximize tire life and ensure smooth, safe driving.'}
                ]
            },
            {
                'identifier': 'jcw-auto-garage-modern-01-diagnostics-01',
                'internal_name': 'Tire Technology',
                'order': 3,
                'fields': [
                    {'key': 'title', 'value': 'Advanced Tire Technology & Equipment'},
                    {'key': 'description', 'value': 'We use state-of-the-art equipment to ensure your tires perform at their best and last longer.'},
                    {'key': 'feature_1', 'value': 'Digital tire pressure monitoring'},
                    {'key': 'feature_2', 'value': 'Computerized wheel balancing machines'},
                    {'key': 'feature_3', 'value': 'Laser wheel alignment systems'},
                    {'key': 'image', 'value': '/images/tire-equipment.jpg'}
                ]
            },
            {
                'identifier': 'jcw-auto-garage-modern-01-testimonials-01',
                'internal_name': 'Customer Reviews',
                'order': 4,
                'fields': [
                    {'key': 'title', 'value': 'What Our Customers Say'},
                    {'key': 'testimonial_1_text', 'value': 'Best tire service in town! Joe and his team got me back on the road quickly with great prices.'},
                    {'key': 'testimonial_1_author', 'value': 'Sarah Johnson'},
                    {'key': 'testimonial_1_service', 'value': 'New tire installation - Honda Civic'},
                    {'key': 'testimonial_2_text', 'value': 'Professional service and honest pricing. They repaired my tire when others wanted to replace it.'},
                    {'key': 'testimonial_2_author', 'value': 'Mike Rodriguez'},
                    {'key': 'testimonial_2_service', 'value': 'Tire patch repair - Ford F-150'},
                    {'key': 'testimonial_3_text', 'value': 'Fast alignment service and the steering wheel no longer vibrates. Highly recommend!'},
                    {'key': 'testimonial_3_author', 'value': 'Lisa Chen'},
                    {'key': 'testimonial_3_service', 'value': 'Wheel alignment - Toyota Camry'}
                ]
            },
            {
                'identifier': 'jcw-auto-garage-modern-01-form-quote-01',
                'internal_name': 'Tire Quote Form',
                'order': 5,
                'fields': [
                    {'key': 'title', 'value': 'Get Free Tire Quote'},
                    {'key': 'subtitle', 'value': 'Tell us about your vehicle and tire needs for instant pricing'},
                    {'key': 'form_name_label', 'value': 'Full name'},
                    {'key': 'form_email_label', 'value': 'Email address'},
                    {'key': 'form_phone_label', 'value': 'Phone number'},
                    {'key': 'form_license_plate_label', 'value': 'License plate'},
                    {'key': 'form_vehicle_label', 'value': 'Vehicle year, make & model'},
                    {'key': 'form_service_label', 'value': 'Tire service needed'},
                    {'key': 'form_message_label', 'value': 'Current tire size or specific needs'},
                    {'key': 'form_submit_text', 'value': 'Get My Quote'},
                    {'key': 'privacy_text', 'value': 'Your information is secure and will only be used to provide your tire quote.'}
                ]
            },
            {
                'identifier': 'jcw-auto-garage-modern-01-contact-01',
                'internal_name': 'Contact & Location',
                'order': 6,
                'fields': [
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
            }
        ]
        
        # Create sections and fields
        for section_data in sections_data:
            section = Section.objects.create(
                page=home_page,
                identifier=section_data['identifier'],
                internal_name=section_data['internal_name'],
                order=section_data['order']
            )
            
            for field_data in section_data['fields']:
                Field.objects.create(
                    section=section,
                    key=field_data['key'],
                    value=field_data['value']
                )
            
            print(f"✅ Created section: {section_data['internal_name']}")
        
        # Update other pages
        about_page = Page.objects.get(project=project, slug='about')
        about_page.title = "About Joe's Tire Center"
        about_page.save()
        
        contact_page = Page.objects.get(project=project, slug='contact')
        contact_page.title = "Contact Joe's Tire Center"
        contact_page.save()
        
        print(f"\n✅ Successfully converted Joe's Garage to tire-specialized auto garage!")
        print(f"   - Template: auto-garage-modern")
        print(f"   - Sections: {len(sections_data)} tire-focused sections")
        print(f"   - All sections mapped to existing components")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

def main():
    print("🔄 Converting Joe's Garage to Tire-Specialized Auto Garage")
    print("=" * 60)
    
    success = convert_to_tire_garage()
    
    if success:
        print(f"\n🎉 Joe's Tire Center is ready!")
        print("   Visit: http://localhost:3002/sites/joes-garage")

if __name__ == "__main__":
    main()