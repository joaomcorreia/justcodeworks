#!/usr/bin/env python3
"""
Convert the duplicate contact section (Section 6) to a "Why Choose Us" section
for the Oficina Paulo Calibra site
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

def convert_contact_to_why_choose_us():
    """Convert the duplicate contact section to a Why Choose Us section"""
    
    try:
        # Get the Oficina Paulo Calibra project
        project = SiteProject.objects.get(slug='oficina-paulo-calibra')
        print(f"Found project: {project.name}")
        
        # Get the home page
        home_page = Page.objects.get(project=project, slug='home')
        print(f"Found home page: {home_page.title}")
        
        # Get Section 6 (the duplicate contact section)
        contact_section = Section.objects.get(page=home_page, order=6)
        print(f"Found section 6: {contact_section.internal_name}")
        print(f"Current identifier: {contact_section.identifier}")
        
        # Change the section to a new type - Why Choose Us
        contact_section.identifier = 'jcw-auto-garage-modern-01-why-choose-01'
        contact_section.internal_name = 'Why Choose Us Section'
        contact_section.save()
        print("✅ Updated section type and name")
        
        # Clear existing fields
        Field.objects.filter(section=contact_section).delete()
        print("✅ Cleared old contact fields")
        
        # Create new fields for "Why Choose Us" section
        new_fields = [
            {
                'field_key': 'title',
                'field_type': 'text',
                'content': 'Porque Escolher a Oficina Paulo Calibra?'
            },
            {
                'field_key': 'subtitle', 
                'field_type': 'text',
                'content': 'Mais de 20 anos de experiência ao serviço dos nossos clientes'
            },
            {
                'field_key': 'feature_1_icon',
                'field_type': 'text', 
                'content': 'wrench'
            },
            {
                'field_key': 'feature_1_title',
                'field_type': 'text',
                'content': 'Experiência Comprovada'
            },
            {
                'field_key': 'feature_1_description',
                'field_type': 'text',
                'content': 'Mais de 20 anos no mercado com milhares de veículos reparados com sucesso.'
            },
            {
                'field_key': 'feature_2_icon',
                'field_type': 'text',
                'content': 'shield-check'
            },
            {
                'field_key': 'feature_2_title', 
                'field_type': 'text',
                'content': 'Garantia de Qualidade'
            },
            {
                'field_key': 'feature_2_description',
                'field_type': 'text',
                'content': 'Todos os nossos serviços incluem garantia e usamos apenas peças originais ou equivalentes.'
            },
            {
                'field_key': 'feature_3_icon',
                'field_type': 'text',
                'content': 'clock'
            },
            {
                'field_key': 'feature_3_title',
                'field_type': 'text', 
                'content': 'Rapidez e Eficiência'
            },
            {
                'field_key': 'feature_3_description',
                'field_type': 'text',
                'content': 'Diagnóstico rápido e reparações eficientes para minimizar o tempo sem o seu veículo.'
            },
            {
                'field_key': 'feature_4_icon',
                'field_type': 'text',
                'content': 'euro'
            },
            {
                'field_key': 'feature_4_title',
                'field_type': 'text',
                'content': 'Preços Transparentes'
            },
            {
                'field_key': 'feature_4_description', 
                'field_type': 'text',
                'content': 'Orçamentos claros e detalhados sem surpresas. Pagamento faseado disponível.'
            },
        ]
        
        # Create the new fields
        for field_data in new_fields:
            Field.objects.create(
                section=contact_section,
                key=field_data['field_key'],
                value=field_data['content']
            )
        
        print(f"✅ Created {len(new_fields)} new fields for Why Choose Us section")
        
        # Show the updated structure
        print(f"\n📋 Updated Section Structure:")
        print(f"   Section Identifier: {contact_section.identifier}")
        print(f"   Internal Name: {contact_section.internal_name}")
        print(f"   Fields: {Field.objects.filter(section=contact_section).count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🔄 Converting duplicate contact section to Why Choose Us section")
    print("=" * 60)
    
    success = convert_contact_to_why_choose_us()
    
    if success:
        print(f"\n✅ Successfully converted section!")
        print("   The duplicate contact section is now a 'Why Choose Us' section")
        print("   You'll need to create a WhyChooseUs component to render it")
    else:
        print(f"\n❌ Conversion failed")

if __name__ == "__main__":
    main()