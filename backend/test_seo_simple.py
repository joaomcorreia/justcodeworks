import requests
import json

def test_seo_api():
    print("Testing SEO API endpoint...")
    
    # Get CSRF token
    csrf_response = requests.get("http://localhost:8000/api/csrf/")
    if csrf_response.status_code != 200:
        print(f"Failed to get CSRF token: {csrf_response.status_code}")
        return
    
    csrf_token = csrf_response.cookies.get('csrftoken')
    print(f"Got CSRF token: {csrf_token}")
    
    # Test payload
    payload = {
        "meta_title": "Test SEO Title",
        "meta_description": "Test SEO Description", 
        "meta_slug": "test-seo-slug",
        "indexable": True
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
    }
    
    # Test with page ID 1
    api_url = "http://localhost:8000/api/pages/1/seo/"
    print(f"Making PATCH request to: {api_url}")
    
    response = requests.patch(
        api_url,
        headers=headers,
        cookies=csrf_response.cookies,
        json=payload
    )
    
    print(f"Response status: {response.status_code}")
    print(f"Response text: {response.text}")

if __name__ == "__main__":
    test_seo_api()