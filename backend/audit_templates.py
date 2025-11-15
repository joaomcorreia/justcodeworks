#!/usr/bin/env python
"""
Audit script to check Template and SiteTemplate data
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import Template, SiteTemplate

def audit_templates():
    print("=== TEMPLATE MODELS AUDIT ===")
    
    print("\n1. TEMPLATE MODEL (Internal JCW templates):")
    templates = Template.objects.all()
    for t in templates:
        print(f"  - {t.slug}: {t.name} (category={t.category})")
    
    print("\n2. SITETEMPLATE MODEL (User-facing templates):")
    site_templates = SiteTemplate.objects.all()
    for st in site_templates:
        print(f"  - {st.key}: {st.name} (active={st.is_active}, user_selectable={getattr(st, 'is_user_selectable', 'N/A')})")
    
    print(f"\nSUMMARY:")
    print(f"  Template records: {templates.count()}")
    print(f"  SiteTemplate records: {site_templates.count()}")
    
    print("\n=== END AUDIT ===")

if __name__ == "__main__":
    audit_templates()