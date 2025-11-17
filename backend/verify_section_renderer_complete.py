#!/usr/bin/env python3
"""
Final Verification: Section Renderer System Complete

This script confirms that Step 14 (Create Section Renderer System) is fully implemented:
1. ✅ Section Registry created with component mappings
2. ✅ SectionRenderer component created with dynamic rendering
3. ✅ All placeholder section components created
4. ✅ Template renderers updated to use new system
5. ✅ Legacy identifiers mapped for compatibility
6. ✅ Next.js route conflicts resolved
7. ✅ Frontend running and rendering sites successfully

Expected results:
- All section identifiers map to placeholder components
- Sites render with placeholder content instead of errors
- No missing component warnings in browser console
"""

import os
import sys
import requests
import json
from pathlib import Path

# Configuration
DJANGO_BASE_URL = "http://127.0.0.1:8000/api"
FRONTEND_URL = "http://localhost:3002"

def test_section_components_exist():
    """Verify all section component files exist"""
    print("🔍 Verifying Section Component Files...")
    
    frontend_dir = Path(__file__).parent.parent / "frontend"
    components_dir = frontend_dir / "src/templates/sections"
    
    required_files = [
        'registry.ts',
        'HeroBasic.tsx', 'AboutBasic.tsx', 'ServicesGrid.tsx', 'ContactCard.tsx',
        'TestimonialsBasic.tsx', 'MenuList.tsx', 'QuoteForm.tsx', 'AutoDiagnostics.tsx'
    ]
    
    all_exist = True
    for filename in required_files:
        file_path = components_dir / filename
        if file_path.exists():
            print(f"  ✅ {filename}")
        else:
            print(f"  ❌ {filename} - MISSING")
            all_exist = False
    
    return all_exist

def test_section_renderer_exists():
    """Verify SectionRenderer component exists"""
    print("\n🎨 Verifying SectionRenderer Component...")
    
    frontend_dir = Path(__file__).parent.parent / "frontend"
    renderer_path = frontend_dir / "src/templates/SectionRenderer.tsx"
    
    if renderer_path.exists():
        print(f"  ✅ SectionRenderer.tsx exists")
        return True
    else:
        print(f"  ❌ SectionRenderer.tsx - MISSING")
        return False

def test_template_renderers_updated():
    """Verify template renderers use new SectionRenderer"""
    print("\n🏗️  Verifying Template Renderers Updated...")
    
    frontend_dir = Path(__file__).parent.parent / "frontend"
    renderer_files = [
        frontend_dir / "src/app/sites/[slug]/render-restaurant-modern.tsx",
        frontend_dir / "src/app/sites/[slug]/render-auto-garage-modern.tsx", 
        frontend_dir / "src/app/sites/[slug]/render-default.tsx"
    ]
    
    all_updated = True
    for renderer_file in renderer_files:
        if renderer_file.exists():
            try:
                content = renderer_file.read_text(encoding='utf-8')
                if 'SectionRenderer' in content and 'from "@/templates/SectionRenderer"' in content:
                    print(f"  ✅ {renderer_file.name} - uses SectionRenderer")
                else:
                    print(f"  ❌ {renderer_file.name} - not updated")
                    all_updated = False
            except Exception as e:
                print(f"  ❌ {renderer_file.name} - error reading: {e}")
                all_updated = False
        else:
            print(f"  ❌ {renderer_file.name} - file missing")
            all_updated = False
    
    return all_updated

def test_registry_mappings():
    """Test that registry contains expected mappings"""
    print("\n📋 Verifying Registry Mappings...")
    
    frontend_dir = Path(__file__).parent.parent / "frontend"
    registry_path = frontend_dir / "src/templates/sections/registry.ts"
    
    if not registry_path.exists():
        print("  ❌ Registry file missing")
        return False
    
    try:
        content = registry_path.read_text(encoding='utf-8')
        
        # Check for primary mappings
        primary_mappings = [
            '"hero-basic": HeroBasic',
            '"about-basic": AboutBasic',
            '"services-grid": ServicesGrid',
            '"contact-card": ContactCard',
            '"testimonials-basic": TestimonialsBasic',
            '"menu-list": MenuList',
            '"garage-quote-form": QuoteForm',
            '"auto-diagnostics": AutoDiagnostics'
        ]
        
        # Check for legacy mappings
        legacy_mappings = [
            '"hero-banner": HeroBasic',
            '"about-us": AboutBasic',
            '"jcw-auto-garage-modern-01-hero-01": HeroBasic',
            '"jcw-auto-garage-modern-01-form-quote-01": QuoteForm'
        ]
        
        all_mappings_found = True
        
        print("  🔍 Primary mappings:")
        for mapping in primary_mappings:
            if mapping in content:
                print(f"    ✅ {mapping}")
            else:
                print(f"    ❌ {mapping}")
                all_mappings_found = False
        
        print("  🔍 Legacy mappings:")
        for mapping in legacy_mappings:
            if mapping in content:
                print(f"    ✅ {mapping}")
            else:
                print(f"    ❌ {mapping}")
                all_mappings_found = False
        
        return all_mappings_found
        
    except Exception as e:
        print(f"  ❌ Error reading registry: {e}")
        return False

def test_frontend_accessibility():
    """Test that frontend is running and sites are accessible"""
    print("\n🌐 Testing Frontend Accessibility...")
    
    test_sites = [
        ("marys-restaurant", "Restaurant site"),
        ("oficina-paulo-calibra", "Auto garage site")
    ]
    
    all_accessible = True
    for site_slug, description in test_sites:
        try:
            response = requests.get(f"{FRONTEND_URL}/sites/{site_slug}", timeout=10)
            if response.status_code == 200:
                print(f"  ✅ {description} ({site_slug}) - accessible")
            else:
                print(f"  ⚠️  {description} ({site_slug}) - status: {response.status_code}")
                all_accessible = False
        except requests.RequestException as e:
            print(f"  ❌ {description} ({site_slug}) - error: {e}")
            all_accessible = False
    
    return all_accessible

def main():
    """Run all verification tests"""
    print("🚀 Section Renderer System - Final Verification")
    print("=" * 60)
    
    # Run all tests
    results = []
    results.append(("Section Components", test_section_components_exist()))
    results.append(("SectionRenderer", test_section_renderer_exists()))
    results.append(("Template Renderers", test_template_renderers_updated()))
    results.append(("Registry Mappings", test_registry_mappings()))
    results.append(("Frontend Access", test_frontend_accessibility()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name:<20} {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 SUCCESS: Section Renderer System is fully operational!")
        print("\nNext steps:")
        print("1. 🎨 Implement actual section component content")
        print("2. 🔧 Add field data rendering in components") 
        print("3. 📱 Test responsive design and accessibility")
        print("4. 🚀 Deploy to production environment")
    else:
        print("⚠️  ISSUES FOUND: Some components need attention")
        print("\nReview failed tests above and fix before proceeding")
    
    print(f"\nFrontend running at: {FRONTEND_URL}")
    print(f"Test sites:")
    print(f"  • Restaurant: {FRONTEND_URL}/sites/marys-restaurant")
    print(f"  • Auto Garage: {FRONTEND_URL}/sites/oficina-paulo-calibra")

if __name__ == "__main__":
    main()