from django.contrib import admin
from .models import UserDashboardSettings


@admin.register(UserDashboardSettings)
class UserDashboardSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "preferred_language", "dark_mode", "show_getting_started")
    search_fields = ("user__username", "user__email")
