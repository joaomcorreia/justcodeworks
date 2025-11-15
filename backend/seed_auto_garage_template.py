#!/usr/bin/env python
"""
# [TEMPLAB] 
Creates Auto Garage Modern Template and Oficina Paulo Calibra Demo Site

This script creates:
1. auto-garage-modern SiteTemplate with Portuguese TemplateSections
2. Oficina Paulo Calibra SiteProject with realistic Portuguese content
3. Complete page structure (home, orçamento, contacto) with sections
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.contrib.auth.models import User
from sites.models import SiteTemplate, TemplateSection, SiteProject, Page, Section, Field

def create_auto_garage_template():
    """Create auto-garage-modern SiteTemplate with Portuguese TemplateSections"""
    
    print("🔧 Creating Auto Garage Modern Template...")
    
    # 1. Create or get auto garage template
    template, created = SiteTemplate.objects.get_or_create(
        key='auto-garage-modern',
        defaults={
            'name': 'Oficina Auto – Moderno',
            'description': 'Template moderno para oficinas de reparação automóvel.',
            'is_active': True
        }
    )
    
    if created:
        print(f"✅ Created template: {template.name}")
    else:
        print(f"📋 Using existing template: {template.name}")
    
    # 2. Define template sections with Portuguese content
    sections_data = [
        {
            'identifier': 'hero-garage',
            'internal_name': 'Hero – Oficina auto com destaque',
            'code': 'jcw-auto-garage-modern-01-hero-01',
            'group': 'hero',
            'variant_index': 1,
            'default_order': 1,
            'section_type': 'hero',
            'min_plan': 'free',
            'is_interactive': False,
            'notes': 'Hero com título forte, subtítulo e botão CTA.'
        },
        {
            'identifier': 'garage-services',
            'internal_name': 'Serviços principais',
            'code': 'jcw-auto-garage-modern-01-services-01',
            'group': 'services',
            'variant_index': 1,
            'default_order': 2,
            'section_type': 'services',
            'min_plan': 'free',
            'is_interactive': False,
            'notes': 'Lista de serviços: troca de óleo, revisão, travões, diagnóstico, etc.'
        },
        {
            'identifier': 'garage-diagnostics',
            'internal_name': 'Diagnóstico eletrónico',
            'code': 'jcw-auto-garage-modern-01-diagnostics-01',
            'group': 'services',
            'variant_index': 2,
            'default_order': 3,
            'section_type': 'services',
            'min_plan': 'paid',
            'is_interactive': False,
            'notes': 'Secção dedicada ao diagnóstico eletrónico com equipamentos modernos.'
        },
        {
            'identifier': 'quote-form',
            'internal_name': 'Formulário de pedido de orçamento',
            'code': 'jcw-auto-garage-modern-01-form-quote-01',
            'group': 'forms',
            'variant_index': 1,
            'default_order': 4,
            'section_type': 'forms',
            'min_plan': 'premium',
            'is_interactive': True,
            'notes': 'Formulário para pedir orçamento de serviços como troca de óleo, revisão, etc. Lógica avançada será adicionada mais tarde.'
        },
        {
            'identifier': 'garage-testimonials',
            'internal_name': 'Testemunhos de clientes',
            'code': 'jcw-auto-garage-modern-01-testimonials-01',
            'group': 'testimonials',
            'variant_index': 1,
            'default_order': 5,
            'section_type': 'testimonials',
            'min_plan': 'paid',
            'is_interactive': False,
            'notes': 'Depoimentos de clientes satisfeitos com os serviços da oficina.'
        },
        {
            'identifier': 'garage-contact',
            'internal_name': 'Contactos e localização',
            'code': 'jcw-auto-garage-modern-01-contact-01',
            'group': 'contact',
            'variant_index': 1,
            'default_order': 6,
            'section_type': 'contact',
            'min_plan': 'free',
            'is_interactive': False,
            'notes': 'Morada, telefone, horário e mapa.'
        }
    ]
    
    # 3. Create or update template sections
    created_count = 0
    updated_count = 0
    
    for section_data in sections_data:
        section, created = TemplateSection.objects.update_or_create(
            site_template=template,
            code=section_data['code'],
            defaults={
                'identifier': section_data['identifier'],
                'internal_name': section_data['internal_name'],
                'group': section_data['group'],
                'variant_index': section_data['variant_index'],
                'default_order': section_data['default_order'],
                'section_type': section_data['section_type'],
                'min_plan': section_data['min_plan'],
                'is_interactive': section_data['is_interactive'],
                'notes': section_data['notes'],
                'is_active': True,
            }
        )
        
        if created:
            created_count += 1
            print(f"✅ Created section: {section.internal_name}")
        else:
            updated_count += 1
            print(f"🔄 Updated section: {section.internal_name}")
    
    print(f"\n📊 Template Sections Summary:")
    print(f"   Created: {created_count} sections")
    print(f"   Updated: {updated_count} sections")
    
    return template

def create_oficina_paulo_calibra():
    """Create Oficina Paulo Calibra SiteProject with Portuguese content"""
    
    print("\n🚗 Creating Oficina Paulo Calibra Demo Site...")
    
    # 1. Get the auto garage template
    template = SiteTemplate.objects.get(key='auto-garage-modern')
    
    # 2. Get or create user for the garage
    garage_user, created = User.objects.get_or_create(
        username='paulo_calibra',
        defaults={
            'email': 'paulo@oficinacalibra.pt',
            'first_name': 'Paulo',
            'last_name': 'Calibra',
            'is_staff': False,
            'is_active': True
        }
    )
    
    if created:
        garage_user.set_password('garage123')
        garage_user.save()
        print(f"✅ Created user: {garage_user.username}")
    else:
        print(f"📋 Using existing user: {garage_user.username}")
    
    # 3. Create or get site project
    project, created = SiteProject.objects.update_or_create(
        slug='oficina-paulo-calibra',
        defaults={
            'name': 'Oficina Paulo Calibra',
            'site_template': template,
            'primary_locale': 'pt',
            'is_active': True,
            'owner': garage_user
        }
    )
    
    if created:
        print(f"✅ Created project: {project.name}")
    else:
        print(f"🔄 Updated project: {project.name}")
    
    # 4. Create pages with Portuguese content
    create_home_page(project)
    create_orcamento_page(project)
    create_contacto_page(project)
    
    return project

def create_home_page(project):
    """Create home page with hero, services, diagnostics, and testimonials"""
    
    print("📄 Creating home page...")
    
    # Create home page
    page, created = Page.objects.update_or_create(
        project=project,
        slug='home',
        defaults={
            'title': 'Oficina Paulo Calibra - Manutenção Automóvel',
            'path': '/',
            'is_published': True,
            'meta_description': 'Oficina de reparação automóvel de confiança. Troca de óleo, revisões, travões, diagnóstico eletrónico.',
            'order': 1,
            'locale': 'pt'
        }
    )
    
    # Create sections for home page
    sections_data = [
        {
            'template_section_code': 'jcw-auto-garage-modern-01-hero-01',
            'display_order': 1,
            'fields': [
                ('headline', 'Oficina Paulo Calibra'),
                ('subheadline', 'Manutenção e reparação automóvel de confiança em Lisboa'),
                ('cta_text', 'Pedir Orçamento'),
                ('cta_link', '/orcamento'),
                ('background_image', '/images/garage-hero.jpg')
            ]
        },
        {
            'template_section_code': 'jcw-auto-garage-modern-01-services-01',
            'display_order': 2,
            'fields': [
                ('title', 'Os Nossos Serviços'),
                ('subtitle', 'Soluções completas para o seu automóvel'),
                ('service_1_title', 'Troca de Óleo e Filtros'),
                ('service_1_description', 'Manutenção preventiva essencial para motor'),
                ('service_2_title', 'Revisão Geral'),
                ('service_2_description', 'Inspeção completa de todos os sistemas'),
                ('service_3_title', 'Travões e Suspensão'),
                ('service_3_description', 'Segurança e conforto na condução'),
                ('service_4_title', 'Diagnóstico Eletrónico'),
                ('service_4_description', 'Equipamento moderno para diagnósticos precisos')
            ]
        },
        {
            'template_section_code': 'jcw-auto-garage-modern-01-diagnostics-01',
            'display_order': 3,
            'fields': [
                ('title', 'Diagnóstico Eletrónico Avançado'),
                ('description', 'Utilizamos equipamento de última geração para identificar rapidamente qualquer problema no seu veículo. Diagnóstico preciso, reparação eficaz.'),
                ('feature_1', 'Scanner OBD-II profissional'),
                ('feature_2', 'Teste de todos os sistemas eletrónicos'),
                ('feature_3', 'Relatório detalhado de diagnóstico'),
                ('image', '/images/diagnostic-equipment.jpg')
            ]
        },
        {
            'template_section_code': 'jcw-auto-garage-modern-01-testimonials-01',
            'display_order': 4,
            'fields': [
                ('title', 'O Que Dizem os Nossos Clientes'),
                ('testimonial_1_text', 'Serviço excelente! O Paulo é muito profissional e honesto. Recomendo a todos.'),
                ('testimonial_1_author', 'Maria Silva'),
                ('testimonial_1_service', 'Revisão geral - Peugeot 308'),
                ('testimonial_2_text', 'Oficina de confiança. Preços justos e trabalho de qualidade. Já sou cliente há 5 anos.'),
                ('testimonial_2_author', 'João Santos'),
                ('testimonial_2_service', 'Troca de óleo - BMW 320d'),
                ('testimonial_3_text', 'Diagnóstico rápido e preciso. Problema resolvido no mesmo dia.'),
                ('testimonial_3_author', 'Ana Costa'),
                ('testimonial_3_service', 'Diagnóstico eletrónico - Volkswagen Golf')
            ]
        }
    ]
    
    create_sections_for_page(page, sections_data)

def create_orcamento_page(project):
    """Create quote request page with form"""
    
    print("📄 Creating orçamento page...")
    
    page, created = Page.objects.update_or_create(
        project=project,
        slug='orcamento',
        defaults={
            'title': 'Pedir Orçamento - Oficina Paulo Calibra',
            'path': '/orcamento',
            'is_published': True,
            'meta_description': 'Peça orçamento gratuito para serviços de manutenção automóvel.',
            'order': 2,
            'locale': 'pt'
        }
    )
    
    sections_data = [
        {
            'template_section_code': 'jcw-auto-garage-modern-01-form-quote-01',
            'display_order': 1,
            'fields': [
                ('title', 'Pedir Orçamento Gratuito'),
                ('subtitle', 'Preencha o formulário e entraremos em contacto consigo'),
                ('form_name_label', 'Nome completo'),
                ('form_email_label', 'Email'),
                ('form_phone_label', 'Telemóvel'),
                ('form_license_plate_label', 'Matrícula do veículo'),
                ('form_vehicle_label', 'Marca e modelo'),
                ('form_service_label', 'Tipo de serviço'),
                ('form_service_options', 'Troca de óleo|Revisão geral|Travões|Diagnóstico|Outro'),
                ('form_message_label', 'Descrição do problema ou serviço necessário'),
                ('form_submit_text', 'Enviar Pedido'),
                ('privacy_text', 'Os seus dados serão tratados com confidencialidade.')
            ]
        }
    ]
    
    create_sections_for_page(page, sections_data)

def create_contacto_page(project):
    """Create contact page with address, hours, and map"""
    
    print("📄 Creating contacto page...")
    
    page, created = Page.objects.update_or_create(
        project=project,
        slug='contacto',
        defaults={
            'title': 'Contactos - Oficina Paulo Calibra',
            'path': '/contacto',
            'is_published': True,
            'meta_description': 'Como chegar à Oficina Paulo Calibra. Morada, telefone e horário.',
            'order': 3,
            'locale': 'pt'
        }
    )
    
    sections_data = [
        {
            'template_section_code': 'jcw-auto-garage-modern-01-contact-01',
            'display_order': 1,
            'fields': [
                ('title', 'Contactos e Localização'),
                ('address_title', 'Morada'),
                ('address', 'Rua das Oficinas, 123\n1000-001 Lisboa'),
                ('phone_title', 'Telefone'),
                ('phone', '+351 21 123 4567'),
                ('email_title', 'Email'),
                ('email', 'geral@oficinacalibra.pt'),
                ('hours_title', 'Horário'),
                ('hours_weekdays', 'Segunda a Sexta: 8h00 - 18h00'),
                ('hours_saturday', 'Sábado: 8h00 - 13h00'),
                ('hours_sunday', 'Domingo: Encerrado'),
                ('map_title', 'Como Chegar'),
                ('map_link', 'https://maps.google.com/?q=Rua+das+Oficinas+123+Lisboa'),
                ('directions', 'Próximo ao Metro Marquês de Pombal, com estacionamento gratuito.')
            ]
        }
    ]
    
    create_sections_for_page(page, sections_data)

def create_sections_for_page(page, sections_data):
    """Helper to create sections and fields for a page"""
    
    for section_data in sections_data:
        section, created = Section.objects.update_or_create(
            page=page,
            identifier=section_data['template_section_code'],
            defaults={
                'order': section_data['display_order'],
                'internal_name': f"Section {section_data['display_order']}"
            }
        )
        
        # Create fields for this section
        for field_name, field_value in section_data['fields']:
            Field.objects.update_or_create(
                section=section,
                key=field_name,
                defaults={
                    'value': field_value,
                    'label': field_name.replace('_', ' ').title()
                }
            )

def main():
    """Main function to create template and demo site"""
    
    print("🚀 Starting Auto Garage Template Creation...")
    
    # Create template with sections
    template = create_auto_garage_template()
    
    # Create demo site project
    project = create_oficina_paulo_calibra()
    
    print(f"\n🎉 Auto Garage Template Setup Complete!")
    print(f"   Template: {template.name} ({template.key})")
    print(f"   Demo Site: {project.name} ({project.slug})")
    print(f"   Template Sections: {TemplateSection.objects.filter(site_template=template).count()}")
    print(f"   Project Pages: {Page.objects.filter(project=project).count()}")
    
    print(f"\n🔗 URLs to test:")
    print(f"   Frontend demo: http://localhost:3000/sites/{project.slug}")
    print(f"   Admin template: http://localhost:3000/en/admin/templates/{template.key}")
    print(f"   Django admin: http://localhost:8000/admin/sites/sitetemplate/")

if __name__ == '__main__':
    main()