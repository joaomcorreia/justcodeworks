#!/usr/bin/env python3
"""
Create a new tire-center-premium template and apply it to Joe's Tire Center
"""

import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, SiteTemplate

def create_tire_center_template():
    """Create a new premium tire center template"""
    
    try:
        # Create the new template
        template, created = SiteTemplate.objects.get_or_create(
            key='tire-center-premium',
            defaults={
                'name': 'Tire Center Premium',
                'description': 'Premium design template specifically for tire centers with modern gradient styling and professional layout',
                'type': 'website',
                'category': 'Automotive',
                'status': 'published'
            }
        )
        
        if created:
            print(f"✅ Created new template: {template.name}")
        else:
            print(f"✅ Template already exists: {template.name}")
        
        # Apply to Joe's Tire Center
        project = SiteProject.objects.get(slug='joes-garage')
        project.site_template = template
        project.save()
        
        print(f"✅ Applied {template.name} to {project.name}")
        
        return template
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    print("🎨 Creating Premium Tire Center Template")
    print("=" * 50)
    
    template = create_tire_center_template()
    
    if template:
        print(f"\n🎉 Template created and applied!")
        print(f"   Template: {template.key}")
        print(f"   Next: Create custom renderer and components")

if __name__ == "__main__":
    main()