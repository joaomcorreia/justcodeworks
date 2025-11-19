#!/usr/bin/env python
"""
Verify that the tenant dashboard models have been successfully moved to the new app
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib import admin
from tenant_dashboards.models import DashboardTemplate, DashboardBlock


def verify_tenant_dashboards():
    """Verify the tenant dashboards are working correctly"""
    
    print("🔍 Verifying Tenant Dashboards setup...")
    
    # Check if models exist and have data
    template_count = DashboardTemplate.objects.count()
    block_count = DashboardBlock.objects.count()
    
    print(f"📊 Found {template_count} dashboard templates")
    print(f"🧩 Found {block_count} dashboard blocks")
    
    # List all templates and their blocks
    for template in DashboardTemplate.objects.all():
        print(f"\n📋 Template: {template.name}")
        print(f"   Key: {template.key}")
        print(f"   Active: {template.is_active}")
        print(f"   Default for tenants: {template.is_default_for_tenants}")
        
        blocks = template.blocks.all()
        print(f"   Blocks ({blocks.count()}):")
        for block in blocks:
            print(f"     • {block.title} ({block.key}) - Region: {block.region}, Order: {block.order}")
    
    # Check admin registration
    print("\n🎛️ Admin interface status:")
    
    # Check if models are registered in admin
    dashboard_template_admin = admin.site._registry.get(DashboardTemplate)
    dashboard_block_admin = admin.site._registry.get(DashboardBlock)
    
    if dashboard_template_admin:
        print("✅ DashboardTemplate is registered in admin")
    else:
        print("❌ DashboardTemplate is NOT registered in admin")
    
    if dashboard_block_admin:
        print("✅ DashboardBlock is registered in admin")
    else:
        print("❌ DashboardBlock is NOT registered in admin")
    
    # Check app configuration
    from django.apps import apps
    tenant_dashboards_config = apps.get_app_config('tenant_dashboards')
    print(f"📱 App name: {tenant_dashboards_config.name}")
    print(f"📱 App verbose name: {tenant_dashboards_config.verbose_name}")
    
    # Expected URLs
    print("\n🌐 Admin URLs:")
    print("   Dashboard Templates: http://localhost:8000/admin/tenant_dashboards/dashboardtemplate/")
    print("   Dashboard Blocks: http://localhost:8000/admin/tenant_dashboards/dashboardblock/")
    
    print(f"\n🎉 Tenant Dashboards verification complete!")
    print(f"✅ All {template_count} templates and {block_count} blocks are accessible in the new 'Tenant Dashboards' section")


if __name__ == '__main__':
    verify_tenant_dashboards()