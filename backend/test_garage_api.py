import requests
import json

# Test the API
response = requests.get('http://localhost:8000/api/sites/oficina-paulo-calibra/public/')
print('Status:', response.status_code)

if response.status_code == 200:
    data = response.json()
    print('Template key:', data.get('template_key'))
    print('Pages count:', len(data.get('pages', [])))
    
    if data.get('pages'):
        page = data.get('pages')[0]
        print('Sections count:', len(page.get('sections', [])))
        
        for section in page.get('sections', []):
            print(f'  Section: {section.get("identifier", "no-id")}')
            print(f'    Fields: {[f.get("key") for f in section.get("fields", [])]}')
else:
    print('API Error:', response.text)