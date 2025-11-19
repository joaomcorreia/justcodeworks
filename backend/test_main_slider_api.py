#!/usr/bin/env python3
"""
Test the new MainSlider API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_main_slider_api():
    """Test the main slider API endpoints"""
    
    print("🎬 Testing MainSlider API Endpoints")
    print("=" * 50)
    
    # Test 1: List sliders
    print("\n1. Testing GET /main-site/sliders/")
    try:
        response = requests.get(f"{BASE_URL}/main-site/sliders/")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Found {len(data)} sliders")
            for slider in data:
                print(f"   - {slider['name']} (ID: {slider['id']}, Slides: {slider['slides_count']})")
        else:
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: List slides
    print("\n2. Testing GET /main-site/slides/")
    try:
        response = requests.get(f"{BASE_URL}/main-site/slides/")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Found {len(data)} slides")
            for slide in data:
                print(f"   - {slide['title']} (Slider: {slide['slider_name']})")
        else:
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Create a test slider (this will require authentication)
    print("\n3. Testing POST /main-site/sliders/ (Create)")
    test_slider_data = {
        'name': 'API Test Slider',
        'slug': 'api-test-slider',
        'is_active': True,
        'particles_enabled': True,
        'gradient_from': '#1e40af',
        'gradient_to': '#3b82f6'
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/main-site/sliders/", 
            json=test_slider_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"   ✅ Created slider: {data['name']} (ID: {data['id']})")
        elif response.status_code == 403:
            print(f"   ⚠️  Authentication required (expected for create operations)")
        else:
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n🔗 API Endpoints:")
    print(f"   List Sliders: {BASE_URL}/main-site/sliders/")
    print(f"   List Slides:  {BASE_URL}/main-site/slides/")
    print(f"   Admin Panel:  http://localhost:8000/admin/main_site/mainslider/")
    print(f"   Frontend:     http://localhost:3000/en/admin/sliders/homepage")

if __name__ == "__main__":
    test_main_slider_api()