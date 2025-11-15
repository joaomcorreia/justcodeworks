import requests
import json

def test_tenant_sites():
    """Quick test to verify tenant sites are loading properly"""
    
    print("=== TENANT SITES VERIFICATION TEST ===\n")
    
    base_url = "http://localhost:3003"
    
    # Test sites
    test_sites = [
        "/sites/marys-restaurant",
        "/sites/oficina-paulo-calibra", 
        "/en"
    ]
    
    for site_path in test_sites:
        url = base_url + site_path
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"✅ {url} - Status: {response.status_code} - Content Length: {len(response.text)} chars")
                # Check if it contains template components
                if "TEMPLAB" in response.text:
                    print(f"   🎯 Template Lab components detected")
                if "RestaurantHero" in response.text or "AutoGarage" in response.text:
                    print(f"   🧩 Template components loaded")
            else:
                print(f"❌ {url} - Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {url} - Connection Error: {str(e)}")
    
    print(f"\n=== TEST COMPLETE ===")

if __name__ == "__main__":
    test_tenant_sites()