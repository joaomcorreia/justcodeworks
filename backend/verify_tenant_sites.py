#!/usr/bin/env python3
"""
Quick verification that tenant sites display properly without placeholders
"""

import requests
import re

def check_tenant_site(slug, expected_content):
    """Check if a tenant site loads and contains expected content (not placeholders)"""
    try:
        response = requests.get(f"http://localhost:3002/sites/{slug}")
        content = response.text
        
        print(f"\n🌐 Checking {slug}...")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            # Check for placeholder patterns
            placeholders = re.findall(r'(This is a|Lorem ipsum|Placeholder|Sample content)', content, re.IGNORECASE)
            
            if placeholders:
                print(f"❌ Found {len(placeholders)} placeholder patterns")
                for i, placeholder in enumerate(set(placeholders), 1):
                    print(f"   {i}. '{placeholder}'")
            else:
                print("✅ No placeholder patterns detected")
            
            # Check for expected content
            found_content = []
            for expected in expected_content:
                if expected.lower() in content.lower():
                    found_content.append(expected)
            
            print(f"✅ Found expected content: {len(found_content)}/{len(expected_content)}")
            for content_item in found_content:
                print(f"   ✓ {content_item}")
            
            missing = set(expected_content) - set(found_content)
            if missing:
                print(f"❌ Missing expected content:")
                for item in missing:
                    print(f"   ✗ {item}")
        else:
            print(f"❌ Site not accessible")
            
    except Exception as e:
        print(f"❌ Error checking {slug}: {e}")

def main():
    print("🔍 Tenant Sites Verification")
    print("=" * 50)
    
    # Check Mary's Restaurant
    check_tenant_site("marys-restaurant", [
        "Mary's Restaurant",
        "Authentic Italian Cuisine",
        "Contact Us",
        "Margherita Pizza",
        "Giovanni Rossi"
    ])
    
    # Check Oficina Paulo Calibra  
    check_tenant_site("oficina-paulo-calibra", [
        "Oficina Paulo Calibra",
        "Manutenção e reparação automóvel",
        "Diagnóstico Eletrónico",
        "Maria Silva",
        "Pedir Orçamento"
    ])
    
    print(f"\n" + "=" * 50)
    print("✅ Verification complete!")

if __name__ == "__main__":
    main()