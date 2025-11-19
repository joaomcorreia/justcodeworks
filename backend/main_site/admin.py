from django.contrib import admin
from .models import (
    MainSiteSettings, MainPage, MainNavigationItem, MainSection, MainField,
    SliderTemplate, SliderTemplateSlide
)


@admin.register(MainSiteSettings)
class MainSiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "is_live")
    list_editable = ("is_live",)
    search_fields = ("site_name", "hero_title")
    fieldsets = (
        ("Basic", {"fields": ("site_name", "is_live")}),
        ("Hero Content", {"fields": ("hero_title", "hero_subtitle")}),
    )


@admin.register(MainPage)
class MainPageAdmin(admin.ModelAdmin):
    list_display = ("slug", "title", "locale", "is_published", "order")
    list_filter = ("locale", "is_published")
    list_editable = ("is_published", "order")
    search_fields = ("slug", "title", "path")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("locale", "order", "slug")
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "slug", "path", "locale", "order", "is_published")
        }),
        ("SEO Settings", {
            "fields": ("meta_title", "meta_description"),
            "classes": ("collapse",)
        }),
    )


@admin.register(MainNavigationItem)
class MainNavigationItemAdmin(admin.ModelAdmin):
    list_display = ("title", "locale", "path", "order", "is_published", "opens_in_new_tab")
    list_filter = ("locale", "is_published", "opens_in_new_tab")
    list_editable = ("order", "is_published")
    search_fields = ("title", "path")
    ordering = ("locale", "order")
    
    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "path", "locale", "order", "is_published", "opens_in_new_tab")
        }),
    )


@admin.register(MainSection)
class MainSectionAdmin(admin.ModelAdmin):
    list_display = ("page", "section_type", "title", "order", "is_published")
    list_filter = ("section_type", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "content")
    ordering = ("page", "order")


@admin.register(MainField)
class MainFieldAdmin(admin.ModelAdmin):
    list_display = ("section", "field_key", "field_type", "order")
    list_filter = ("field_type",)
    list_editable = ("order",)
    search_fields = ("field_key", "field_value")
    ordering = ("section", "order")


# Slider Template Administration

class SliderTemplateSlideInline(admin.TabularInline):
    model = SliderTemplateSlide
    extra = 1
    fields = (
        'title', 'subtitle', 'primary_cta_text', 'primary_cta_url', 
        'slide_image', 'order', 'is_active'
    )
    ordering = ('order',)


@admin.register(SliderTemplate)
class SliderTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'slider_type', 'is_premium', 'is_active', 'updated_at')
    list_filter = ('slider_type', 'is_premium', 'is_active')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SliderTemplateSlideInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'slider_type')
        }),
        ('Settings', {
            'fields': ('is_active', 'is_premium', 'preview_image')
        }),
        ('Advanced Configuration', {
            'fields': ('config_json',),
            'classes': ('collapse',),
            'description': 'JSON configuration for particle settings, colors, animations, etc.'
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('slides')


@admin.register(SliderTemplateSlide)
class SliderTemplateSlideAdmin(admin.ModelAdmin):
    list_display = ('template', 'title', 'order', 'is_active', 'updated_at')
    list_filter = ('template', 'is_active')
    search_fields = ('title', 'subtitle', 'content')
    ordering = ('template', 'order')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('template', 'title', 'subtitle', 'content')
        }),
        ('Call to Action Buttons', {
            'fields': (
                ('primary_cta_text', 'primary_cta_url'),
                ('secondary_cta_text', 'secondary_cta_url')
            ),
        }),
        ('Media', {
            'fields': ('slide_image', 'slide_video'),
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active'),
        }),
    )
