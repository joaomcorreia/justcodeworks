#!/usr/bin/env python3
"""
Check the actual field data structure in tenant sites
"""

import os
import sys
import requests
import json

# Configuration
DJANGO_BASE_URL = "http://127.0.0.1:8000/api"

def check_site_field_structure():
    """Check the field structure for both tenant sites"""
    print("🔍 Checking Field Data Structure in Tenant Sites...")
    print("=" * 60)
    
    sites = [
        ("marys-restaurant", "Mary's Restaurant"),
        ("oficina-paulo-calibra", "Oficina Paulo Calibra")
    ]
    
    for site_slug, site_name in sites:
        print(f"\n📋 {site_name} ({site_slug})")
        print("-" * 40)
        
        try:
            # Get site data
            response = requests.get(f"{DJANGO_BASE_URL}/sites/{site_slug}/public/", timeout=10)
            
            if response.status_code != 200:
                print(f"  ❌ Failed to fetch site: {response.status_code}")
                continue
                
            site_data = response.json()
            
            # Check pages and sections
            if not site_data.get('pages'):
                print("  ⚠️  No pages found")
                continue
                
            for page in site_data['pages'][:2]:  # Check first 2 pages
                print(f"\n  📄 Page: {page.get('slug', 'unknown')}")
                
                sections = page.get('sections', [])
                if not sections:
                    print(f"    ⚠️  No sections found")
                    continue
                    
                for section in sections[:3]:  # Check first 3 sections
                    print(f"\n    🔧 Section: {section.get('identifier', 'unknown')}")
                    print(f"       Internal Name: {section.get('internal_name', 'N/A')}")
                    
                    fields = section.get('fields', [])
                    if not fields:
                        print(f"       ⚠️  No fields found")
                        continue
                        
                    print(f"       📊 Fields ({len(fields)} total):")
                    for field in fields:
                        key = field.get('key', 'unknown')
                        value = field.get('value', '')
                        # Truncate long values
                        display_value = (value[:50] + '...') if len(value) > 50 else value
                        print(f"         • {key}: '{display_value}'")
                        
        except requests.RequestException as e:
            print(f"  ❌ Network error: {e}")
        except Exception as e:
            print(f"  ❌ Error: {e}")

def main():
    print("🚀 Field Data Structure Analysis")
    print("=" * 60)
    
    check_site_field_structure()
    
    print("\n" + "=" * 60)
    print("✅ Analysis Complete")
    print("\nThis shows the actual field keys and values available to components.")

if __name__ == "__main__":
    main()