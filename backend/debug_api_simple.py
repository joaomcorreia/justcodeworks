import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import DashboardTemplate
from sites.serializers import DashboardTemplateSerializer
from django.contrib.auth.models import User

print('=== DASHBOARD API DEBUG ===')

# Test the serializer
template = DashboardTemplate.objects.filter(
    is_active=True,
    is_default_for_tenants=True,
).prefetch_related("blocks").first()

if template:
    print(f'✅ Found template: {template.name}')
    
    # Test serialization
    try:
        serializer = DashboardTemplateSerializer(template)
        data = serializer.data
        print('✅ Serialization successful!')
        print(f'📊 Template data: {data["name"]} with {len(data["blocks"])} blocks')
        
        # Print blocks info
        print('\n📋 Blocks:')
        for block in data["blocks"]:
            print(f'  - {block["title"]} ({block["key"]})')
            print(f'    Region: {block["region"]}, Order: {block["order"]}, Active: {block["is_active"]}')
        
    except Exception as e:
        print(f'❌ Serialization error: {e}')
        import traceback
        traceback.print_exc()
        
else:
    print('❌ ERROR: No template found!')

print('\n=== USER STATUS ===')
users = User.objects.all()
print(f'Total users: {users.count()}')
for user in users:
    print(f'  - {user.username} (active: {user.is_active}, staff: {user.is_staff})')

print('\n=== API ENDPOINT CHECK ===')
print('The frontend is calling: /api/dashboard/template/')
print('This should map to: TenantDashboardTemplateView')
print('Check if the URL is correct and accessible')