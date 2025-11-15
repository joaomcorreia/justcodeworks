import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field

# Get the test project
project_id = '69870a64-4913-4d52-9b35-4d1dfa33632a'
try:
    project = SiteProject.objects.get(id=project_id)
    print(f'Using project: {project.name} ({project.id})')
except SiteProject.DoesNotExist:
    print(f'ERROR: Project {project_id} not found!')
    exit(1)

# Get or create home page
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
    print(f'✓ Created home page')
else:
    print(f'✓ Using existing home page (ID: {home_page.id})')

# Homepage sections matching frontend structure
homepage_sections = [
    {
        'identifier': 'jcw-main-hero01',
        'internal_name': 'Hero',
        'order': 0,
        'fields': [
            {'key': 'headline', 'label': 'Headline', 'value': 'Everything you need to get your business online'},
            {'key': 'subheadline', 'label': 'Subheadline', 'value': 'Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.'},
            {'key': 'primaryCta', 'label': 'Primary CTA', 'value': 'Pick a template →'},
            {'key': 'secondaryCta', 'label': 'Secondary CTA', 'value': 'Watch demo'},
        ]
    },
    {
        'identifier': 'jcw-main-websites01',
        'internal_name': 'Websites Section',
        'order': 1,
        'fields': [
            {'key': 'title', 'label': 'Title', 'value': 'Websites that actually work'},
            {'key': 'subtitle', 'label': 'Subtitle', 'value': 'From simple landing pages to full online stores'},
        ]
    },
    {
        'identifier': 'jcw-main-print01',
        'internal_name': 'Print Section',
        'order': 2,
        'fields': [
            {'key': 'title', 'label': 'Title', 'value': 'Professional printing'},
            {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Business cards, flyers, and more'},
        ]
    },
    {
        'identifier': 'jcw-main-pos01',
        'internal_name': 'POS Section',
        'order': 3,
        'fields': [
            {'key': 'title', 'label': 'Title', 'value': 'Point of sale systems'},
            {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Complete retail and restaurant solutions'},
        ]
    },
    {
        'identifier': 'jcw-main-ai01',
        'internal_name': 'AI Section',
        'order': 4,
        'fields': [
            {'key': 'title', 'label': 'Title', 'value': 'AI-powered tools'},
            {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Smart automation for your business'},
        ]
    },
    {
        'identifier': 'jcw-main-cta01',
        'internal_name': 'CTA Section',
        'order': 5,
        'fields': [
            {'key': 'title', 'label': 'Title', 'value': 'Ready to get started?'},
            {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Choose the plan that fits your needs'},
            {'key': 'cta', 'label': 'CTA Button', 'value': 'Choose plan'},
        ]
    },
]

print('\nCreating/updating homepage sections...')
for section_data in homepage_sections:
    section, created = Section.objects.get_or_create(
        page=home_page,
        identifier=section_data['identifier'],
        defaults={
            'internal_name': section_data['internal_name'],
            'order': section_data['order'],
        }
    )
    
    if created:
        print(f'\n✓ Created section: {section.internal_name}')
    else:
        print(f'\n→ Section exists: {section.internal_name}')
        # Update order if needed
        if section.order != section_data['order']:
            section.order = section_data['order']
            section.save()
    
    # Create or update fields
    for field_data in section_data['fields']:
        field, created = Field.objects.get_or_create(
            section=section,
            key=field_data['key'],
            defaults={
                'label': field_data['label'],
                'value': field_data['value'],
            }
        )
        
        if created:
            print(f'  + Created field: {field.key} = "{field.value[:50]}..."' if len(field.value) > 50 else f'  + Created field: {field.key} = "{field.value}"')
        else:
            # Update value if different
            if field.value != field_data['value']:
                old_value = field.value[:30]
                field.value = field_data['value']
                field.save()
                print(f'  ↻ Updated field: {field.key} (was: "{old_value}...")')
            else:
                print(f'  · Field exists: {field.key}')

print('\n' + '='*60)
print('HOMEPAGE BACKEND READY!')
print('='*60)
print(f'Project: {project.name} ({project.id})')
print(f'Page: {home_page.title} (ID: {home_page.id}, slug: {home_page.slug})')
print(f'Sections: {Section.objects.filter(page=home_page).count()}')
print(f'Total fields: {Field.objects.filter(section__page=home_page).count()}')
print(f'\nAPI Snapshot: GET http://127.0.0.1:8000/api/pages/{home_page.id}/snapshot/')
print('\nFrontend should now load homepage from Django API!')
