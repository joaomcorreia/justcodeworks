import requests
import json

# Test quote request API endpoint
url = "http://localhost:8000/api/sites/oficina-paulo-calibra/quote-requests/"

test_data = {
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "+351 91 234 5678",
    "license_plate": "12-AB-34",
    "car_make_model": "BMW 320d 2018",
    "service_type": "revisao",
    "message": "Preciso de uma revisão completa do meu veículo",
    "source_page_slug": "orcamento",
    "locale": "pt",
    "consent_marketing": False
}

print("🚗 Testing Quote Request API...")
print(f"POST {url}")
print("Data:", json.dumps(test_data, indent=2, ensure_ascii=False))

try:
    response = requests.post(url, json=test_data)
    print(f"\n✅ Status Code: {response.status_code}")
    
    if response.status_code == 201:
        print("🎉 SUCCESS! Quote request created successfully.")
        print("Response:", response.json())
    else:
        print(f"❌ ERROR: {response.status_code}")
        print("Response:", response.text)
        
except Exception as e:
    print(f"💥 Network Error: {str(e)}")