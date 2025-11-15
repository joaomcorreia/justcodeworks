import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import DashboardTemplate, DashboardBlock

# Get the default template
template = DashboardTemplate.objects.get(key='default-tenant-dashboard')
print(f'Found template: {template.name}')

# Create some test blocks
blocks_data = [
    {
        'key': 'live-preview',
        'title': 'Live Preview Card',
        'description': 'Shows live preview of the user website',
        'region': 'main',
        'order': 1,
        'is_active': True,
        'target_route': '/dashboard/website'
    },
    {
        'key': 'next-steps',
        'title': 'Next Steps',
        'description': 'Onboarding steps for new users',
        'region': 'main',
        'order': 2,
        'is_active': True,
        'target_route': '/dashboard'
    },
    {
        'key': 'upgrade-banner',
        'title': 'Upgrade Banner',
        'description': 'Promote premium features',
        'region': 'sidebar',
        'order': 3,
        'is_active': False,
        'target_route': '/dashboard/settings'
    }
]

for block_data in blocks_data:
    block, created = DashboardBlock.objects.get_or_create(
        template=template,
        key=block_data['key'],
        defaults=block_data
    )
    status = "created" if created else "already exists"
    print(f'{block.title}: {status}')

print(f'Template now has {template.blocks.count()} blocks')