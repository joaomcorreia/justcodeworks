#!/usr/bin/env python
"""
Transfer DashboardTemplate and DashboardBlock data from sites app to tenant_dashboards app
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.db import transaction


def transfer_dashboard_data():
    """Transfer dashboard data from sites to tenant_dashboards app"""
    
    # Import the old models from sites
    from sites.models import DashboardTemplate as OldDashboardTemplate
    from sites.models import DashboardBlock as OldDashboardBlock
    
    # Import the new models from tenant_dashboards (after migration)
    from tenant_dashboards.models import DashboardTemplate as NewDashboardTemplate
    from tenant_dashboards.models import DashboardBlock as NewDashboardBlock
    
    print("📊 Starting dashboard data transfer from sites to tenant_dashboards...")
    
    with transaction.atomic():
        # Transfer DashboardTemplate data
        old_templates = OldDashboardTemplate.objects.all()
        print(f"📋 Found {old_templates.count()} dashboard templates to transfer")
        
        template_mapping = {}  # old_id -> new_instance
        
        for old_template in old_templates:
            new_template = NewDashboardTemplate.objects.create(
                key=old_template.key,
                name=old_template.name,
                description=old_template.description,
                is_active=old_template.is_active,
                is_default_for_tenants=old_template.is_default_for_tenants,
                created_at=old_template.created_at,
                updated_at=old_template.updated_at,
            )
            template_mapping[old_template.id] = new_template
            print(f"  ✅ Transferred template: {old_template.name}")
        
        # Transfer DashboardBlock data
        old_blocks = OldDashboardBlock.objects.all()
        print(f"🧩 Found {old_blocks.count()} dashboard blocks to transfer")
        
        for old_block in old_blocks:
            new_template = template_mapping[old_block.template_id]
            NewDashboardBlock.objects.create(
                template=new_template,
                key=old_block.key,
                title=old_block.title,
                description=old_block.description,
                region=old_block.region,
                order=old_block.order,
                is_active=old_block.is_active,
                target_route=old_block.target_route,
                created_at=old_block.created_at,
                updated_at=old_block.updated_at,
            )
            print(f"  ✅ Transferred block: {old_block.title} ({new_template.name})")
    
    print(f"🎉 Successfully transferred {len(template_mapping)} templates and {old_blocks.count()} blocks!")
    print("📂 Dashboard data is now in the 'Tenant Dashboards' section")


if __name__ == '__main__':
    transfer_dashboard_data()