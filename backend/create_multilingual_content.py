#!/usr/bin/env python
"""
Create localized content for Portuguese and Dutch main website
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainPage, MainSection, MainField
from django.db import transaction


def create_localized_content():
    """Create Portuguese and Dutch content by translating English content"""
    
    print("🌐 Creating localized content for Portuguese and Dutch...")
    
    # Translation dictionaries
    section_translations = {
        'pt': {
            # Section internal names
            'Hero Section': 'Seção Herói',
            'Services Preview': 'Pré-visualização de Serviços',
            'Website Preview': 'Pré-visualização de Sites',
            'Print Preview': 'Pré-visualização de Impressão',
            'POS Preview': 'Pré-visualização POS',
            'AI Tools Preview': 'Pré-visualização de Ferramentas IA',
            'Call to Action': 'Chamada para Ação'
        },
        'nl': {
            # Section internal names
            'Hero Section': 'Hero Sectie',
            'Services Preview': 'Diensten Voorbeeld',
            'Website Preview': 'Website Voorbeeld', 
            'Print Preview': 'Print Voorbeeld',
            'POS Preview': 'POS Voorbeeld',
            'AI Tools Preview': 'AI Tools Voorbeeld',
            'Call to Action': 'Call to Action'
        }
    }
    
    field_translations = {
        'pt': {
            # Common field content
            'Everything you need to get your business online': 'Tudo o que precisa para colocar o seu negócio online',
            'Websites, printing, POS systems, and smart tools to grow your business': 'Sites, impressão, sistemas POS e ferramentas inteligentes para fazer crescer o seu negócio',
            'Pick a template →': 'Escolher um modelo →',
            'Professional Websites That Drive Results': 'Sites Profissionais Que Geram Resultados',
            'From simple landing pages to complex e-commerce stores': 'De páginas simples a lojas de e-commerce complexas',
            'Start Your Website': 'Criar o Seu Site',
            'Modern Point of Sale Systems': 'Sistemas de Ponto de Venda Modernos',
            'Complete retail and restaurant POS solutions': 'Soluções completas de POS para retalho e restaurantes',
            'Get POS System': 'Obter Sistema POS',
            'Complete Business Solutions': 'Soluções Empresariais Completas',
            'Everything your business needs to succeed online and offline': 'Tudo o que o seu negócio precisa para ter sucesso online e offline',
            'Explore Services': 'Explorar Serviços',
            'Help & Support Center': 'Centro de Ajuda e Suporte',
            'Find answers, get support, and learn how to make the most of our tools': 'Encontre respostas, obtenha suporte e aprenda a tirar o máximo partido das nossas ferramentas',
            'Search Help Articles': 'Pesquisar Artigos de Ajuda',
            'Professional Print Services': 'Serviços de Impressão Profissionais',
            'Business cards, flyers, banners, and custom printing solutions': 'Cartões de visita, folhetos, banners e soluções de impressão personalizadas',
            'View Print Services': 'Ver Serviços de Impressão',
            'Get Started': 'Começar',
            'Learn More': 'Saber Mais',
            'Contact Us': 'Contactar-nos'
        },
        'nl': {
            # Common field content
            'Everything you need to get your business online': 'Alles wat u nodig heeft om uw bedrijf online te krijgen',
            'Websites, printing, POS systems, and smart tools to grow your business': 'Websites, print, POS systemen en slimme tools om uw bedrijf te laten groeien',
            'Pick a template →': 'Kies een template →',
            'Professional Websites That Drive Results': 'Professionele Websites Die Resultaten Opleveren',
            'From simple landing pages to complex e-commerce stores': 'Van eenvoudige landingspaginas tot complexe e-commerce winkels',
            'Start Your Website': 'Start Uw Website',
            'Modern Point of Sale Systems': 'Moderne Kassasystemen',
            'Complete retail and restaurant POS solutions': 'Volledige retail en restaurant POS oplossingen',
            'Get POS System': 'Krijg POS Systeem',
            'Complete Business Solutions': 'Volledige Bedrijfsoplossingen',
            'Everything your business needs to succeed online and offline': 'Alles wat uw bedrijf nodig heeft om online en offline te slagen',
            'Explore Services': 'Verken Diensten',
            'Help & Support Center': 'Hulp & Ondersteuning Center',
            'Find answers, get support, and learn how to make the most of our tools': 'Vind antwoorden, krijg ondersteuning en leer hoe u het meeste uit onze tools haalt',
            'Search Help Articles': 'Zoek Hulp Artikelen',
            'Professional Print Services': 'Professionele Print Diensten',
            'Business cards, flyers, banners, and custom printing solutions': 'Visitekaartjes, flyers, banners en aangepaste print oplossingen',
            'View Print Services': 'Bekijk Print Diensten',
            'Get Started': 'Aan de Slag',
            'Learn More': 'Meer Leren',
            'Contact Us': 'Neem Contact Op'
        }
    }
    
    with transaction.atomic():
        # Get all English sections and fields
        english_sections = MainSection.objects.filter(page__locale='en').prefetch_related('fields', 'page')
        
        print(f"📋 Found {english_sections.count()} English sections to translate")
        
        created_sections = {'pt': 0, 'nl': 0}
        created_fields = {'pt': 0, 'nl': 0}
        
        for locale in ['pt', 'nl']:
            locale_name = {'pt': 'Portuguese', 'nl': 'Dutch'}[locale]
            print(f"\n🇵🇹🇳🇱 Creating {locale_name} content...")
            
            for en_section in english_sections:
                # Get the corresponding page in this locale
                try:
                    locale_page = MainPage.objects.get(
                        slug=en_section.page.slug,
                        locale=locale
                    )
                except MainPage.DoesNotExist:
                    print(f"  ⚠️  No {locale_name} page found for {en_section.page.slug}")
                    continue
                
                # Check if section already exists
                section_exists = MainSection.objects.filter(
                    page=locale_page,
                    identifier=en_section.identifier,
                    locale=locale
                ).exists()
                
                if section_exists:
                    print(f"  ⏭️  Section {en_section.identifier} already exists in {locale_name}")
                    continue
                
                # Translate section name
                translated_internal_name = section_translations[locale].get(
                    en_section.internal_name, 
                    en_section.internal_name
                )
                
                # Create localized section
                locale_section = MainSection.objects.create(
                    page=locale_page,
                    identifier=en_section.identifier,
                    internal_name=translated_internal_name,
                    locale=locale,
                    order=en_section.order
                )
                
                print(f"  ✅ Created section: {en_section.identifier} ({translated_internal_name})")
                created_sections[locale] += 1
                
                # Create localized fields for this section
                english_fields = en_section.fields.all()
                
                for en_field in english_fields:
                    # Translate field value
                    translated_value = field_translations[locale].get(
                        en_field.value,
                        en_field.value  # Keep original if no translation
                    )
                    
                    # Create localized field
                    MainField.objects.create(
                        section=locale_section,
                        key=en_field.key,
                        label=en_field.label,
                        value=translated_value,
                        order=en_field.order
                    )
                    
                    created_fields[locale] += 1
                
                field_count = english_fields.count()
                print(f"    └─ Created {field_count} fields")
        
        print(f"\n🎉 Content creation summary:")
        for locale in ['pt', 'nl']:
            locale_name = {'pt': 'Portuguese', 'nl': 'Dutch'}[locale]
            sections = created_sections[locale]
            fields = created_fields[locale]
            print(f"   • {locale_name} ({locale}): {sections} sections, {fields} fields")
        
        return created_sections, created_fields


def verify_multilingual_content():
    """Verify the final multilingual content structure"""
    
    print("\n🔍 Verifying multilingual content structure...")
    
    for locale in ['en', 'pt', 'nl']:
        locale_name = {'en': 'English', 'pt': 'Portuguese', 'nl': 'Dutch'}[locale]
        
        pages = MainPage.objects.filter(locale=locale)
        sections = MainSection.objects.filter(locale=locale)  
        fields = MainField.objects.filter(section__locale=locale)
        
        print(f"\n🌐 {locale_name} ({locale}):")
        print(f"   📄 Pages: {pages.count()}")
        print(f"   📂 Sections: {sections.count()}")
        print(f"   🏷️  Fields: {fields.count()}")
        
        # Show breakdown by page
        for page in pages:
            page_sections = sections.filter(page=page)
            page_fields = fields.filter(section__page=page)
            print(f"     - {page.title}: {page_sections.count()} sections, {page_fields.count()} fields")


if __name__ == '__main__':
    sections, fields = create_localized_content()
    verify_multilingual_content()
    print(f"\n🎯 Multilingual content creation complete!")