#!/usr/bin/env python
"""
Add Footer Section to Mary's Restaurant

This script adds a footer section with contact info, hours, and social links
to Mary's Restaurant website.
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

def add_footer_to_marys_restaurant():
    """Add footer section to Mary's Restaurant homepage"""
    print("🦶 Adding Footer to Mary's Restaurant...")
    
    try:
        # Get Mary's Restaurant project
        marys_project = SiteProject.objects.get(name__icontains="Mary's Restaurant")
        print(f"✅ Found project: {marys_project.name}")
        
        # Get the homepage
        homepage = Page.objects.get(project=marys_project, slug='home')
        print(f"✅ Found homepage: {homepage.title}")
        
        # Create footer section
        footer_section, created = Section.objects.get_or_create(
            page=homepage,
            identifier='restaurant-footer',
            defaults={
                'internal_name': 'Restaurant Footer',
                'order': 99  # Put footer at the end
            }
        )
        
        if created:
            print(f"✅ Created footer section: {footer_section.internal_name}")
            
            # Add footer fields
            footer_fields = [
                # Restaurant branding
                Field(section=footer_section, key='restaurant_name', label='Restaurant Name', value="Mary's Restaurant"),
                
                # Contact information
                Field(section=footer_section, key='address', label='Address', value="123 Via Roma Street, Little Italy District"),
                Field(section=footer_section, key='phone', label='Phone', value="(555) 123-4567"),
                Field(section=footer_section, key='email', label='Email', value="reservations@marysrestaurant.com"),
                
                # Operating hours
                Field(section=footer_section, key='hours_weekdays', label='Weekday Hours', value="Monday-Friday: 5:00 PM - 10:00 PM"),
                Field(section=footer_section, key='hours_weekend', label='Weekend Hours', value="Saturday-Sunday: 12:00 PM - 11:00 PM"),
                
                # Social media links
                Field(section=footer_section, key='social_facebook', label='Facebook URL', value="https://facebook.com/marysrestaurant"),
                Field(section=footer_section, key='social_instagram', label='Instagram URL', value="https://instagram.com/marysrestaurant"),
                
                # Navigation links
                Field(section=footer_section, key='menu_link', label='Menu Link', value="#menu"),
                Field(section=footer_section, key='reservations_link', label='Reservations Link', value="tel:(555) 123-4567"),
                Field(section=footer_section, key='about_link', label='About Link', value="#about"),
                
                # Copyright
                Field(section=footer_section, key='copyright_text', label='Copyright Text', value="© 2024 Mary's Restaurant. All rights reserved. Serving authentic Italian cuisine since 1985."),
            ]
            
            # Bulk create all fields
            Field.objects.bulk_create(footer_fields)
            print(f"✅ Created {len(footer_fields)} footer fields")
            
        else:
            print(f"📋 Footer section already exists: {footer_section.internal_name}")
            
        return footer_section
        
    except SiteProject.DoesNotExist:
        print("❌ Mary's Restaurant project not found")
        return None
    except Page.DoesNotExist:
        print("❌ Homepage not found for Mary's Restaurant")
        return None
    except Exception as e:
        print(f"❌ Error adding footer: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    footer = add_footer_to_marys_restaurant()
    if footer:
        print(f"\n🎉 Success! Footer added to Mary's Restaurant")
        print(f"📋 Section: {footer.internal_name} (ID: {footer.id})")
        print(f"🔍 Identifier: {footer.identifier}")
        print(f"📊 Fields: {footer.fields.count()}")
        print(f"\n🌐 Visit: http://localhost:3002/en/sites/marys-restaurant")
    else:
        print(f"\n❌ Failed to add footer")