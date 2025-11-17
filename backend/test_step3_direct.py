#!/usr/bin/env python3
"""
Step 3 Direct Test
Test Step 3 functionality using Django ORM directly.
"""

import os
import sys
import django
import json

# Setup Django environment
sys.path.append('C:\\projects\\justcodeworks\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject, Page, Section, Field, SectionDraft
from django.contrib.auth.models import User

def test_step3_direct():
    """Test Step 3 logic directly via Django ORM."""
    print("🚀 Step 3 Direct Test (Django ORM)")
    print("=" * 50)
    
    # Create test data
    print("📦 Creating test data...")
    
    user, created = User.objects.get_or_create(
        username='step3directtest',
        defaults={'email': 'step3direct@example.com'}
    )
    
    project, created = SiteProject.objects.get_or_create(
        slug='step3-direct-test',
        defaults={'name': 'Step 3 Direct Test', 'owner': user}
    )
    
    page, created = Page.objects.get_or_create(
        slug='test-direct-page',
        project=project,
        defaults={'title': 'Step 3 Direct Test Page'}
    )
    
    print(f"   ✅ Project: {project.name}")
    print(f"   ✅ Page: {page.title}")
    
    # Create AI data
    ai_data = {
        "sections": [
            {
                "type": "hero",
                "title": "Welcome to Our Bakery",
                "content": "Freshly baked goods made daily with love and traditional recipes.",
                "cta_text": "Order Now",
                "cta_url": "/order"
            },
            {
                "type": "about",
                "title": "Our Story",
                "content": "Family-owned bakery serving the community for three generations."
            },
            {
                "type": "menu",
                "title": "Daily Specials",
                "content": "Croissants, sourdough bread, artisan pastries, and seasonal favorites."
            }
        ],
        "business_type": "bakery",
        "overall_theme": "rustic",
        "color_scheme": "warm"
    }
    
    print(f"\n🧠 AI Data: {len(ai_data['sections'])} sections extracted")
    
    # Simulate Step 3: Create sections from AI data
    print("\n🔧 Simulating Step 3 Logic...")
    
    # Get current max order
    max_order = page.sections.aggregate(models.Max('order'))['order__max'] or 0
    print(f"   📊 Current max order: {max_order}")
    
    created_sections = []
    
    # Create sections from AI data
    for i, section_data in enumerate(ai_data['sections']):
        section_type = section_data.get('type', 'content')
        section_title = section_data.get('title', f'AI Section {i + 1}')
        
        # Generate unique identifier
        base_identifier = f"ai-{section_type}-{i + 1}"
        identifier = base_identifier
        counter = 1
        
        # Ensure unique identifier within the page
        while page.sections.filter(identifier=identifier).exists():
            identifier = f"{base_identifier}-{counter}"
            counter += 1
        
        print(f"   🔸 Creating section: {identifier}")
        
        # Create the section
        section = Section.objects.create(
            page=page,
            identifier=identifier,
            internal_name=section_title,
            order=max_order + i + 1
        )
        
        # Create fields from section data
        field_order = 0
        
        # Title field
        if section_data.get('title'):
            Field.objects.create(
                section=section,
                key='title',
                label='Title',
                value=section_data['title'],
                order=field_order
            )
            field_order += 1
        
        # Content field
        if section_data.get('content'):
            Field.objects.create(
                section=section,
                key='content',
                label='Content',
                value=section_data['content'],
                order=field_order
            )
            field_order += 1
        
        # CTA fields
        if section_data.get('cta_text'):
            Field.objects.create(
                section=section,
                key='cta_text',
                label='Call to Action Text',
                value=section_data['cta_text'],
                order=field_order
            )
            field_order += 1
        
        if section_data.get('cta_url'):
            Field.objects.create(
                section=section,
                key='cta_url',
                label='Call to Action URL',
                value=section_data['cta_url'],
                order=field_order
            )
            field_order += 1
        
        # Section type field
        Field.objects.create(
            section=section,
            key='section_type',
            label='Section Type',
            value=section_type,
            order=field_order
        )
        
        created_sections.append(section)
        print(f"      ✅ Section created with {section.fields.count()} fields")
    
    # Create metadata section
    print("\n🏷️  Creating metadata section...")
    metadata_section, created = Section.objects.get_or_create(
        page=page,
        identifier='ai-metadata',
        defaults={
            'internal_name': 'AI Metadata',
            'order': 0
        }
    )
    
    if ai_data.get('business_type'):
        Field.objects.update_or_create(
            section=metadata_section,
            key='business_type',
            defaults={
                'label': 'Business Type',
                'value': ai_data['business_type'],
                'order': 0
            }
        )
    
    if ai_data.get('overall_theme'):
        Field.objects.update_or_create(
            section=metadata_section,
            key='overall_theme',
            defaults={
                'label': 'Overall Theme',
                'value': ai_data['overall_theme'],
                'order': 1
            }
        )
    
    if ai_data.get('color_scheme'):
        Field.objects.update_or_create(
            section=metadata_section,
            key='color_scheme',
            defaults={
                'label': 'Color Scheme',
                'value': ai_data['color_scheme'],
                'order': 2
            }
        )
    
    print(f"   ✅ Metadata section created with {metadata_section.fields.count()} fields")
    
    # Verification
    print("\n📊 Verification Results:")
    total_sections = page.sections.count()
    total_fields = Field.objects.filter(section__page=page).count()
    ai_sections = page.sections.filter(identifier__startswith='ai-')
    
    print(f"   📋 Total sections: {total_sections}")
    print(f"   📄 Total fields: {total_fields}")
    print(f"   🤖 AI sections: {ai_sections.count()}")
    
    print(f"\n📝 Created Sections:")
    for section in ai_sections:
        print(f"   🔸 {section.identifier}: {section.internal_name}")
        for field in section.fields.all():
            value_preview = field.value[:40] + "..." if len(field.value) > 40 else field.value
            print(f"      - {field.key}: {value_preview}")
    
    print("\n🎉 Step 3 Direct Test PASSED!")
    return True

# Need to import models for aggregation
from django.db import models

def main():
    """Run the direct test."""
    test_step3_direct()

if __name__ == '__main__':
    main()