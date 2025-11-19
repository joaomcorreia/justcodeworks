from django.db import models
from django.conf import settings


class AdminNote(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="admin_notes_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Admin Note"
        verbose_name_plural = "Admin Notes"

    def __str__(self):
        return self.title
