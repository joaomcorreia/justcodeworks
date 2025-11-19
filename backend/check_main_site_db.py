#!/usr/bin/env python3
"""
Check what main_site tables exist in the database
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.db import connection

def check_main_site_tables():
    """Check what main_site tables exist"""
    
    cursor = connection.cursor()
    
    # Check for main_site tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'main_site_%'")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"📋 Main Site Tables Found: {len(tables)}")
    for table in tables:
        print(f"  - {table}")
    
    # Check specific table schema
    if 'main_site_mainslider' in tables:
        print(f"\n🔍 MainSlider table schema:")
        cursor.execute("PRAGMA table_info(main_site_mainslider)")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
    else:
        print(f"\n❌ main_site_mainslider table not found!")
    
    # Also check if MainSlider model exists
    try:
        from main_site.models import MainSlider
        print(f"\n✅ MainSlider model imported successfully")
        print(f"📊 MainSlider count: {MainSlider.objects.count()}")
    except Exception as e:
        print(f"\n❌ Error with MainSlider model: {e}")

if __name__ == '__main__':
    check_main_site_tables()