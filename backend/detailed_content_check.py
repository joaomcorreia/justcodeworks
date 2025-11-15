import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import *

print('=== DETAILED CONTENT CHECK ===')
print()

print('PAGES:')
pages = Page.objects.all()
print(f'Total pages: {pages.count()}')
for page in pages[:10]:
    project_name = page.project.name if page.project else "None"
    print(f'  - "{page.title}" (Project: {project_name})')
print()

print('SECTIONS:')
sections = Section.objects.all()
print(f'Total sections: {sections.count()}')
for section in sections[:10]:
    page_title = section.page.title if section.page else "None"
    print(f'  - "{section.name}" (Page: {page_title})')
print()

print('FIELDS:')
fields = Field.objects.all()
print(f'Total fields: {fields.count()}')
for field in fields[:10]:
    content_preview = (field.content[:50] + '...') if len(field.content) > 50 else field.content
    section_name = field.section.name if field.section else "None"
    print(f'  - "{field.name}": "{content_preview}" (Section: {section_name})')
print()

print('NAVIGATION ITEMS:')
nav_items = NavigationItem.objects.all()
print(f'Total nav items: {nav_items.count()}')
for nav in nav_items[:10]:
    project_name = nav.project.name if nav.project else "None"
    print(f'  - "{nav.label}" -> {nav.url} (Project: {project_name})')
print()

print('=== WEBSITE STATUS ===')
if pages.count() == 0:
    print('❌ NO ACTUAL WEBSITES EXIST YET')
    print()
    print('The tenant projects exist but have no pages/content.')
    print('This means:')
    print('  - Users can log in to the dashboard')
    print('  - Projects are created but empty')  
    print('  - No actual websites are live/accessible')
    print()
    print('To create a working website, you would need:')
    print('  1. Create pages for a project')
    print('  2. Add sections to those pages')
    print('  3. Add fields with content to those sections')
    print('  4. Set up navigation items')
else:
    print('✅ WEBSITES EXIST WITH CONTENT')
    print(f'Found {pages.count()} pages with content')