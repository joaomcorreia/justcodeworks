import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from sites.models import SiteProject

def update_theme_colors():
    """Update some existing projects with proper theme colors."""
    
    # Mary's Restaurant - warm restaurant colors
    try:
        marys = SiteProject.objects.get(slug='marys-restaurant')
        marys.primary_color = '#DC2626'    # Red
        marys.secondary_color = '#F59E0B'  # Amber  
        marys.accent_color = '#059669'     # Emerald
        marys.background_color = '#1F2937' # Dark gray
        marys.text_color = '#F9FAFB'       # Off white
        marys.is_dark_theme = True
        marys.save()
        print(f"✓ Updated Mary's Restaurant theme colors")
    except SiteProject.DoesNotExist:
        print("Mary's Restaurant not found")
    
    # Joe's Garage - automotive blue/orange theme
    try:
        joes = SiteProject.objects.get(slug='joes-garage')
        joes.primary_color = '#2563EB'     # Blue
        joes.secondary_color = '#3B82F6'   # Light blue
        joes.accent_color = '#EA580C'      # Orange
        joes.background_color = '#0F172A'  # Very dark blue
        joes.text_color = '#F8FAFC'        # White
        joes.is_dark_theme = True
        joes.save()
        print(f"✓ Updated Joe's Garage theme colors")
    except SiteProject.DoesNotExist:
        print("Joe's Garage not found")
        
    # Oficina Paulo Calibra - professional automotive theme
    try:
        oficina = SiteProject.objects.get(slug='oficina-paulo-calibra')
        oficina.primary_color = '#1D4ED8'  # Professional blue
        oficina.secondary_color = '#6366F1' # Purple
        oficina.accent_color = '#F97316'    # Orange
        oficina.background_color = '#111827' # Dark
        oficina.text_color = '#F9FAFB'      # Light
        oficina.is_dark_theme = True
        oficina.save()
        print(f"✓ Updated Oficina Paulo Calibra theme colors")
    except SiteProject.DoesNotExist:
        print("Oficina Paulo Calibra not found")

if __name__ == "__main__":
    update_theme_colors()
    print("\n✅ Theme colors updated successfully!")