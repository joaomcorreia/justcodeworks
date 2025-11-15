import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

# Get Mary's Restaurant data
try:
    project = SiteProject.objects.get(slug='marys-restaurant')
    print(f"Project: {project.name}")
    print(f"Template: {project.site_template.key}")
    
    print("\nPages and their sections:")
    for page in project.pages.all():
        print(f"\n  Page: {page.slug} ({page.title})")
        for section in page.sections.all().order_by('order'):
            print(f"    Section {section.order}: {section.identifier}")
    
    # Calculate total sections like the frontend does
    all_sections = []
    for page in project.pages.all():
        all_sections.extend(list(page.sections.all()))
    
    print(f"\nTotal sections across all pages: {len(all_sections)}")
    print("Section identifiers in order:")
    sorted_sections = sorted(all_sections, key=lambda s: s.order)
    for i, section in enumerate(sorted_sections, 1):
        print(f"  {i}. {section.identifier} (from {section.page.slug} page)")

except Exception as e:
    print(f"Error: {e}")