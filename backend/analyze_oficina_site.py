#!/usr/bin/env python3
"""
Detailed analysis of Oficina Paulo Calibra site structure and section mapping
"""

import os
import sys
import requests
import json

DJANGO_BASE_URL = "http://127.0.0.1:8000/api"

def analyze_oficina_sections():
    """Analyze each section of Oficina Paulo Calibra site"""
    print("🔧 Analyzing Oficina Paulo Calibra Site Structure")
    print("=" * 60)
    
    try:
        response = requests.get(f"{DJANGO_BASE_URL}/sites/oficina-paulo-calibra/public/", timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Failed to fetch site: {response.status_code}")
            return
            
        site_data = response.json()
        
        print(f"Site: {site_data.get('name', 'N/A')}")
        print(f"Template Key: {site_data.get('site_template_key', 'N/A')}")
        print()
        
        if not site_data.get('pages'):
            print("⚠️ No pages found")
            return
            
        for page_idx, page in enumerate(site_data['pages']):
            print(f"📄 Page {page_idx + 1}: {page.get('slug', 'unknown')} - '{page.get('title', 'N/A')}'")
            
            sections = page.get('sections', [])
            if not sections:
                print(f"  ⚠️ No sections found")
                continue
                
            for sect_idx, section in enumerate(sections):
                identifier = section.get('identifier', 'unknown')
                internal_name = section.get('internal_name', 'N/A')
                
                print(f"\n  🔧 Section {sect_idx + 1}: {identifier}")
                print(f"     Internal Name: {internal_name}")
                print(f"     Order: {section.get('order', 'N/A')}")
                
                # Check if this identifier exists in the registry
                known_identifiers = [
                    "hero-basic", "about-basic", "services-grid", "contact-card", 
                    "testimonials-basic", "menu-list", "garage-quote-form", "auto-diagnostics",
                    "hero-banner", "about-us", "restaurant-footer", "appetizers", "main-courses", "contact-info",
                    "jcw-auto-garage-modern-01-hero-01", "jcw-auto-garage-modern-01-services-01",
                    "jcw-auto-garage-modern-01-diagnostics-01", "jcw-auto-garage-modern-01-testimonials-01",
                    "jcw-auto-garage-modern-01-form-quote-01", "jcw-auto-garage-modern-01-contact-01",
                    "jcw-auto-garage-modern-01-why-choose-01"
                ]
                
                if identifier in known_identifiers:
                    print(f"     ✅ Mapped to component")
                else:
                    print(f"     ❌ NOT MAPPED - will show error message")
                
                fields = section.get('fields', [])
                print(f"     📊 Fields: {len(fields)}")
                
                if fields:
                    print("     Field Keys:")
                    for field in fields:
                        key = field.get('key', 'unknown')
                        value = field.get('value', '')
                        truncated_value = (value[:30] + '...') if len(value) > 30 else value
                        print(f"       • {key}: '{truncated_value}'")
                        
        print(f"\n" + "=" * 60)
        
        # Show component registry mapping
        print("🗂️ Current Component Registry Mappings:")
        print("-" * 40)
        
        # Show which garage identifiers we support
        garage_mappings = [
            ("jcw-auto-garage-modern-01-hero-01", "HeroBasic"),
            ("jcw-auto-garage-modern-01-services-01", "ServicesGrid"),
            ("jcw-auto-garage-modern-01-diagnostics-01", "AutoDiagnostics"),
            ("jcw-auto-garage-modern-01-testimonials-01", "TestimonialsBasic"),
            ("jcw-auto-garage-modern-01-form-quote-01", "QuoteForm"),
            ("jcw-auto-garage-modern-01-contact-01", "ContactCard"),
            ("jcw-auto-garage-modern-01-why-choose-01", "WhyChooseUs")
        ]
        
        for identifier, component in garage_mappings:
            print(f"  {identifier} → {component}")
                        
    except requests.RequestException as e:
        print(f"❌ Network error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    analyze_oficina_sections()

if __name__ == "__main__":
    main()