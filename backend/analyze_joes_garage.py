#!/usr/bin/env python3
"""
Analyze Joe's Garage site structure and identify what needs to be updated
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

from sites.models import SiteProject, Page, Section, Field

def analyze_joes_garage():
    """Analyze Joe's Garage site structure"""
    
    try:
        # Get Joe's Garage project
        project = SiteProject.objects.get(slug='joes-garage')
        print(f"🔧 Site: {project.name}")
        print(f"Template Key: {project.site_template.key if project.site_template else 'No template'}")
        print()
        
        # Get all pages
        pages = Page.objects.filter(project=project).order_by('order')
        
        for page in pages:
            print(f"📄 Page {page.order}: {page.slug} - '{page.title}'")
            print()
            
            sections = Section.objects.filter(page=page).order_by('order')
            for section in sections:
                print(f"  🔧 Section {section.order}: {section.identifier}")
                print(f"     Internal Name: {section.internal_name}")
                print(f"     Order: {section.order}")
                
                # Check if mapped to component
                known_identifiers = [
                    "hero-basic", "about-basic", "services-grid", "contact-card", 
                    "testimonials-basic", "menu-list", "garage-quote-form", "auto-diagnostics",
                    "hero-banner", "about-us", "restaurant-footer", "appetizers", "main-courses", "contact-info",
                    "jcw-auto-garage-modern-01-hero-01", "jcw-auto-garage-modern-01-services-01",
                    "jcw-auto-garage-modern-01-diagnostics-01", "jcw-auto-garage-modern-01-testimonials-01",
                    "jcw-auto-garage-modern-01-form-quote-01", "jcw-auto-garage-modern-01-contact-01",
                    "jcw-auto-garage-modern-01-why-choose-01"
                ]
                
                if section.identifier in known_identifiers:
                    print(f"     ✅ Mapped to component")
                else:
                    print(f"     ❌ NOT MAPPED - will show error message")
                
                fields = Field.objects.filter(section=section)
                print(f"     📊 Fields: {len(fields)}")
                
                if fields:
                    print("     Field Keys:")
                    for field in fields:
                        value_preview = field.value[:30] + '...' if len(field.value) > 30 else field.value
                        print(f"       • {field.key}: '{value_preview}'")
                print()
                
    except SiteProject.DoesNotExist:
        print("❌ Joe's Garage site not found")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🔍 Analyzing Joe's Garage Site Structure")
    print("=" * 60)
    analyze_joes_garage()

if __name__ == "__main__":
    main()