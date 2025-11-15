import requests
import json

try:
    r = requests.get('http://127.0.0.1:8000/api/sites/marys-restaurant/public/')
    print(f'STATUS: {r.status_code}')
    
    if r.status_code == 200:
        data = r.json()
        pages = data.get('pages', [])
        print(f'TOTAL PAGES: {len(pages)}')
        
        for i, page in enumerate(pages):
            sections = page.get('sections', [])
            print(f'PAGE {i+1}: {page.get("title", "Unknown")} ({page.get("slug", "unknown")})')
            print(f'  Sections ({len(sections)}): {[s.get("identifier", "unknown") for s in sections]}')
        
        # Show all sections combined
        all_sections = []
        for page in pages:
            for section in page.get('sections', []):
                all_sections.append(f'{section.get("identifier", "unknown")} (from {page.get("slug", "unknown")} page)')
        
        print(f'\nALL SECTIONS COMBINED ({len(all_sections)}):')
        for section in all_sections:
            print(f'  - {section}')
    else:
        print(f'Error: {r.text}')
        
except Exception as e:
    print(f'Error: {e}')