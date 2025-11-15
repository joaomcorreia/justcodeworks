import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Page
from sites.serializers import PageSnapshotSerializer

print('='*70)
print('HOMEPAGE BACKEND VERIFICATION')
print('='*70)

# Get homepage
home = Page.objects.filter(slug='home').first()

if not home:
    print('❌ No homepage found in database!')
    exit(1)

print(f'✓ Homepage found: {home.title} (ID: {home.id})')
print(f'  Project: {home.project.name} (ID: {home.project.id})')
print(f'  Slug: {home.slug}')
print(f'  Path: {home.path}')
print(f'  Published: {home.is_published}')

sections = home.sections.all().order_by('order')
print(f'\n✓ Sections: {sections.count()}')

for section in sections:
    fields = section.fields.all()
    print(f'\n  [{section.order}] {section.internal_name}')
    print(f'      Identifier: {section.identifier}')
    print(f'      Fields: {fields.count()}')
    for field in fields:
        value_preview = field.value[:50] + '...' if len(field.value) > 50 else field.value
        print(f'        - {field.key}: "{value_preview}"')

# Test snapshot serialization
serializer = PageSnapshotSerializer(home)
data = serializer.data

print('\n' + '='*70)
print('API SNAPSHOT TEST')
print('='*70)
print(f'✓ Snapshot serializes successfully')
print(f'  Sections in snapshot: {len(data["sections"])}')
print(f'  Total fields: {sum(len(s["fields"]) for s in data["sections"])}')

print('\n' + '='*70)
print('FRONTEND INTEGRATION CHECKLIST')
print('='*70)
print('✓ Backend API ready at: http://127.0.0.1:8000/api/pages/1/snapshot/')
print('✓ Frontend should load from API')
print('✓ Edit mode should show: "Homepage source: Django API"')
print('✓ Field edits should PATCH to: /api/fields/<id>/')
print('\nTo test:')
print('  1. Visit: http://localhost:3000/en/')
print('  2. Enable edit mode')
print('  3. Check status indicator at bottom-left')
print('  4. Edit any field and verify it saves to Django')
print('  5. Refresh page to confirm persistence')
