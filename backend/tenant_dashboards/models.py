from django.db import models
from sites.models import TimeStampedModel


class DashboardTemplate(TimeStampedModel):
    """
    High-level template for tenant dashboards.
    One template can be used by many tenants.
    """

    key = models.SlugField(
        max_length=100,
        unique=True,
        help_text="Internal key used to identify this dashboard template (e.g. 'default-tenant-dashboard').",
    )
    name = models.CharField(
        max_length=150,
        help_text="Human-readable name (e.g. 'Default tenant dashboard').",
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_default_for_tenants = models.BooleanField(
        default=False,
        help_text="If true, this template is used as the default for tenant dashboards.",
    )

    class Meta:
        ordering = ["key"]

    def __str__(self) -> str:
        return self.name


class DashboardBlock(TimeStampedModel):
    """
    A block/widget on a dashboard template.
    For example: 'Live preview card', 'Next steps', 'Upgrade banner', etc.
    """

    template = models.ForeignKey(
        DashboardTemplate,
        on_delete=models.CASCADE,
        related_name="blocks",
    )

    key = models.SlugField(
        max_length=100,
        help_text="Internal key for this block (e.g. 'live-preview', 'next-steps', 'stats').",
    )
    title = models.CharField(
        max_length=150,
        help_text="Title shown in the dashboard UI.",
    )
    description = models.TextField(
        blank=True,
        help_text="Optional description or helper text.",
    )

    # Where this block should render (e.g. 'main', 'sidebar')
    region = models.CharField(
        max_length=50,
        default="main",
        help_text="Logical region in the dashboard layout (e.g. 'main', 'sidebar').",
    )

    order = models.PositiveIntegerField(
        default=0,
        help_text="Blocks with lower order appear first within their region.",
    )

    is_active = models.BooleanField(default=True)

    # Optional target route this block links to when clicked
    target_route = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional route to navigate to when interacting with this block (e.g. '/dashboard/website').",
    )

    class Meta:
        ordering = ["region", "order", "id"]

    def __str__(self) -> str:
        return f"{self.template.key} — {self.key}"
