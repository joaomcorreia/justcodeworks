#!/usr/bin/env python
"""
Create slider models and admin interface for the HQ homepage slider system.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jcw_backend.settings')
django.setup()

from django.db import models
from sites.models import SiteProject, TimeStampedModel

# First, let's add the slider models to the sites app models.py
slider_models_code = '''

# [SLIDERS] Slider system for homepage and other pages
class HeroSlider(TimeStampedModel):
    """
    Hero sliders for homepage with particle effects and customizable settings
    """
    name = models.CharField(max_length=200, help_text="Slider name for admin reference")
    slug = models.SlugField(unique=True, help_text="Unique identifier for the slider")
    site_project = models.ForeignKey(SiteProject, on_delete=models.CASCADE, related_name='hero_sliders', null=True, blank=True)
    
    # Slider Settings
    is_active = models.BooleanField(default=True)
    auto_play = models.BooleanField(default=True, help_text="Auto-advance slides")
    auto_play_interval = models.PositiveIntegerField(default=5000, help_text="Interval in milliseconds")
    show_navigation = models.BooleanField(default=True, help_text="Show navigation arrows")
    show_pagination = models.BooleanField(default=True, help_text="Show pagination dots")
    
    # Particle Effect Settings
    particles_enabled = models.BooleanField(default=True, help_text="Enable particle effects")
    particles_density = models.PositiveIntegerField(default=100, help_text="Number of particles (50-300)")
    particles_speed = models.FloatField(default=1.0, help_text="Particle movement speed (0.5-3.0)")
    particles_size_min = models.PositiveIntegerField(default=1, help_text="Minimum particle size")
    particles_size_max = models.PositiveIntegerField(default=3, help_text="Maximum particle size")
    particles_color = models.CharField(max_length=7, default="#ffffff", help_text="Particle color (hex)")
    particles_opacity = models.FloatField(default=0.6, help_text="Particle opacity (0.1-1.0)")
    
    # Background Settings
    background_type = models.CharField(max_length=20, choices=[
        ('gradient', 'Gradient'),
        ('image', 'Background Image'),
        ('video', 'Background Video'),
    ], default='gradient')
    
    # Gradient Settings
    gradient_from = models.CharField(max_length=7, default="#1e40af", help_text="Gradient start color (hex)")
    gradient_to = models.CharField(max_length=7, default="#3b82f6", help_text="Gradient end color (hex)")
    gradient_direction = models.CharField(max_length=10, choices=[
        ('to-r', 'To Right'),
        ('to-l', 'To Left'),
        ('to-b', 'To Bottom'),
        ('to-t', 'To Top'),
        ('to-br', 'To Bottom Right'),
        ('to-bl', 'To Bottom Left'),
        ('to-tr', 'To Top Right'),
        ('to-tl', 'To Top Left'),
    ], default='to-br')
    
    # Image/Video Settings
    background_image = models.URLField(blank=True, null=True)
    background_video = models.URLField(blank=True, null=True)
    background_overlay_opacity = models.FloatField(default=0.3, help_text="Overlay opacity over image/video")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Hero Slider'
        verbose_name_plural = 'Hero Sliders'
    
    def __str__(self):
        return self.name


class HeroSlide(TimeStampedModel):
    """
    Individual slides within a hero slider
    """
    slider = models.ForeignKey(HeroSlider, on_delete=models.CASCADE, related_name='slides')
    title = models.CharField(max_length=300)
    subtitle = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True, help_text="Main slide content/description")
    
    # CTA Buttons
    primary_cta_text = models.CharField(max_length=100, blank=True, null=True)
    primary_cta_url = models.CharField(max_length=500, blank=True, null=True)
    secondary_cta_text = models.CharField(max_length=100, blank=True, null=True)
    secondary_cta_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Slide-specific styling
    text_color = models.CharField(max_length=7, default="#ffffff", help_text="Text color (hex)")
    text_alignment = models.CharField(max_length=10, choices=[
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ], default='center')
    
    # Slide image/media
    slide_image = models.URLField(blank=True, null=True)
    slide_video = models.URLField(blank=True, null=True)
    
    # Display settings
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Animation settings
    animation_type = models.CharField(max_length=20, choices=[
        ('fade', 'Fade'),
        ('slide', 'Slide'),
        ('zoom', 'Zoom'),
        ('none', 'No Animation'),
    ], default='fade')
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Hero Slide'
        verbose_name_plural = 'Hero Slides'
    
    def __str__(self):
        return f"{self.slider.name} - {self.title}"


class TestimonialCarousel(TimeStampedModel):
    """
    Testimonial carousel sliders
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    site_project = models.ForeignKey(SiteProject, on_delete=models.CASCADE, related_name='testimonial_carousels', null=True, blank=True)
    
    # Carousel Settings
    is_active = models.BooleanField(default=True)
    auto_play = models.BooleanField(default=True)
    auto_play_interval = models.PositiveIntegerField(default=4000)
    slides_per_view = models.PositiveIntegerField(default=3, help_text="Number of testimonials visible at once")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Testimonial Carousel'
        verbose_name_plural = 'Testimonial Carousels'
    
    def __str__(self):
        return self.name


class TestimonialSlide(TimeStampedModel):
    """
    Individual testimonials in carousel
    """
    carousel = models.ForeignKey(TestimonialCarousel, on_delete=models.CASCADE, related_name='testimonials')
    customer_name = models.CharField(max_length=200)
    customer_title = models.CharField(max_length=200, blank=True, null=True)
    customer_company = models.CharField(max_length=200, blank=True, null=True)
    customer_image = models.URLField(blank=True, null=True)
    
    testimonial_text = models.TextField()
    rating = models.PositiveIntegerField(default=5, help_text="Rating out of 5")
    
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
    
    def __str__(self):
        return f"{self.carousel.name} - {self.customer_name}"
'''

print("🎬 Creating slider models...")
print("📄 Slider models code generated")
print("\nNext steps:")
print("1. Add these models to sites/models.py")
print("2. Create and run migrations")
print("3. Add admin interface")
print("4. Create frontend slider components")
print("\nModels to add:")
print("- HeroSlider: Main slider configuration with particle effects")
print("- HeroSlide: Individual slides with content and CTAs")
print("- TestimonialCarousel: Testimonial carousel configuration")
print("- TestimonialSlide: Individual testimonials")

if __name__ == "__main__":
    print("Run this script to see the model definitions.")