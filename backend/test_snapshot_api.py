import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Page
from sites.serializers import PageSnapshotSerializer

# Get the first page
page = Page.objects.first()

if not page:
    print('No pages found. Run create_test_page_data.py first.')
    exit(1)

# Serialize it with the snapshot serializer
serializer = PageSnapshotSerializer(page)
data = serializer.data

print('=' * 60)
print(f'PAGE SNAPSHOT: {page.title} (ID: {page.id})')
print('=' * 60)
print(json.dumps(data, indent=2, default=str))
print('\n' + '=' * 60)
print('VERIFICATION')
print('=' * 60)
print(f'✓ Page ID: {data["id"]}')
print(f'✓ Page Title: {data["title"]}')
print(f'✓ Sections Count: {len(data["sections"])}')

for i, section in enumerate(data["sections"], 1):
    print(f'\nSection {i}: {section["internal_name"]} (identifier: {section["identifier"]})')
    print(f'  → Fields count: {len(section["fields"])}')
    for field in section["fields"]:
        print(f'    - {field["key"]}: "{field["value"][:50]}..."' if len(field["value"]) > 50 else f'    - {field["key"]}: "{field["value"]}"')

print('\n' + '=' * 60)
print('API ENDPOINT')
print('=' * 60)
print(f'GET http://127.0.0.1:8000/api/pages/{page.id}/snapshot/')
print('\nThis endpoint returns the complete page structure with all sections and fields.')
print('Perfect for hydrating the frontend page editor in one API call!')
