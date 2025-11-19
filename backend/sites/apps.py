from django.apps import AppConfig


class TenantSitesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sites'
    verbose_name = 'Tenant Sites'
