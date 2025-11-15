import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import *
from django.contrib.auth.models import User

print('=== TENANT WEBSITES CHECK ===')
print()

print('1. USERS:')
users = User.objects.all()
print(f'  Total users: {users.count()}')
for user in users[:5]:
    print(f'  - {user.username} ({user.email}) - Staff: {user.is_staff}')
print()

print('2. SITE PROJECTS (Tenant Websites):')
projects = SiteProject.objects.all()
print(f'  Total projects: {projects.count()}')
for project in projects[:10]:
    template_name = project.site_template.key if project.site_template else "None"
    owner_name = project.owner.username if project.owner else "None"
    print(f'  - "{project.name}" (Owner: {owner_name}) - Template: {template_name}')
print()

print('3. PAGES PER PROJECT:')
for project in projects[:5]:
    page_count = project.pages.count()
    print(f'  Project "{project.name}": {page_count} pages')
    
    # Show page details
    if page_count > 0:
        for page in project.pages.all()[:3]:
            section_count = page.sections.count()
            print(f'    └─ Page: "{page.title}" ({section_count} sections)')
print()

print('4. SAMPLE CONTENT ANALYSIS:')
sample_project = projects.first() if projects.exists() else None
if sample_project and sample_project.pages.exists():
    sample_page = sample_project.pages.first()
    print(f'  Sample page: "{sample_page.title}"')
    print(f'  Sections: {sample_page.sections.count()}')
    
    for section in sample_page.sections.all()[:3]:
        field_count = section.fields.count()
        print(f'    └─ Section: "{section.name}" ({field_count} fields)')
        
        # Show some field content
        for field in section.fields.all()[:3]:
            content_preview = (field.content[:50] + '...') if len(field.content) > 50 else field.content
            print(f'       └─ Field: "{field.name}" = "{content_preview}"')
else:
    print('  No content found')
print()

print('5. WEBSITE ACCESSIBILITY:')
if projects.exists():
    print('  ✅ Tenant websites exist!')
    print('  📊 Summary:')
    print(f'    - {projects.count()} website project(s)')
    total_pages = sum(p.pages.count() for p in projects)
    print(f'    - {total_pages} total pages')
    
    # Check if any have meaningful content
    content_projects = []
    for project in projects:
        if project.pages.exists():
            has_content = any(
                page.sections.exists() and 
                any(section.fields.filter(content__isnull=False, content__gt='').exists() 
                    for section in page.sections.all())
                for page in project.pages.all()
            )
            if has_content:
                content_projects.append(project)
    
    print(f'    - {len(content_projects)} project(s) with actual content')
    
    if content_projects:
        print('  🌐 Projects with content:')
        for project in content_projects:
            print(f'    - {project.name}')
    else:
        print('  ⚠️  No projects have actual content yet')
else:
    print('  ❌ No tenant websites exist')