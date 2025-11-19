from django.contrib import admin
from .models import AdminNote


@admin.register(AdminNote)
class AdminNoteAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "created_at")
    search_fields = ("title", "body", "created_by__username", "created_by__email")
    ordering = ("-created_at",)
