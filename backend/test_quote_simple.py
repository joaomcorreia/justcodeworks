# Simple test of quote request API without external dependencies
import urllib.request
import json

url = "http://localhost:8000/api/sites/oficina-paulo-calibra/quote-requests/"

test_data = {
    "name": "Maria Santos",
    "email": "maria.santos@email.com", 
    "phone": "+351 92 567 8901",
    "license_plate": "56-CD-78",
    "car_make_model": "Volkswagen Golf 2020",
    "service_type": "troca_oleo",
    "message": "Troca de óleo e filtros",
    "source_page_slug": "orcamento",
    "locale": "pt",
    "consent_marketing": False
}

try:
    # Prepare request
    data = json.dumps(test_data).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    print("🚗 Testing Quote Request API with urllib...")
    print(f"POST {url}")
    
    # Make request
    response = urllib.request.urlopen(req)
    response_data = response.read().decode('utf-8')
    
    print(f"✅ Status: {response.status}")
    print(f"🎉 SUCCESS! Response: {response_data}")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")