from django.contrib import admin
from .models import DashboardTemplate, DashboardBlock


class DashboardBlockInline(admin.TabularInline):
    model = DashboardBlock
    extra = 0
    fields = (
        "key",
        "title", 
        "region",
        "order",
        "is_active",
        "target_route",
    )
    ordering = ("region", "order", "id")


@admin.register(DashboardTemplate)
class DashboardTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "is_active", "is_default_for_tenants")
    list_filter = ("is_active", "is_default_for_tenants")
    search_fields = ("name", "key")
    inlines = [DashboardBlockInline]
    fieldsets = (
        (None, {
            "fields": ("name", "key", "description", "is_active", "is_default_for_tenants")
        }),
    )


@admin.register(DashboardBlock)
class DashboardBlockAdmin(admin.ModelAdmin):
    list_display = ("title", "template", "key", "region", "order", "is_active")
    list_filter = ("template", "region", "is_active")
    search_fields = ("title", "key", "template__name")
    list_editable = ("order", "is_active")
    ordering = ("template", "region", "order")
