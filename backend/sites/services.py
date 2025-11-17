# [TEMPLAB] Services for Template Lab functionality

from typing import Optional
from .models import Section, TemplateSection, TemplateSectionField


def create_template_section_from_section(
    section: Section, 
    *, 
    key: Optional[str] = None, 
    name: Optional[str] = None
) -> TemplateSection:
    """
    Create a TemplateSection from an existing Section and its Fields.
    Does not mutate the original Section.
    
    Args:
        section: The Section to clone
        key: Optional custom key/code for the TemplateSection
        name: Optional custom name for the TemplateSection
        
    Returns:
        The created TemplateSection with cloned fields
    """
    if key is None:
        # Generate key pattern: jcw-<template-key>-<page-slug>-<section-identifier>
        template_key = section.page.site.site_template.key.replace("_", "-")
        page_slug = section.page.slug.replace("_", "-") 
        section_id = section.identifier.replace("_", "-")
        key = f"jcw-{template_key}-{page_slug}-{section_id}"
        
        # Ensure uniqueness by appending counter if needed
        base_key = key
        counter = 1
        while TemplateSection.objects.filter(code=key).exists():
            key = f"{base_key}-{counter:02d}"
            counter += 1
    
    if name is None:
        name = section.internal_name or section.identifier
    
    # Create the TemplateSection
    template_section = TemplateSection.objects.create(
        site_template=section.page.site.site_template,
        identifier=section.identifier,
        internal_name=name,
        code=key,
        source_section=section,
        # Set reasonable defaults for other fields
        group=_extract_group_from_identifier(section.identifier),
        section_type=_infer_section_type(section.identifier),
        default_order=section.order,
        is_active=True,
        notes=f"Cloned from {section.page.site.name} - {section.page.title} - {section.identifier}"
    )
    
    # Copy all fields from the original section
    for field in section.fields.all().order_by("order", "id"):
        TemplateSectionField.objects.create(
            template_section=template_section,
            key=field.key,
            label=field.label,
            value=field.value,
            order=field.order
        )
    
    return template_section


def _extract_group_from_identifier(identifier: str) -> str:
    """
    Extract a group name from section identifier.
    Examples: 
    - 'hero-banner' -> 'hero'
    - 'jcw-restaurant-modern-01-hero-01' -> 'hero'
    - 'about-us' -> 'about'
    """
    # Common group patterns
    group_patterns = [
        'hero', 'about', 'menu', 'services', 'testimonials', 'contact',
        'gallery', 'pricing', 'team', 'portfolio', 'blog', 'footer',
        'cta', 'form', 'diagnostics', 'quote'
    ]
    
    identifier_lower = identifier.lower()
    for pattern in group_patterns:
        if pattern in identifier_lower:
            return pattern
    
    return 'other'


def _infer_section_type(identifier: str) -> str:
    """
    Infer section type from identifier for better categorization.
    """
    identifier_lower = identifier.lower()
    
    # Map identifier patterns to section types
    type_mappings = {
        'hero': 'hero',
        'about': 'about', 
        'menu': 'menu',
        'service': 'services',
        'testimonial': 'testimonials',
        'contact': 'form-contact',
        'quote': 'form-quote',
        'diagnostic': 'services',
        'gallery': 'gallery',
        'pricing': 'pricing',
        'team': 'team',
        'portfolio': 'portfolio',
        'blog': 'blog',
        'footer': 'footer',
        'cta': 'cta',
        'form': 'form-contact'
    }
    
    for pattern, section_type in type_mappings.items():
        if pattern in identifier_lower:
            return section_type
    
    return 'other'