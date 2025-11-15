#!/usr/bin/env python3
"""Test snapshot API with locale fallback."""

import requests

API_BASE = "http://127.0.0.1:8000/api"
PROJECT_ID = "69870a64-4913-4d52-9b35-4d1dfa33632a"

print("🧪 Testing Snapshot API with Locale Fallback")
print("=" * 50)

# Test: Request PT home page (should fallback to EN)
print("\n1. Testing PT home page (should fallback to EN)")
resp = requests.get(f'{API_BASE}/pages/?project={PROJECT_ID}&slug=home&locale=pt')
print(f"   📡 Pages API status: {resp.status_code}")

if resp.status_code == 200:
    pages = resp.json()
    if pages:
        page_id = pages[0]['id']
        page_locale = pages[0]['locale']
        page_title = pages[0]['title']
        
        print(f"   🌍 Found page locale: {page_locale}")
        print(f"   📄 Found page title: {page_title}")
        print(f"   🆔 Page ID: {page_id}")
        
        # Get snapshot
        snap_resp = requests.get(f'{API_BASE}/pages/{page_id}/snapshot/')
        print(f"   📡 Snapshot API status: {snap_resp.status_code}")
        
        if snap_resp.status_code == 200:
            snap_data = snap_resp.json()
            print(f"   🌍 Snapshot locale: {snap_data.get('locale')}")
            print(f"   📄 Snapshot title: {snap_data.get('title')}")
            print(f"   📑 Sections count: {len(snap_data.get('sections', []))}")
            print(f"   🎬 Hero slides count: {len(snap_data.get('hero_slides', []))}")
            
            if page_locale == 'en' and snap_data.get('locale') == 'en':
                print("   ✅ PASS: Locale fallback worked correctly (PT → EN)")
            else:
                print("   ❌ FAIL: Locale fallback did not work as expected")
        else:
            print(f"   ❌ Snapshot API failed: {snap_resp.text}")
    else:
        print("   ❌ No pages found")
else:
    print(f"   ❌ Pages API failed: {resp.text}")

print("\n" + "=" * 50)
print("🎯 Test completed!")