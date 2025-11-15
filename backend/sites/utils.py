"""
Template Builder utilities for cloning and skeleton generation.
"""
import uuid
from typing import Optional, List
from django.contrib.auth.models import User
from django.utils.text import slugify

from .models import (
    SiteProject, SiteTemplate, Page, Section, Field, NavigationItem,
    LocaleChoices
)


def clone_project_structure(
    src_project: SiteProject, 
    *,
    owner: Optional[User] = None,
    name: Optional[str] = None,
    slug: Optional[str] = None,
    locales: Optional[List[str]] = None
) -> SiteProject:
    """
    Clones a SiteProject's complete structure including Pages, Sections, Fields, and NavigationItems.
    
    Args:
        src_project: Source project to clone from
        owner: New owner for the cloned project (defaults to src_project.owner)
        name: New name (defaults to "{src_name} (Copy)")
        slug: New slug (auto-generated if not provided)
        locales: List of locale codes to clone (defaults to source project locales)
    
    Returns:
        New SiteProject with cloned structure
    """
    # Set defaults
    if owner is None:
        owner = src_project.owner
    if name is None:
        name = f"{src_project.name} (Copy)"
    if slug is None:
        base_slug = slugify(name)
        counter = 1
        slug = base_slug
        while SiteProject.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    if locales is None:
        # Get all locales from source project pages
        source_locales = list(src_project.pages.values_list('locale', flat=True).distinct())
        locales = source_locales if source_locales else ['en']
    
    # Create new project
    new_project = SiteProject.objects.create(
        owner=owner,
        template=src_project.template,
        site_template=src_project.site_template,
        name=name,
        slug=slug,
        business_type=src_project.business_type,
        primary_goal=src_project.primary_goal,
        primary_locale=src_project.primary_locale,
        additional_locales=src_project.additional_locales,
        default_theme=src_project.default_theme,
        allow_theme_toggle=src_project.allow_theme_toggle,
        primary_color=src_project.primary_color,
        accent_color=src_project.accent_color,
        hero_particles_enabled=src_project.hero_particles_enabled,
        hero_particles_density=src_project.hero_particles_density,
        hero_particles_speed=src_project.hero_particles_speed,
        hero_particles_size=src_project.hero_particles_size,
        header_background_mode=src_project.header_background_mode,
        notes=src_project.notes,
        is_active=True,
        is_master_template=False  # Cloned projects are not master templates
    )
    
    # Clone pages for each locale
    page_mapping = {}  # Track old_page_id -> new_page for navigation cloning
    
    for locale in locales:
        source_pages = src_project.pages.filter(locale=locale).order_by('order')
        
        for src_page in source_pages:
            new_page = Page.objects.create(
                project=new_project,
                slug=src_page.slug,
                path=src_page.path,
                title=src_page.title,
                order=src_page.order,
                is_published=src_page.is_published,
                locale=locale
            )
            page_mapping[src_page.id] = new_page
            
            # Clone sections
            section_mapping = {}
            for src_section in src_page.sections.all().order_by('order'):
                new_section = Section.objects.create(
                    page=new_page,
                    identifier=src_section.identifier,
                    internal_name=src_section.internal_name,
                    order=src_section.order
                )
                section_mapping[src_section.id] = new_section
                
                # Clone fields
                for src_field in src_section.fields.all().order_by('order'):
                    Field.objects.create(
                        section=new_section,
                        key=src_field.key,
                        label=src_field.label,
                        value=src_field.value,
                        order=src_field.order
                    )
    
    # Clone navigation items
    for src_nav in src_project.navigation_items.all():
        # Handle page references
        page_ref = None
        if src_nav.page and src_nav.page.id in page_mapping:
            page_ref = page_mapping[src_nav.page.id]
        
        NavigationItem.objects.create(
            project=new_project,
            locale=src_nav.locale,
            parent=None,  # TODO: Handle nested navigation if needed
            location=src_nav.location,
            column=src_nav.column,
            label=src_nav.label,
            page=page_ref,
            url=src_nav.url,
            is_external=src_nav.is_external,
            order=src_nav.order
        )
    
    return new_project


def ensure_template_skeleton(site_template: SiteTemplate) -> SiteProject:
    """
    Creates or updates a hidden master SiteProject for the given SiteTemplate.
    
    This master project serves as the skeleton/blueprint for new projects created from this template.
    
    Args:
        site_template: The SiteTemplate to create skeleton for
        
    Returns:
        The master SiteProject (created or existing)
    """
    master_name = f"{site_template.key}-master"
    master_slug = f"{site_template.key}-master"
    
    # Get or create a system user for master templates
    from django.contrib.auth.models import User
    system_user, created = User.objects.get_or_create(
        username='system_template_builder',
        defaults={
            'email': 'system@justcodeworks.com',
            'first_name': 'System',
            'last_name': 'Template Builder',
            'is_active': False,  # System user, not for login
        }
    )
    
    # Get or create master project
    master_project, created = SiteProject.objects.get_or_create(
        slug=master_slug,
        defaults={
            'owner': system_user,  # Use system user instead of NULL
            'site_template': site_template,
            'name': master_name,
            'business_type': 'Template Skeleton',
            'primary_goal': 'show-info',
            'primary_locale': 'en',
            'is_master_template': True,
            'is_active': False,  # Hidden from normal project lists
        }
    )
    
    # Clear existing structure if updating
    if not created:
        master_project.pages.all().delete()
        master_project.navigation_items.all().delete()
    
    # Create default page structure
    pages_data = [
        {'slug': 'home', 'path': '/', 'title': 'Home', 'order': 0},
        {'slug': 'about', 'path': '/about', 'title': 'About Us', 'order': 1},
        {'slug': 'services', 'path': '/services', 'title': 'Services', 'order': 2},
        {'slug': 'contact', 'path': '/contact', 'title': 'Contact', 'order': 3},
    ]
    
    for page_data in pages_data:
        page = Page.objects.create(
            project=master_project,
            locale='en',
            **page_data
        )
        
        # Add sections based on page type
        if page.slug == 'home':
            _create_home_sections(page)
        elif page.slug == 'about':
            _create_about_sections(page)
        elif page.slug == 'services':
            _create_services_sections(page)
        elif page.slug == 'contact':
            _create_contact_sections(page)
    
    # Create default navigation
    _create_default_navigation(master_project)
    
    return master_project


def _create_home_sections(page: Page):
    """Create default sections for home page."""
    sections_data = [
        {
            'identifier': 'front-hero1',
            'internal_name': 'Hero Section',
            'order': 0,
            'fields': [
                {'key': 'title', 'label': 'Main Title', 'value': 'Welcome to Our Website', 'order': 0},
                {'key': 'subtitle', 'label': 'Subtitle', 'value': 'We provide amazing services', 'order': 1},
                {'key': 'cta_text', 'label': 'Call to Action Text', 'value': 'Get Started', 'order': 2},
                {'key': 'cta_url', 'label': 'Call to Action URL', 'value': '/contact', 'order': 3},
            ]
        },
        {
            'identifier': 'front-services1',
            'internal_name': 'Services Overview',
            'order': 1,
            'fields': [
                {'key': 'title', 'label': 'Section Title', 'value': 'Our Services', 'order': 0},
                {'key': 'description', 'label': 'Description', 'value': 'We offer a range of professional services', 'order': 1},
                {'key': 'items', 'label': 'Service Items (JSON)', 'value': '[]', 'order': 2},
            ]
        },
        {
            'identifier': 'front-cta1',
            'internal_name': 'Call to Action',
            'order': 2,
            'fields': [
                {'key': 'title', 'label': 'CTA Title', 'value': 'Ready to Get Started?', 'order': 0},
                {'key': 'text', 'label': 'CTA Text', 'value': 'Contact us today', 'order': 1},
                {'key': 'button_text', 'label': 'Button Text', 'value': 'Contact Us', 'order': 2},
                {'key': 'button_url', 'label': 'Button URL', 'value': '/contact', 'order': 3},
            ]
        }
    ]
    
    for section_data in sections_data:
        fields_data = section_data.pop('fields')
        section = Section.objects.create(page=page, **section_data)
        
        for field_data in fields_data:
            Field.objects.create(section=section, **field_data)


def _create_about_sections(page: Page):
    """Create default sections for about page."""
    section = Section.objects.create(
        page=page,
        identifier='about-main1',
        internal_name='About Content',
        order=0
    )
    
    Field.objects.create(
        section=section,
        key='title',
        label='Page Title',
        value='About Us',
        order=0
    )
    Field.objects.create(
        section=section,
        key='content',
        label='Main Content',
        value='Tell your story here...',
        order=1
    )


def _create_services_sections(page: Page):
    """Create default sections for services page."""
    section = Section.objects.create(
        page=page,
        identifier='services-main1',
        internal_name='Services Content',
        order=0
    )
    
    Field.objects.create(
        section=section,
        key='title',
        label='Page Title',
        value='Our Services',
        order=0
    )
    Field.objects.create(
        section=section,
        key='services_list',
        label='Services List (JSON)',
        value='[]',
        order=1
    )


def _create_contact_sections(page: Page):
    """Create default sections for contact page."""
    section = Section.objects.create(
        page=page,
        identifier='contact-main1',
        internal_name='Contact Content',
        order=0
    )
    
    fields_data = [
        {'key': 'title', 'label': 'Page Title', 'value': 'Contact Us', 'order': 0},
        {'key': 'address', 'label': 'Address', 'value': 'Your address here', 'order': 1},
        {'key': 'phone', 'label': 'Phone', 'value': 'Your phone here', 'order': 2},
        {'key': 'email', 'label': 'Email', 'value': 'your@email.com', 'order': 3},
    ]
    
    for field_data in fields_data:
        Field.objects.create(section=section, **field_data)


def _create_default_navigation(project: SiteProject):
    """Create default navigation items."""
    nav_items = [
        {'location': 'header', 'label': 'Home', 'url': '/', 'order': 0},
        {'location': 'header', 'label': 'About', 'url': '/about', 'order': 1},
        {'location': 'header', 'label': 'Services', 'url': '/services', 'order': 2},
        {'location': 'header', 'label': 'Contact', 'url': '/contact', 'order': 3},
        
        # Footer navigation
        {'location': 'footer', 'label': 'Home', 'url': '/', 'column': 1, 'order': 0},
        {'location': 'footer', 'label': 'About', 'url': '/about', 'column': 1, 'order': 1},
        {'location': 'footer', 'label': 'Services', 'url': '/services', 'column': 2, 'order': 0},
        {'location': 'footer', 'label': 'Contact', 'url': '/contact', 'column': 2, 'order': 1},
    ]
    
    for nav_data in nav_items:
        NavigationItem.objects.create(
            project=project,
            locale='en',
            **nav_data
        )