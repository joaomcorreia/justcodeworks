#!/usr/bin/env python3
"""
Test Script: Section Renderer System Verification

This script tests the new Section Renderer System by:
1. Checking that all section identifiers from Django match the frontend registry
2. Loading sample sites and verifying section rendering would work
3. Testing both restaurant-modern and auto-garage-modern templates

Expected behavior:
- All section identifiers from sample sites should map to components
- SectionRenderer should handle unmapped identifiers gracefully
- Component registry should be properly structured
"""

import os
import sys
import requests
import json
from pathlib import Path

# Configuration
DJANGO_BASE_URL = "http://127.0.0.1:8000/api"
FRONTEND_BASE_PATH = Path(__file__).parent.parent / "frontend"

def test_section_registry_mapping():
    """Test that Django section identifiers map to frontend registry"""
    print("🔍 Testing Section Registry Mapping...")
    
    # Test sample sites
    sample_sites = [
        ("marys-restaurant", "restaurant-modern"),
        ("oficina-paulo-calibra", "auto-garage-modern")
    ]
    
    for site_slug, template_key in sample_sites:
        print(f"\n📋 Testing {site_slug} ({template_key})...")
        
        try:
            # Get site data
            response = requests.get(f"{DJANGO_BASE_URL}/sites/{site_slug}/public/", timeout=10)
            
            if response.status_code != 200:
                print(f"  ❌ Failed to fetch site data: {response.status_code}")
                continue
                
            site_data = response.json()
            
            # Extract all section identifiers
            all_sections = []
            for page in site_data.get('pages', []):
                for section in page.get('sections', []):
                    all_sections.append(section)
            
            print(f"  📊 Found {len(all_sections)} sections")
            
            # Check each section identifier
            for section in all_sections:
                identifier = section.get('identifier', 'unknown')
                internal_name = section.get('internal_name', 'N/A')
                print(f"    • {identifier} ({internal_name})")
                
                # These should map to our new registry (including legacy mappings)
                expected_mappings = {
                    # Primary identifiers
                    'hero-basic': 'HeroBasic',
                    'about-basic': 'AboutBasic', 
                    'services-grid': 'ServicesGrid',
                    'contact-card': 'ContactCard',
                    'testimonials-basic': 'TestimonialsBasic',
                    'menu-list': 'MenuList',
                    'garage-quote-form': 'QuoteForm',
                    'auto-diagnostics': 'AutoDiagnostics',
                    
                    # Legacy restaurant identifiers
                    'hero-banner': 'HeroBasic',
                    'about-us': 'AboutBasic',
                    'restaurant-footer': 'ContactCard',
                    'appetizers': 'MenuList',
                    'main-courses': 'MenuList',
                    'contact-info': 'ContactCard',
                    
                    # Legacy garage identifiers
                    'jcw-auto-garage-modern-01-hero-01': 'HeroBasic',
                    'jcw-auto-garage-modern-01-services-01': 'ServicesGrid',
                    'jcw-auto-garage-modern-01-diagnostics-01': 'AutoDiagnostics',
                    'jcw-auto-garage-modern-01-testimonials-01': 'TestimonialsBasic',
                    'jcw-auto-garage-modern-01-form-quote-01': 'QuoteForm',
                    'jcw-auto-garage-modern-01-contact-01': 'ContactCard',
                }
                
                if identifier in expected_mappings:
                    print(f"      ✅ Maps to {expected_mappings[identifier]}")
                else:
                    print(f"      ⚠️  No mapping found - will show placeholder")
            
        except requests.RequestException as e:
            print(f"  ❌ Network error: {e}")
        except Exception as e:
            print(f"  ❌ Error: {e}")

def check_frontend_registry_file():
    """Check that the frontend registry file exists and is properly structured"""
    print("\n📁 Checking Frontend Registry File...")
    
    registry_path = FRONTEND_BASE_PATH / "src/templates/sections/registry.ts"
    
    if not registry_path.exists():
        print(f"  ❌ Registry file not found: {registry_path}")
        return False
    
    print(f"  ✅ Registry file exists: {registry_path}")
    
    try:
        with open(registry_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for expected components
        expected_components = [
            'HeroBasic', 'AboutBasic', 'ServicesGrid', 'ContactCard',
            'TestimonialsBasic', 'MenuList', 'QuoteForm', 'AutoDiagnostics'
        ]
        
        print("  🔍 Checking component imports...")
        for component in expected_components:
            if f'import {component}' in content:
                print(f"    ✅ {component} imported")
            else:
                print(f"    ❌ {component} not imported")
        
        print("  🔍 Checking registry mappings...")
        expected_mappings = [
            '"hero-basic": HeroBasic',
            '"about-basic": AboutBasic',
            '"services-grid": ServicesGrid', 
            '"contact-card": ContactCard',
            '"testimonials-basic": TestimonialsBasic',
            '"menu-list": MenuList',
            '"garage-quote-form": QuoteForm',
            '"auto-diagnostics": AutoDiagnostics'
        ]
        
        for mapping in expected_mappings:
            if mapping in content:
                print(f"    ✅ {mapping}")
            else:
                print(f"    ❌ {mapping} not found")
                
        return True
        
    except Exception as e:
        print(f"  ❌ Error reading registry file: {e}")
        return False

def check_section_components():
    """Check that all section component files exist"""
    print("\n📦 Checking Section Component Files...")
    
    components_dir = FRONTEND_BASE_PATH / "src/templates/sections"
    
    expected_files = [
        'HeroBasic.tsx', 'AboutBasic.tsx', 'ServicesGrid.tsx', 'ContactCard.tsx',
        'TestimonialsBasic.tsx', 'MenuList.tsx', 'QuoteForm.tsx', 'AutoDiagnostics.tsx'
    ]
    
    for filename in expected_files:
        file_path = components_dir / filename
        if file_path.exists():
            print(f"  ✅ {filename}")
        else:
            print(f"  ❌ {filename} missing")

def check_section_renderer():
    """Check that SectionRenderer component exists"""
    print("\n🎨 Checking SectionRenderer Component...")
    
    renderer_path = FRONTEND_BASE_PATH / "src/templates/SectionRenderer.tsx"
    
    if not renderer_path.exists():
        print(f"  ❌ SectionRenderer not found: {renderer_path}")
        return False
        
    print(f"  ✅ SectionRenderer exists: {renderer_path}")
    
    try:
        with open(renderer_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for expected imports and logic
        checks = [
            ('sectionRegistry import', 'from "./sections/registry"'),
            ('Component lookup', 'sectionRegistry[section.identifier]'),
            ('Error handling', 'Missing component for section'),
            ('Component rendering', '<Component section={section}')
        ]
        
        for check_name, check_text in checks:
            if check_text in content:
                print(f"  ✅ {check_name}")
            else:
                print(f"  ❌ {check_name} not found")
                
        return True
        
    except Exception as e:
        print(f"  ❌ Error reading SectionRenderer: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Section Renderer System Verification")
    print("=" * 50)
    
    # Check Django server
    try:
        response = requests.get(f"{DJANGO_BASE_URL}/", timeout=5)
        print("✅ Django server is running")
    except:
        print("❌ Django server not accessible - some tests may fail")
    
    # Run tests
    check_frontend_registry_file()
    check_section_components() 
    check_section_renderer()
    test_section_registry_mapping()
    
    print("\n" + "=" * 50)
    print("🎯 Section Renderer System Verification Complete")
    print("\nNext steps:")
    print("1. Update existing section identifiers in Django to match new registry")
    print("2. Test actual rendering in browser")
    print("3. Implement actual section component content")

if __name__ == "__main__":
    main()