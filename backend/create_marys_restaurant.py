#!/usr/bin/env python
"""
Creates Mary's Restaurant - A complete tenant website example
"""
import os
import sys
import django
from datetime import datetime
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteTemplate, SiteProject, Page, Section, Field

def create_marys_restaurant():
    print("🍽️ Creating Mary's Restaurant Website...")
    
    # 1. Create or get restaurant template
    restaurant_template, created = SiteTemplate.objects.get_or_create(
        key='restaurant-modern',
        defaults={
            'name': 'Modern Restaurant',
            'description': 'Modern restaurant layout with menu, about, and contact sections',
            'is_active': True
        }
    )
    if created:
        print(f"✅ Created template: {restaurant_template.name}")
    else:
        print(f"📋 Using existing template: {restaurant_template.name}")
    
    # 2. Get or create a user for Mary's Restaurant
    mary_user, created = User.objects.get_or_create(
        username='mary_restaurant',
        defaults={
            'email': 'mary@marysrestaurant.com',
            'first_name': 'Mary',
            'last_name': 'Johnson',
            'is_staff': False,
            'is_active': True
        }
    )
    if created:
        mary_user.set_password('restaurant123')
        mary_user.save()
        print(f"✅ Created user: {mary_user.username}")
    else:
        print(f"👤 Using existing user: {mary_user.username}")
    
    # 3. Create or get Mary's Restaurant project
    restaurant_project, created = SiteProject.objects.get_or_create(
        name="Mary's Restaurant",
        owner=mary_user,
        defaults={
            'slug': 'marys-restaurant',
            'site_template': restaurant_template,
            'business_type': 'Restaurant',
            'primary_goal': 'take-bookings',
            'is_active': True
        }
    )
    if created:
        print(f"✅ Created project: {restaurant_project.name}")
    else:
        print(f"🏪 Using existing project: {restaurant_project.name}")
        # Update template if not set
        if not restaurant_project.site_template:
            restaurant_project.site_template = restaurant_template
            restaurant_project.save()
    
    # 4. Create Homepage
    homepage, created = Page.objects.get_or_create(
        project=restaurant_project,
        slug='home',
        defaults={
            'title': "Mary's Restaurant - Authentic Italian Cuisine",
            'path': '/home',
            'is_published': True,
            'order': 1
        }
    )
    if created:
        print(f"✅ Created homepage: {homepage.title}")
    
    # Hero Section
    hero_section, created = Section.objects.get_or_create(
        page=homepage,
        identifier='hero-banner',
        defaults={
            'internal_name': 'Hero Banner',
            'order': 1
        }
    )
    if created:
        Field.objects.bulk_create([
            Field(section=hero_section, key='headline', label='Headline', value="Welcome to Mary's Restaurant"),
            Field(section=hero_section, key='subheadline', label='Subheadline', value="Authentic Italian cuisine in the heart of the city since 1985"),
            Field(section=hero_section, key='cta_text', label='CTA Text', value="Reserve Your Table"),
            Field(section=hero_section, key='cta_link', label='CTA Link', value="/reservations"),
            Field(section=hero_section, key='background_image', label='Background Image', value="/images/restaurant-interior.jpg"),
        ])
        print("✅ Created hero section with fields")
    
    # About Section
    about_section, created = Section.objects.get_or_create(
        page=homepage,
        identifier='about-us',
        defaults={
            'internal_name': 'About Us',
            'order': 2
        }
    )
    if created:
        Field.objects.bulk_create([
            Field(section=about_section, key='title', label='Title', value="Our Story"),
            Field(section=about_section, key='content', label='Content', 
                  value="Mary's Restaurant has been serving authentic Italian cuisine for over 35 years. Founded by Mary Johnson and her late husband Giuseppe, our family restaurant brings the flavors of Sicily to your table with recipes passed down through generations."),
            Field(section=about_section, key='image', label='Image', value="/images/mary-giuseppe.jpg"),
        ])
        print("✅ Created about section with fields")
    
    # 5. Create Menu Page
    menu_page, created = Page.objects.get_or_create(
        project=restaurant_project,
        slug='menu',
        defaults={
            'title': 'Our Menu - Fresh Italian Dishes',
            'path': '/menu',
            'is_published': True,
            'order': 2
        }
    )
    if created:
        print(f"✅ Created menu page: {menu_page.title}")
    
    # Appetizers Section
    appetizers_section, created = Section.objects.get_or_create(
        page=menu_page,
        identifier='appetizers',
        defaults={
            'internal_name': 'Appetizers',
            'order': 1
        }
    )
    if created:
        Field.objects.bulk_create([
            Field(section=appetizers_section, key='item_1_name', label='Item 1 Name', value="Bruschetta Classica"),
            Field(section=appetizers_section, key='item_1_description', label='Item 1 Description', value="Fresh tomatoes, basil, and mozzarella on toasted bread"),
            Field(section=appetizers_section, key='item_1_price', label='Item 1 Price', value="$12.50"),
            Field(section=appetizers_section, key='item_2_name', label='Item 2 Name', value="Antipasto Platter"),
            Field(section=appetizers_section, key='item_2_description', label='Item 2 Description', value="Selection of Italian meats, cheeses, and marinated vegetables"),
            Field(section=appetizers_section, key='item_2_price', label='Item 2 Price', value="$18.00"),
        ])
        print("✅ Created appetizers menu section")
    
    # Main Courses Section  
    mains_section, created = Section.objects.get_or_create(
        page=menu_page,
        identifier='main-courses',
        defaults={
            'internal_name': 'Main Courses',
            'order': 2
        }
    )
    if created:
        Field.objects.bulk_create([
            Field(section=mains_section, key='item_1_name', label='Item 1 Name', value="Spaghetti Carbonara"),
            Field(section=mains_section, key='item_1_description', label='Item 1 Description', value="Traditional Roman pasta with pancetta, eggs, and Parmigiano"),
            Field(section=mains_section, key='item_1_price', label='Item 1 Price', value="$22.00"),
            Field(section=mains_section, key='item_2_name', label='Item 2 Name', value="Osso Buco alla Milanese"),
            Field(section=mains_section, key='item_2_description', label='Item 2 Description', value="Braised veal shank with risotto and gremolata"),
            Field(section=mains_section, key='item_2_price', label='Item 2 Price', value="$32.00"),
            Field(section=mains_section, key='item_3_name', label='Item 3 Name', value="Margherita Pizza"),
            Field(section=mains_section, key='item_3_description', label='Item 3 Description', value="Wood-fired pizza with San Marzano tomatoes and fresh mozzarella"),
            Field(section=mains_section, key='item_3_price', label='Item 3 Price', value="$19.00"),
        ])
        print("✅ Created main courses menu section")
    
    # 6. Create Contact Page
    contact_page, created = Page.objects.get_or_create(
        project=restaurant_project,
        slug='contact',
        defaults={
            'title': 'Contact & Reservations',
            'path': '/contact',
            'is_published': True,
            'order': 3
        }
    )
    if created:
        print(f"✅ Created contact page: {contact_page.title}")
    
    # Contact Info Section
    contact_section, created = Section.objects.get_or_create(
        page=contact_page,
        identifier='contact-info',
        defaults={
            'internal_name': 'Contact Information',
            'order': 1
        }
    )
    if created:
        Field.objects.bulk_create([
            Field(section=contact_section, key='address', label='Address', value="123 Via Roma Street, Little Italy District"),
            Field(section=contact_section, key='phone', label='Phone', value="(555) 123-4567"),
            Field(section=contact_section, key='email', label='Email', value="reservations@marysrestaurant.com"),
            Field(section=contact_section, key='hours_mon_fri', label='Mon-Fri Hours', value="Monday-Friday: 5:00 PM - 10:00 PM"),
            Field(section=contact_section, key='hours_weekend', label='Weekend Hours', value="Saturday-Sunday: 12:00 PM - 11:00 PM"),
            Field(section=contact_section, key='closed', label='Closed Days', value="Closed Tuesdays"),
        ])
        print("✅ Created contact information section")
    
    # Summary
    print(f"\n🎉 Mary's Restaurant Website Created Successfully!")
    print(f"📋 Project: {restaurant_project.name} (ID: {restaurant_project.id})")
    print(f"👤 Owner: {mary_user.username}")
    print(f"🎨 Template: {restaurant_template.name} ({restaurant_template.key})")
    print(f"📄 Pages: {Page.objects.filter(project=restaurant_project).count()}")
    print(f"📑 Sections: {Section.objects.filter(page__project=restaurant_project).count()}")
    print(f"🏷️ Fields: {Field.objects.filter(section__page__project=restaurant_project).count()}")
    
    return restaurant_project

if __name__ == "__main__":
    try:
        project = create_marys_restaurant()
        print(f"\n✅ Success! Mary's Restaurant is ready at project ID: {project.id}")
    except Exception as e:
        print(f"\n❌ Error creating Mary's Restaurant: {e}")
        import traceback
        traceback.print_exc()