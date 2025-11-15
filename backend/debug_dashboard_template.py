import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import DashboardTemplate

print('=== DASHBOARD TEMPLATE DEBUG ===')

# Check all templates
templates = DashboardTemplate.objects.all()
print(f'Total templates: {templates.count()}')

for template in templates:
    print(f'  Template: {template.key}')
    print(f'    Name: {template.name}')
    print(f'    Active: {template.is_active}')
    print(f'    Default for tenants: {template.is_default_for_tenants}')
    print(f'    Blocks: {template.blocks.count()}')
    print()

# Check for default template
default_template = DashboardTemplate.objects.filter(
    is_active=True,
    is_default_for_tenants=True
).first()

print(f'Default template found: {default_template.name if default_template else "NONE"}')

if not default_template:
    print('ERROR: No default template configured!')
    print('Setting default template...')
    
    # Set the first template as default
    first_template = templates.first()
    if first_template:
        first_template.is_default_for_tenants = True
        first_template.save()
        print(f'Set {first_template.name} as default template')
    else:
        print('ERROR: No templates exist at all!')