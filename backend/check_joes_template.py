import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

def check_joes_template():
    try:
        project = SiteProject.objects.get(slug='joes-garage')
        print(f"Project: {project.name}")
        print(f"Template: {project.site_template.key if project.site_template else 'No template'}")
        if project.site_template:
            print(f"Template name: {project.site_template.name}")
        
        # Check sections
        homepage = project.pages.first()
        if homepage:
            print(f"Homepage: {homepage.title}")
            sections = homepage.sections.all()
            print(f"Sections ({len(sections)}):")
            for section in sections:
                print(f"  - {section.identifier} (order: {section.order})")
        
    except SiteProject.DoesNotExist:
        print("Joe's Garage project not found!")

if __name__ == "__main__":
    check_joes_template()