from django.db import models

class SliderTemplate(models.Model):
    """HQ-controlled slider templates that tenants can choose from"""
    
    SLIDER_TYPE_CHOICES = [
        ('particle', 'Particle Effects'),
        ('simple', 'Simple Hero'),
        ('hero', 'Hero Section'),
        ('carousel', 'Image Carousel'),
        ('video', 'Video Background'),
    ]
    
    name = models.CharField(max_length=150, help_text="Template name (e.g. 'Modern Particle Hero')")
    slug = models.SlugField(max_length=150, unique=True, help_text="URL-friendly identifier")
    description = models.TextField(blank=True, help_text="Description of this slider template")
    slider_type = models.CharField(
        max_length=20,
        choices=SLIDER_TYPE_CHOICES,
        default='hero',
        help_text="Type of slider template"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this template is available for selection"
    )
    is_premium = models.BooleanField(
        default=False,
        help_text="Whether this is a premium template requiring paid plan"
    )
    preview_image = models.URLField(
        blank=True,
        null=True,
        help_text="URL to preview image of this template"
    )
    config_json = models.JSONField(
        blank=True,
        null=True,
        help_text="Configuration settings (particle settings, colors, etc.)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "Slider Template"
        verbose_name_plural = "Slider Templates"
    
    def __str__(self):
        premium_badge = " (Premium)" if self.is_premium else ""
        return f"{self.name}{premium_badge}"


class SliderTemplateSlide(models.Model):
    """Individual slides within a slider template"""
    
    template = models.ForeignKey(
        SliderTemplate,
        on_delete=models.CASCADE,
        related_name="slides",
        help_text="Which slider template this slide belongs to"
    )
    title = models.CharField(max_length=200, blank=True, help_text="Main slide title")
    subtitle = models.CharField(max_length=300, blank=True, help_text="Slide subtitle")
    content = models.TextField(blank=True, help_text="Main slide content/description")
    
    # Call-to-action buttons
    primary_cta_text = models.CharField(max_length=50, blank=True, help_text="Primary button text")
    primary_cta_url = models.URLField(blank=True, help_text="Primary button URL")
    secondary_cta_text = models.CharField(max_length=50, blank=True, help_text="Secondary button text")
    secondary_cta_url = models.URLField(blank=True, help_text="Secondary button URL")
    
    # Media
    slide_image = models.URLField(blank=True, help_text="Background image URL")
    slide_video = models.URLField(blank=True, help_text="Background video URL")
    
    # Ordering and visibility
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    is_active = models.BooleanField(default=True, help_text="Whether this slide is active")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['template', 'order']
        verbose_name = "Slider Template Slide"
        verbose_name_plural = "Slider Template Slides"
    
    def __str__(self):
        return f"{self.template.name} - Slide {self.order + 1}: {self.title or 'Untitled'}"


class MainSiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="JustCodeWorks")
    hero_title = models.CharField(max_length=200, default="Everything you need to get your business online") 
    hero_subtitle = models.TextField(default="Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.")
    is_live = models.BooleanField(default=True)
    
    def __str__(self):
        return self.site_name

class MainPage(models.Model):
    slug = models.SlugField(max_length=120)
    path = models.CharField(max_length=255)
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    locale = models.CharField(max_length=5, default='en')
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return self.title

class MainNavigationItem(models.Model):
    title = models.CharField(max_length=100)
    path = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    opens_in_new_tab = models.BooleanField(default=False)
    locale = models.CharField(max_length=5, default='en')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return self.title

class MainSection(models.Model):
    page = models.ForeignKey(MainPage, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=50, default='hero')
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.page.title} - {self.section_type}"

class MainField(models.Model):
    section = models.ForeignKey(MainSection, on_delete=models.CASCADE, related_name='fields')
    field_type = models.CharField(max_length=50, default='text')
    field_key = models.CharField(max_length=100)
    field_value = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.section.page.title} - {self.field_key}"
