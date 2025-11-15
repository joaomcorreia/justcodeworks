import requests
import json

try:
    r = requests.get('http://127.0.0.1:8000/api/sites/marys-restaurant/public/')
    
    if r.status_code == 200:
        data = r.json()
        pages = data.get('pages', [])
        
        print("=== DETAILED SECTION ANALYSIS ===")
        for page in pages:
            sections = page.get('sections', [])
            print(f"\nPAGE: {page.get('title')} ({page.get('slug')})")
            
            for section in sections:
                identifier = section.get('identifier', 'unknown')
                order = section.get('order', 0)
                fields = section.get('fields', [])
                
                print(f"  SECTION: {identifier} (order: {order})")
                print(f"    Fields count: {len(fields)}")
                
                # Check if section has basic content
                has_content = len(fields) > 0
                print(f"    Has content: {has_content}")
                
                if fields:
                    field_keys = [f.get('key', 'unknown') for f in fields]
                    print(f"    Field keys: {field_keys[:3]}{'...' if len(field_keys) > 3 else ''}")
                
                print()
                
    else:
        print(f'API Error: {r.status_code} - {r.text}')
        
except Exception as e:
    print(f'Error: {e}')