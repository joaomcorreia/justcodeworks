import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

# Get or create a test project
project, created = SiteProject.objects.get_or_create(
    slug='test-site',
    defaults={
        'name': 'Test Site',
        'business_type': 'Technology',
        'primary_goal': 'Showcase services',
        'primary_locale': 'en',
        'additional_locales': ['es', 'fr'],
        'primary_color': '#FFD700',
        'notes': 'Test project for API development',
    }
)

if created:
    print(f'✓ Created project: {project.name}')
else:
    print(f'Using existing project: {project.name}')

# Create a home page
home_page, created = Page.objects.get_or_create(
    project=project,
    slug='home',
    defaults={
        'path': '/',
        'title': 'Home',
        'order': 0,
        'is_published': True,
    }
)

if created:
    print(f'✓ Created page: {home_page.title}')
else:
    print(f'Using existing page: {home_page.title}')

# Create sections for the home page
hero_section, created = Section.objects.get_or_create(
    page=home_page,
    identifier='jcw-main-hero01',
    defaults={
        'internal_name': 'Hero Section',
        'order': 0,
    }
)

if created:
    print(f'✓ Created section: {hero_section.internal_name}')
    
    # Add fields to hero section
    Field.objects.create(
        section=hero_section,
        key='title',
        label='Hero Title',
        value='Welcome to Just Code Works'
    )
    Field.objects.create(
        section=hero_section,
        key='subtitle',
        label='Hero Subtitle',
        value='Build amazing websites with our powerful builder'
    )
    Field.objects.create(
        section=hero_section,
        key='ctaText',
        label='CTA Button Text',
        value='Get Started'
    )
    print(f'  → Added 3 fields to {hero_section.internal_name}')

# Create a features section
features_section, created = Section.objects.get_or_create(
    page=home_page,
    identifier='jcw-features-grid01',
    defaults={
        'internal_name': 'Features Grid',
        'order': 1,
    }
)

if created:
    print(f'✓ Created section: {features_section.internal_name}')
    
    # Add fields to features section
    Field.objects.create(
        section=features_section,
        key='heading',
        label='Section Heading',
        value='Our Features'
    )
    Field.objects.create(
        section=features_section,
        key='description',
        label='Section Description',
        value='Everything you need to build a professional website'
    )
    print(f'  → Added 2 fields to {features_section.internal_name}')

# Create an about page
about_page, created = Page.objects.get_or_create(
    project=project,
    slug='about',
    defaults={
        'path': '/about',
        'title': 'About Us',
        'order': 1,
        'is_published': True,
    }
)

if created:
    print(f'✓ Created page: {about_page.title}')
    
    # Add a section to about page
    about_section, created = Section.objects.get_or_create(
        page=about_page,
        identifier='jcw-about-content01',
        defaults={
            'internal_name': 'About Content',
            'order': 0,
        }
    )
    
    if created:
        Field.objects.create(
            section=about_section,
            key='title',
            label='About Title',
            value='About Our Company'
        )
        Field.objects.create(
            section=about_section,
            key='content',
            label='About Content',
            value='We are a team of passionate developers building the future of web development.'
        )
        print(f'  → Created section with 2 fields')

print('\n' + '='*50)
print('SUMMARY')
print('='*50)
print(f'Project: {project.name} (ID: {project.id})')
print(f'Pages: {Page.objects.filter(project=project).count()}')
print(f'Sections: {Section.objects.filter(page__project=project).count()}')
print(f'Fields: {Field.objects.filter(section__page__project=project).count()}')
print('\nAPI Endpoints to test:')
print(f'  GET /api/pages/?project={project.id}')
print(f'  GET /api/pages/{home_page.id}/')
print(f'  GET /api/pages/{home_page.id}/snapshot/')
print(f'  GET /api/sections/?page={home_page.id}')
