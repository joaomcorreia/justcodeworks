from django.conf import settings
from django.db import models


class UserDashboardSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dashboard_settings",
    )
    show_getting_started = models.BooleanField(default=True)
    preferred_language = models.CharField(max_length=10, blank=True)
    dark_mode = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Dashboard Settings"
        verbose_name_plural = "Dashboard Settings"

    def __str__(self):
        return f"Dashboard settings for {self.user}"
