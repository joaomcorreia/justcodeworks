#!/usr/bin/env python
"""
Restore HQ website pages from navigation structure and existing homepage setup
Creates: Home, Websites, POS Systems, Services, Help Center, Print Lab pages
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from sites.models import SiteProject, Page, Section, Field

def restore_hq_pages():
    """Restore all HQ website pages with proper content"""
    
    print("🏢 Restoring JustCodeWorks HQ Website Pages\n")
    
    # Get HQ project
    hq_project = SiteProject.objects.filter(is_headquarters=True).first()
    
    if not hq_project:
        print("❌ No HQ project found! Please create HQ project first.")
        return
    
    print(f"🎯 HQ Project: {hq_project.name}")
    
    # Define all HQ pages with content
    hq_pages_config = [
        {
            'slug': 'home',
            'path': '/',
            'title': 'JustCodeWorks - Everything you need to get your business online',
            'order': 0,
            'sections': [
                {
                    'identifier': 'jcw-main-hero01',
                    'internal_name': 'Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'label': 'Headline', 'value': 'Everything you need to get your business online'},
                        {'key': 'subheadline', 'label': 'Subheadline', 'value': 'Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.'},
                        {'key': 'primaryCta', 'label': 'Primary CTA', 'value': 'Pick a template →'},
                        {'key': 'secondaryCta', 'label': 'Secondary CTA', 'value': 'Watch demo'},
                    ]
                },
                {
                    'identifier': 'jcw-main-websites01',
                    'internal_name': 'Websites Section',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'label': 'Title', 'value': 'Websites that actually work'},
                        {'key': 'subtitle', 'label': 'Subtitle', 'value': 'From simple landing pages to full online stores'},
                    ]
                },
                {
                    'identifier': 'jcw-main-print01',
                    'internal_name': 'Print Section',
                    'order': 2,
                    'fields': [
                        {'key': 'title', 'label': 'Title', 'value': 'Professional printing'},
                        {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Business cards, flyers, and more'},
                    ]
                },
                {
                    'identifier': 'jcw-main-pos01',
                    'internal_name': 'POS Section',
                    'order': 3,
                    'fields': [
                        {'key': 'title', 'label': 'Title', 'value': 'Point of sale systems'},
                        {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Complete retail and restaurant solutions'},
                    ]
                },
                {
                    'identifier': 'jcw-main-ai01',
                    'internal_name': 'AI Section',
                    'order': 4,
                    'fields': [
                        {'key': 'title', 'label': 'Title', 'value': 'AI-powered tools'},
                        {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Smart automation for your business'},
                    ]
                },
                {
                    'identifier': 'jcw-main-cta01',
                    'internal_name': 'CTA Section',
                    'order': 5,
                    'fields': [
                        {'key': 'title', 'label': 'Title', 'value': 'Ready to get started?'},
                        {'key': 'subtitle', 'label': 'Subtitle', 'value': 'Choose the plan that fits your needs'},
                        {'key': 'cta', 'label': 'CTA Button', 'value': 'Choose plan'},
                    ]
                },
            ]
        },
        {
            'slug': 'websites',
            'path': '/websites',
            'title': 'Professional Website Development - JustCodeWorks',
            'order': 1,
            'sections': [
                {
                    'identifier': 'websites-hero',
                    'internal_name': 'Websites Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'value': 'Professional Websites That Drive Results'},
                        {'key': 'subheadline', 'value': 'From simple landing pages to complex e-commerce stores, we build websites that help your business grow.'},
                        {'key': 'cta', 'value': 'Start Your Website'},
                    ]
                },
                {
                    'identifier': 'websites-services',
                    'internal_name': 'Website Services',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'value': 'Website Development Services'},
                        {'key': 'service_1_title', 'value': 'Business Websites'},
                        {'key': 'service_1_description', 'value': 'Professional websites for service businesses, consultants, and local companies.'},
                        {'key': 'service_2_title', 'value': 'E-commerce Stores'},
                        {'key': 'service_2_description', 'value': 'Complete online stores with payment processing, inventory management, and order tracking.'},
                        {'key': 'service_3_title', 'value': 'Landing Pages'},
                        {'key': 'service_3_description', 'value': 'High-converting landing pages for marketing campaigns and lead generation.'},
                    ]
                }
            ]
        },
        {
            'slug': 'pos-systems',
            'path': '/pos-systems',
            'title': 'Point of Sale Systems - JustCodeWorks',
            'order': 2,
            'sections': [
                {
                    'identifier': 'pos-hero',
                    'internal_name': 'POS Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'value': 'Modern Point of Sale Systems'},
                        {'key': 'subheadline', 'value': 'Complete retail and restaurant POS solutions that grow with your business.'},
                        {'key': 'cta', 'value': 'Get POS System'},
                    ]
                },
                {
                    'identifier': 'pos-features',
                    'internal_name': 'POS Features',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'value': 'Complete POS Solutions'},
                        {'key': 'feature_1_title', 'value': 'Retail POS'},
                        {'key': 'feature_1_description', 'value': 'Complete retail management with inventory, customer tracking, and sales analytics.'},
                        {'key': 'feature_2_title', 'value': 'Restaurant POS'},
                        {'key': 'feature_2_description', 'value': 'Full restaurant management with table service, kitchen display, and order management.'},
                        {'key': 'feature_3_title', 'value': 'Cloud Integration'},
                        {'key': 'feature_3_description', 'value': 'Access your business data anywhere with cloud-based reporting and management.'},
                    ]
                }
            ]
        },
        {
            'slug': 'services',
            'path': '/services',
            'title': 'Business Services - JustCodeWorks',
            'order': 3,
            'sections': [
                {
                    'identifier': 'services-hero',
                    'internal_name': 'Services Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'value': 'Complete Business Solutions'},
                        {'key': 'subheadline', 'value': 'Everything your business needs to succeed online and offline.'},
                        {'key': 'cta', 'value': 'Explore Services'},
                    ]
                },
                {
                    'identifier': 'services-grid',
                    'internal_name': 'Services Grid',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'value': 'Our Services'},
                        {'key': 'service_1_title', 'value': 'Web Development'},
                        {'key': 'service_1_description', 'value': 'Custom websites and web applications built with modern technology.'},
                        {'key': 'service_2_title', 'value': 'Digital Marketing'},
                        {'key': 'service_2_description', 'value': 'SEO, social media, and online advertising to grow your business.'},
                        {'key': 'service_3_title', 'value': 'Business Consulting'},
                        {'key': 'service_3_description', 'value': 'Strategic guidance to help your business grow and succeed.'},
                        {'key': 'service_4_title', 'value': 'Technical Support'},
                        {'key': 'service_4_description', 'value': '24/7 support for all your business technology needs.'},
                    ]
                }
            ]
        },
        {
            'slug': 'help-center',
            'path': '/help-center',
            'title': 'Help Center - JustCodeWorks',
            'order': 4,
            'sections': [
                {
                    'identifier': 'help-hero',
                    'internal_name': 'Help Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'value': 'Help & Support Center'},
                        {'key': 'subheadline', 'value': 'Find answers, get support, and learn how to make the most of our services.'},
                        {'key': 'cta', 'value': 'Search Help Articles'},
                    ]
                },
                {
                    'identifier': 'help-categories',
                    'internal_name': 'Help Categories',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'value': 'How can we help you?'},
                        {'key': 'category_1_title', 'value': 'Website Builder'},
                        {'key': 'category_1_description', 'value': 'Learn how to create and customize your website.'},
                        {'key': 'category_2_title', 'value': 'POS Systems'},
                        {'key': 'category_2_description', 'value': 'Setup and manage your point of sale system.'},
                        {'key': 'category_3_title', 'value': 'Account & Billing'},
                        {'key': 'category_3_description', 'value': 'Manage your account, subscriptions, and payments.'},
                        {'key': 'category_4_title', 'value': 'Technical Support'},
                        {'key': 'category_4_description', 'value': 'Get help with technical issues and troubleshooting.'},
                    ]
                }
            ]
        },
        {
            'slug': 'print-lab',
            'path': '/print-lab',
            'title': 'Print Lab - Professional Printing Services - JustCodeWorks',
            'order': 5,
            'sections': [
                {
                    'identifier': 'print-hero',
                    'internal_name': 'Print Hero',
                    'order': 0,
                    'fields': [
                        {'key': 'headline', 'value': 'Professional Print Lab'},
                        {'key': 'subheadline', 'value': 'High-quality business cards, flyers, brochures, and marketing materials for your business.'},
                        {'key': 'cta', 'value': 'Order Prints'},
                    ]
                },
                {
                    'identifier': 'print-products',
                    'internal_name': 'Print Products',
                    'order': 1,
                    'fields': [
                        {'key': 'title', 'value': 'Print Products & Services'},
                        {'key': 'product_1_title', 'value': 'Business Cards'},
                        {'key': 'product_1_description', 'value': 'Premium business cards with professional finishes and fast delivery.'},
                        {'key': 'product_2_title', 'value': 'Marketing Materials'},
                        {'key': 'product_2_description', 'value': 'Flyers, brochures, posters, and promotional materials for your campaigns.'},
                        {'key': 'product_3_title', 'value': 'Signage & Banners'},
                        {'key': 'product_3_description', 'value': 'Custom signage, banners, and display materials for events and storefronts.'},
                        {'key': 'product_4_title', 'value': 'Custom Design'},
                        {'key': 'product_4_description', 'value': 'Professional design services for all your print marketing needs.'},
                    ]
                }
            ]
        }
    ]
    
    # Create/restore all pages
    created_pages = 0
    updated_pages = 0
    total_sections = 0
    total_fields = 0
    
    for page_config in hq_pages_config:
        # Create or get page
        page, page_created = Page.objects.get_or_create(
            project=hq_project,
            slug=page_config['slug'],
            defaults={
                'path': page_config['path'],
                'title': page_config['title'],
                'order': page_config['order'],
                'is_published': True,
            }
        )
        
        if page_created:
            created_pages += 1
            print(f"✅ Created page: {page.title}")
        else:
            updated_pages += 1
            # Update existing page
            page.path = page_config['path']
            page.title = page_config['title']
            page.order = page_config['order']
            page.is_published = True
            page.save()
            print(f"🔄 Updated page: {page.title}")
        
        # Create sections for this page
        for section_config in page_config.get('sections', []):
            section, section_created = Section.objects.get_or_create(
                page=page,
                identifier=section_config['identifier'],
                defaults={
                    'internal_name': section_config['internal_name'],
                    'order': section_config['order'],
                }
            )
            
            if section_created:
                total_sections += 1
                print(f"  ➕ Created section: {section.internal_name}")
            
            # Create fields for this section
            for field_config in section_config.get('fields', []):
                field, field_created = Field.objects.get_or_create(
                    section=section,
                    key=field_config['key'],
                    defaults={
                        'label': field_config.get('label', field_config['key'].title()),
                        'value': field_config['value'],
                    }
                )
                
                if field_created:
                    total_fields += 1
                else:
                    # Update existing field
                    field.value = field_config['value']
                    if 'label' in field_config:
                        field.label = field_config['label']
                    field.save()
    
    print(f"\n🎉 HQ Pages Restoration Complete!")
    print(f"📊 Summary:")
    print(f"   📄 Pages: {created_pages} created, {updated_pages} updated")
    print(f"   📝 Sections: {total_sections} created/updated")
    print(f"   🏷️  Fields: {total_fields} created/updated")
    
    # Show final page list
    print(f"\n📋 HQ Pages in {hq_project.name}:")
    hq_pages = Page.objects.filter(project=hq_project).order_by('order')
    for page in hq_pages:
        sections_count = Section.objects.filter(page=page).count()
        print(f"   {page.order + 1}. {page.title} ({page.path}) - {sections_count} sections")
    
    return {
        'created_pages': created_pages,
        'updated_pages': updated_pages,
        'total_sections': total_sections,
        'total_fields': total_fields,
        'total_pages': hq_pages.count()
    }

if __name__ == '__main__':
    try:
        results = restore_hq_pages()
        print(f"\n✅ Successfully restored HQ website with {results['total_pages']} pages")
    except Exception as e:
        print(f"❌ Error restoring HQ pages: {e}")
        import traceback
        traceback.print_exc()