#!/usr/bin/env python3
"""
Quick test to see what data is in the website preview API
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model

# Get mary_restaurant user
User = get_user_model()
try:
    mary_user = User.objects.get(username='mary_restaurant')
    print(f"Found user: {mary_user.username}")
    
    # Create test client and login
    client = Client()
    client.force_login(mary_user)
    
    # Make API request
    response = client.get('/api/user/website-preview/')
    
    print(f"Response status: {response.status_code}")
    print(f"Response data: {response.json()}")
    
except User.DoesNotExist:
    print("mary_restaurant user not found")
except Exception as e:
    print(f"Error: {e}")