import os
import sys
import django
from django.conf import settings

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

def test_template_rendering():
    """Test that our sites exist and have the correct template configurations"""
    
    print("=== TEMPLATE LAB STEP 2 - TESTING SITE CONFIGURATIONS ===\n")
    
    # Get Mary's Restaurant site
    try:
        marys_site = SiteProject.objects.get(name__icontains="mary")
        print(f"✅ Mary's Restaurant found:")
        print(f"   - Site Name: {marys_site.name}")
        print(f"   - Template: {marys_site.site_template.key if marys_site.site_template else 'None'}")
        print(f"   - Pages: {marys_site.pages.count()}")
        print(f"   - Sections: {sum(page.sections.count() for page in marys_site.pages.all())}")
        
        # Check if template key matches expected
        if marys_site.site_template and marys_site.site_template.key == "restaurant-modern":
            print("   ✅ Template key matches 'restaurant-modern'")
        else:
            print(f"   ⚠️  Template key is '{marys_site.site_template.key if marys_site.site_template else 'None'}', expected 'restaurant-modern'")
        
        # List sections and their identifiers
        print("   - Section identifiers:")
        for page in marys_site.pages.all():
            for section in page.sections.all():
                print(f"     • {section.identifier} ({section.internal_name})")
        
    except SiteProject.DoesNotExist:
        print("❌ Mary's Restaurant site not found")
    
    print()
    
    # Get Oficina Paulo Calibra site
    try:
        garage_site = SiteProject.objects.get(name__icontains="oficina")
        print(f"✅ Oficina Paulo Calibra found:")
        print(f"   - Site Name: {garage_site.name}")
        print(f"   - Template: {garage_site.site_template.key if garage_site.site_template else 'None'}")
        print(f"   - Pages: {garage_site.pages.count()}")
        print(f"   - Sections: {sum(page.sections.count() for page in garage_site.pages.all())}")
        
        # Check if template key matches expected
        if garage_site.site_template and garage_site.site_template.key == "auto-garage-modern":
            print("   ✅ Template key matches 'auto-garage-modern'")
        else:
            print(f"   ⚠️  Template key is '{garage_site.site_template.key if garage_site.site_template else 'None'}', expected 'auto-garage-modern'")
        
        # List sections and their identifiers
        print("   - Section identifiers:")
        for page in garage_site.pages.all():
            for section in page.sections.all():
                print(f"     • {section.identifier} ({section.internal_name})")
        
    except SiteProject.DoesNotExist:
        print("❌ Oficina Paulo Calibra site not found")
    
    print()
    
    # Summary
    total_sites = SiteProject.objects.count()
    print(f"📊 Total sites in database: {total_sites}")
    
    # List all available site templates
    from sites.models import SiteTemplate
    templates = SiteTemplate.objects.all()
    print(f"📋 Available templates: {templates.count()}")
    for template in templates:
        print(f"   - {template.key}: {template.name}")
    
    print("\n=== TEST COMPLETE ===")

if __name__ == "__main__":
    test_template_rendering()