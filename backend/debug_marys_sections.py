import requests
import json

r = requests.get('http://localhost:8000/api/sites/marys-restaurant/public/')
data = r.json()

print("All sections in Mary's Restaurant:")
for page in data['pages']:
    print(f"\nPage: {page['slug']} ({page['title']})")
    for section in page['sections']:
        print(f"  - {section['identifier']} (order: {section['order']}) - {section['internal_name']}")

print("\nSections containing 'footer':")
for page in data['pages']:
    for section in page['sections']:
        if 'footer' in section['identifier']:
            print(f"Page: {page['slug']}, Section: {section['identifier']}, Order: {section['order']}")