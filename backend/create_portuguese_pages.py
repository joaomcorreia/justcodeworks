#!/usr/bin/env python
"""
Create Portuguese pages to match the English ones
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from main_site.models import MainPage
from django.db import transaction


def create_portuguese_pages():
    """Create Portuguese pages matching the English structure"""
    
    print("🇵🇹 Creating Portuguese pages...")
    
    # Portuguese page title translations
    translations = {
        'Home': 'Início',
        'Websites': 'Sites',
        'POS Systems': 'Sistemas POS',
        'Services': 'Serviços',
        'Print Lab': 'Laboratório de Impressão',
        'Help Center': 'Centro de Ajuda'
    }
    
    # Meta descriptions in Portuguese
    meta_descriptions = {
        'home': 'JustCodeWorks - Criação de sites profissionais, sistemas POS e serviços de impressão. Soluções digitais completas para o seu negócio.',
        'websites': 'Criação de sites profissionais e personalizados. Templates modernos, responsive design e otimização SEO.',
        'pos-systems': 'Sistemas POS completos para restaurantes, lojas e negócios. Gestão de vendas, inventário e relatórios.',
        'services': 'Serviços digitais completos: desenvolvimento web, marketing digital, SEO e suporte técnico.',
        'print-lab': 'Laboratório de impressão profissional. Cartões de visita, flyers, banners e materiais promocionais.',
        'help-center': 'Centro de ajuda e suporte técnico. Tutoriais, FAQs e documentação para todos os nossos serviços.'
    }
    
    with transaction.atomic():
        # Get all English pages
        english_pages = MainPage.objects.filter(locale='en').order_by('slug')
        
        print(f"📋 Found {english_pages.count()} English pages to translate")
        
        created_count = 0
        
        for en_page in english_pages:
            # Skip if Portuguese version already exists
            pt_exists = MainPage.objects.filter(
                slug=en_page.slug,
                locale='pt'
            ).exists()
            
            if pt_exists:
                print(f"  ⏭️  Skipping {en_page.title} - Portuguese version already exists")
                continue
            
            # Translate the title and meta description
            pt_title = translations.get(en_page.title, en_page.title)
            pt_meta_description = meta_descriptions.get(en_page.slug, f"Página {pt_title} - JustCodeWorks")
            
            # Create Portuguese page
            pt_page = MainPage.objects.create(
                slug=en_page.slug,  # Keep the same slug for URL consistency
                title=pt_title,
                locale='pt',
                meta_description=pt_meta_description,
                meta_title=pt_title,  # Use translated title for SEO
                indexable=en_page.indexable
            )
            
            print(f"  ✅ Created: {pt_title} ({en_page.slug})")
            created_count += 1
        
        print(f"\n🎉 Successfully created {created_count} Portuguese pages!")
        
        # Verify the result
        pt_page_count = MainPage.objects.filter(locale='pt').count()
        en_page_count = MainPage.objects.filter(locale='en').count()
        
        print(f"\n📊 Final page counts:")
        print(f"   • English (en): {en_page_count} pages")
        print(f"   • Portuguese (pt): {pt_page_count} pages")
        
        if en_page_count == pt_page_count:
            print(f"✅ Perfect! Pages are now balanced in both languages")
            return "balanced"
        else:
            print(f"⚠️  Still unbalanced: EN={en_page_count}, PT={pt_page_count}")
            return "unbalanced"


if __name__ == '__main__':
    result = create_portuguese_pages()
    print(f"\n🎯 Result: {result}")