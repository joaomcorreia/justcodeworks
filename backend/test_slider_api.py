#!/usr/bin/env python3
"""
Test the homepage slider API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_slider_api():
    """Test the homepage slider API endpoints"""
    
    print("🧪 Testing Homepage Slider API...")
    
    # Test 1: List all sliders (public endpoint)
    print("\n📋 1. Testing GET /homepage-sliders/")
    try:
        response = requests.get(f"{BASE_URL}/homepage-sliders/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} sliders")
            
            if data:
                slider = data[0]
                print(f"First slider: {slider['name']} (slug: {slider['slug']})")
                print(f"Particles enabled: {slider.get('particles_enabled', 'N/A')}")
                print(f"Active slides: {slider.get('slides_count', 'N/A')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 2: Get specific slider by slug
    print("\n🎯 2. Testing GET /homepage-sliders/hq-homepage-hero/")
    try:
        response = requests.get(f"{BASE_URL}/homepage-sliders/hq-homepage-hero/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            slider = response.json()
            print(f"Slider: {slider['name']}")
            print(f"Auto play: {slider['auto_play']} ({slider['auto_play_interval']}ms)")
            print(f"Gradient: {slider['gradient_from']} → {slider['gradient_to']} ({slider['gradient_direction']})")
            print(f"Particles: density={slider['particles_density']}, speed={slider['particles_speed']}")
            print(f"Slides: {len(slider['slides'])}")
            
            for i, slide in enumerate(slider['slides'], 1):
                print(f"  {i}. {slide['title']} (order: {slide['order']})")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test 3: List slides for specific slider
    print("\n📜 3. Testing GET /homepage-slides/?slider_id=1")
    try:
        response = requests.get(f"{BASE_URL}/homepage-slides/?slider_id=1")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            slides = response.json()
            print(f"Found {len(slides)} slides")
            
            for slide in slides:
                print(f"  • {slide['title']} (animation: {slide['animation_type']})")
                if slide['primary_cta_text']:
                    print(f"    CTA: {slide['primary_cta_text']} → {slide['primary_cta_url']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n✅ API tests completed!")

if __name__ == "__main__":
    test_slider_api()