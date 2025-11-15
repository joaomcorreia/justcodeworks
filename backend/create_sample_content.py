import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import *
from django.contrib.auth.models import User

print('=== CREATING SAMPLE WEBSITE CONTENT ===')
print()

# Get existing projects
projects = SiteProject.objects.all()

for project in projects:
    print(f'Creating content for project: {project.name}')
    
    # Create Home page
    home_page, created = Page.objects.get_or_create(
        project=project,
        title='Home',
        defaults={
            'slug': 'home',
            'is_published': True,
            'order': 1
        }
    )
    print(f'  - Home page: {"created" if created else "exists"}')
    
    # Create About page  
    about_page, created = Page.objects.get_or_create(
        project=project,
        title='About',
        defaults={
            'slug': 'about',
            'is_published': True,
            'order': 2
        }
    )
    print(f'  - About page: {"created" if created else "exists"}')
    
    # Create Contact page
    contact_page, created = Page.objects.get_or_create(
        project=project,
        title='Contact',
        defaults={
            'slug': 'contact',
            'is_published': True,
            'order': 3
        }
    )
    print(f'  - Contact page: {"created" if created else "exists"}')
    
    # Add content to Home page
    hero_section, created = Section.objects.get_or_create(
        page=home_page,
        identifier='hero-section',
        defaults={
            'internal_name': 'Hero',
            'order': 1
        }
    )
    
    if created:
        # Add hero fields
        Field.objects.create(
            section=hero_section,
            key='title',
            label='Title',
            value=f'Welcome to {project.name}',
            order=1
        )
        Field.objects.create(
            section=hero_section,
            key='subtitle',
            label='Subtitle',
            value='Building amazing websites with Just Code Works',
            order=2
        )
        Field.objects.create(
            section=hero_section,
            key='description',
            label='Description',
            value='We create beautiful, responsive websites that help your business grow online. Our modern approach combines cutting-edge technology with stunning design.',
            order=3
        )
        print(f'    - Hero section created with content')
    
    # Add Services section
    services_section, created = Section.objects.get_or_create(
        page=home_page,
        identifier='services-section',
        defaults={
            'internal_name': 'Services',
            'order': 2
        }
    )
    
    if created:
        Field.objects.create(
            section=services_section,
            key='heading',
            label='Heading',
            value='Our Services',
            order=1
        )
        Field.objects.create(
            section=services_section,
            key='service1_title',
            label='Service 1 Title',
            value='Web Development',
            order=2
        )
        Field.objects.create(
            section=services_section,
            key='service1_description',
            label='Service 1 Description',
            value='Custom website development using modern technologies and best practices.',
            order=3
        )
        Field.objects.create(
            section=services_section,
            key='service2_title',
            label='Service 2 Title',
            value='Design & Branding',
            order=4
        )
        Field.objects.create(
            section=services_section,
            key='service2_description',
            label='Service 2 Description',
            value='Professional design services to make your brand stand out from the competition.',
            order=5
        )
        print(f'    - Services section created with content')
    
    # Add content to About page
    about_section, created = Section.objects.get_or_create(
        page=about_page,
        identifier='about-section',
        defaults={
            'internal_name': 'About Us',
            'order': 1
        }
    )
    
    if created:
        Field.objects.create(
            section=about_section,
            key='heading',
            label='Heading',
            value='About Our Company',
            order=1
        )
        Field.objects.create(
            section=about_section,
            key='content',
            label='Content',
            value=f'{project.name} is dedicated to providing exceptional web development services. We combine technical expertise with creative design to deliver websites that not only look great but also perform exceptionally well.',
            order=2
        )
        print(f'    - About section created with content')
    
    # Add content to Contact page
    contact_section, created = Section.objects.get_or_create(
        page=contact_page,
        identifier='contact-section',
        defaults={
            'internal_name': 'Contact Information',
            'order': 1
        }
    )
    
    if created:
        Field.objects.create(
            section=contact_section,
            key='heading',
            label='Heading',
            value='Get In Touch',
            order=1
        )
        Field.objects.create(
            section=contact_section,
            key='email',
            label='Email',
            value='contact@example.com',
            order=2
        )
        Field.objects.create(
            section=contact_section,
            key='phone',
            label='Phone',
            value='+1 (555) 123-4567',
            order=3
        )
        Field.objects.create(
            section=contact_section,
            key='address',
            label='Address',
            value='123 Business Street\nSuite 100\nCity, State 12345',
            order=4
        )
        print(f'    - Contact section created with content')
    
    # Create navigation items
    NavigationItem.objects.get_or_create(
        project=project,
        label='Home',
        defaults={
            'url': '/',
            'order': 1
        }
    )
    NavigationItem.objects.get_or_create(
        project=project,
        label='About',
        defaults={
            'url': '/about',
            'order': 2
        }
    )
    NavigationItem.objects.get_or_create(
        project=project,
        label='Contact',
        defaults={
            'url': '/contact',
            'order': 3
        }
    )
    print(f'  - Navigation items created')
    
    print(f'  ✅ Project "{project.name}" now has complete content')
    print()

print('=== CONTENT CREATION SUMMARY ===')
total_pages = Page.objects.count()
total_sections = Section.objects.count()
total_fields = Field.objects.count()
total_nav_items = NavigationItem.objects.count()

print(f'Total pages: {total_pages}')
print(f'Total sections: {total_sections}')
print(f'Total fields: {total_fields}')
print(f'Total navigation items: {total_nav_items}')
print()
print('✅ All projects now have sample website content!')
print('🌐 Websites are ready for live preview!')