#!/usr/bin/env python3
"""Quick test to verify login works"""
import requests

def test_login():
    session = requests.Session()
    
    # Get CSRF token
    csrf_response = session.get('http://localhost:8000/api/csrf/')
    csrf_token = csrf_response.json().get('csrfToken')
    session.headers.update({'X-CSRFToken': csrf_token})
    
    # Try different passwords for Joao
    passwords = ['Joao123!', 'password', 'admin', '123456']
    
    for password in passwords:
        login_data = {
            'username': 'Joao',
            'password': password,
        }
        
        login_response = session.post('http://localhost:8000/api/auth/login/', json=login_data)
        print(f"Password '{password}': {login_response.status_code}")
        
        if login_response.status_code == 200:
            print(f"✅ Success with password: {password}")
            
            # Test sites access
            sites_response = session.get('http://localhost:8000/api/sites/')
            if sites_response.status_code == 200:
                sites = sites_response.json()
                print(f"✅ Found {len(sites)} sites")
                for site in sites:
                    print(f"  - {site['name']} (slug: {site['slug']})")
            return True
    
    return False

if __name__ == "__main__":
    if not test_login():
        print("❌ Could not find working password for Joao")