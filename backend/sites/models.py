import uuid
from django.db import models
from django.contrib.auth.models import User


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SiteTemplate(TimeStampedModel):
    """
    Represents a high-level site template/layout, e.g. 'jcw-main', 'rest-01-modern', etc.
    """

    key = models.SlugField(
        max_length=100,
        unique=True,
        help_text="Internal key used by the frontend to choose the layout (e.g. 'jcw-main').",
    )
    name = models.CharField(
        max_length=150,
        help_text="Human-readable template name (e.g. 'JCW Main Long Page').",
    )
    description = models.TextField(blank=True)

    # 🔹 New fields
    TEMPLATE_TYPE_CHOICES = (
        ("website", "Website"),
        ("email", "Email"),
        ("landing", "Landing page"),
    )
    type = models.CharField(
        max_length=20,
        choices=TEMPLATE_TYPE_CHOICES,
        default="website",
        help_text="Kind of template (website, email, landing).",
    )

    category = models.CharField(
        max_length=100,
        blank=True,
        help_text="Category or niche, e.g. 'Restaurant', 'Services', 'Ecommerce'.",
    )

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
        help_text="Publishing status for this template.",
    )

    sections_count = models.PositiveIntegerField(
        default=0,
        help_text="How many sections/blocks this template includes.",
    )

    usage_count = models.PositiveIntegerField(
        default=0,
        help_text="How many times this template has been used by tenants.",
    )

    is_active = models.BooleanField(default=True)
    is_default_for_tenants = models.BooleanField(
        default=False,
        help_text="If true, this template is used as the default for tenant dashboards or sites.",
    )
    
    # [TEMPLAB] user-selectable flag
    is_user_selectable = models.BooleanField(
        default=True,
        help_text="If False, this template is reserved for internal use and hidden from user-facing template pickers.",
    )

    # Template Builder v1 fields
    preview_image = models.ImageField(
        upload_to="template_previews/",
        blank=True,
        null=True,
        help_text="Preview image for this template."
    )
    
    # [TEMPLAB] External preview image URL for demo/external hosting
    preview_image_url = models.URLField(
        blank=True,
        help_text="External URL for template preview image (for auto-scroll demo)."
    )
    
    version = models.CharField(
        max_length=20,
        blank=True,
        default="v1",
        help_text="Template version for tracking changes."
    )
    
    # [ASSETS] template branding fields
    header_logo_url = models.URLField(
        blank=True,
        help_text="URL for the header logo image."
    )
    
    footer_logo_url = models.URLField(
        blank=True,
        help_text="URL for the footer logo image."
    )
    
    favicon_url = models.URLField(
        blank=True,
        help_text="URL for the favicon image."
    )

    class Meta:
        ordering = ["key"]

    def __str__(self) -> str:
        return self.name


# [TEMPLAB] Template Section model for reusable section definitions
class TemplateSection(TimeStampedModel):
    """
    Represents a reusable section definition within a SiteTemplate.
    Each TemplateSection defines a component that can be used across multiple tenant sites.
    """
    
    site_template = models.ForeignKey(
        SiteTemplate,
        on_delete=models.CASCADE,
        related_name="sections",
        help_text="The site template this section belongs to"
    )
    
    identifier = models.CharField(
        max_length=100,
        help_text="Short machine-readable key like 'hero-banner', 'about-us', 'menu-list'"
    )
    
    internal_name = models.CharField(
        max_length=200,
        help_text="Human-readable label like 'Hero – Full-width image + CTA'"
    )
    
    code = models.SlugField(
        max_length=150,
        help_text="Complete section code following naming scheme: e.g. 'jcw-restaurant-modern-01-hero-01'"
    )
    
    group = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Section group like 'hero', 'about', 'menu', 'contact'"
    )
    
    variant_index = models.PositiveIntegerField(
        default=1,
        help_text="Which variation this is within the group (1, 2, 3, etc.)"
    )
    
    default_order = models.PositiveIntegerField(
        default=0,
        help_text="Default position/order suggestion on a page"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this section is available for use"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Internal notes, usage hints, etc."
    )
    
    preview_image = models.URLField(
        blank=True,
        help_text="Optional image path for preview thumbnails"
    )
    
    # [TEMPLAB] Enhanced classification fields for intelligent section management
    SECTION_TYPE_CHOICES = [
        ("hero", "Hero"),
        ("about", "About"),
        ("menu", "Menu"),
        ("pricing", "Pricing"),
        ("testimonials", "Testimonials"),
        ("gallery", "Gallery"),
        ("faq", "FAQ"),
        ("cta", "Call to Action"),
        ("form-contact", "Contact Form"),
        ("form-booking", "Booking Form"), 
        ("form-lead", "Lead Generation Form"),
        ("form-quote", "Quote Request Form"),
        ("features", "Features"),
        ("services", "Services"),
        ("team", "Team"),
        ("portfolio", "Portfolio"),
        ("blog", "Blog"),
        ("footer", "Footer"),
        ("other", "Other"),
    ]
    
    MIN_PLAN_CHOICES = [
        ("free", "Free"),
        ("paid", "Paid"),
        ("premium", "Premium"),
    ]
    
    section_type = models.CharField(
        max_length=50,
        choices=SECTION_TYPE_CHOICES,
        default="other",
        help_text="Type of section content (hero, about, menu, form, etc.)"
    )
    
    min_plan = models.CharField(
        max_length=20,
        choices=MIN_PLAN_CHOICES,
        default="free",
        help_text="Minimum subscription plan required to use this section"
    )
    
    is_interactive = models.BooleanField(
        default=False,
        help_text="Whether this section requires user interaction (forms, galleries, sliders, etc.)"
    )
    
    # [TEMPLAB] Reference to original section this template was cloned from
    source_section = models.ForeignKey(
        "Section",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="template_variants",
        help_text="Original section this template section was cloned from"
    )
    
    class Meta:
        ordering = ["site_template", "group", "default_order", "id"]
        unique_together = [["site_template", "code"]]
    
    def __str__(self) -> str:
        return f"{self.site_template.key} – {self.internal_name} ({self.code})"


# [TEMPLAB] Fields for template sections (cloned from regular Fields)
class TemplateSectionField(TimeStampedModel):
    """
    Fields belonging to TemplateSection - stores the field definitions
    that get cloned when creating a TemplateSection from a Section.
    """
    template_section = models.ForeignKey(
        TemplateSection,
        on_delete=models.CASCADE,
        related_name="fields"
    )
    
    key = models.CharField(
        max_length=80,
        help_text="Field key used in the frontend config, e.g. 'title', 'subtitle'."
    )
    
    label = models.CharField(
        max_length=120,
        blank=True,
        help_text="Human label shown in the editor UI."
    )
    
    value = models.TextField(
        blank=True,
        help_text="Default/example value for this field"
    )
    
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ["order", "id"]
        unique_together = [["template_section", "key"]]
    
    def __str__(self) -> str:
        return f"{self.template_section.code} · {self.key}"


class Template(TimeStampedModel):
    CATEGORY_CHOICES = [
        ("one-page", "One page"),
        ("multi-page", "Multi page"),
        ("store", "Online store"),
        ("booking", "Booking"),
        ("portfolio", "Portfolio"),
        ("custom", "Custom"),
    ]

    COMPLEXITY_CHOICES = [
        ("starter", "Starter"),
        ("standard", "Standard"),
        ("advanced", "Advanced"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=80)
    name = models.CharField(max_length=120)
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default="one-page"
    )
    complexity = models.CharField(
        max_length=20, choices=COMPLEXITY_CHOICES, default="starter"
    )
    short_description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    recommended_for = models.TextField(blank=True)

    sections_summary = models.JSONField(
        default=list,
        blank=True,
        help_text="List of section descriptions as shown in Templates Lab.",
    )

    estimated_pages = models.PositiveIntegerField(default=1)
    has_store = models.BooleanField(default=False)
    has_blog = models.BooleanField(default=False)
    has_booking = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class HeaderBackgroundMode(models.TextChoices):
    NONE = "none", "None"
    PARTICLES = "particles", "Particles"


class SiteProject(TimeStampedModel):
    PRIMARY_GOAL_CHOICES = [
        ("get-leads", "Get leads / requests"),
        ("show-info", "Show info / menu"),
        ("sell-online", "Sell online"),
        ("take-bookings", "Take bookings"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="site_projects",
        help_text="The user who owns this project.",
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.PROTECT,
        related_name="projects",
        null=True,
        blank=True,
    )
    site_template = models.ForeignKey(
        "SiteTemplate",
        on_delete=models.PROTECT,
        related_name="projects",
        null=True,
        blank=True,
        help_text="Which site template/layout this project uses.",
    )

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)

    business_type = models.CharField(max_length=150, blank=True)
    primary_goal = models.CharField(
        max_length=32, choices=PRIMARY_GOAL_CHOICES, blank=True
    )

    primary_locale = models.CharField(
        max_length=20,
        default="en",
        help_text="Primary locale code, e.g. en, pt-pt, nl.",
    )
    additional_locales = models.JSONField(
        default=list,
        blank=True,
        help_text="Additional locale codes for this project.",
    )
    enable_arabic_language = models.BooleanField(
        default=False,
        help_text="Enable Arabic language for this website. When enabled, Arabic will be available in the language selector.",
    )

    # Style and theming fields
    default_theme = models.CharField(max_length=16, default="dark")
    allow_theme_toggle = models.BooleanField(default=True)
    
    # Theme v1 fields - standardized color system
    primary_color = models.CharField(max_length=7, default="#1D4ED8", help_text="Primary brand/action color in hex, e.g. #1D4ED8")
    secondary_color = models.CharField(max_length=7, default="#6366F1", help_text="Secondary accent color in hex")
    accent_color = models.CharField(max_length=7, default="#F97316", help_text="Accent / CTA color in hex")
    background_color = models.CharField(max_length=7, default="#0B1120", help_text="Default background color in hex")
    text_color = models.CharField(max_length=7, default="#F9FAFB", help_text="Default body text color in hex")
    is_dark_theme = models.BooleanField(default=True, help_text="If true, template can assume dark background by default")
    
    # Hero particles configuration
    hero_particles_enabled = models.BooleanField(default=True)
    hero_particles_density = models.PositiveIntegerField(default=60)
    hero_particles_speed = models.FloatField(default=0.5)
    hero_particles_size = models.FloatField(default=2.0)

    # Header background mode
    header_background_mode = models.CharField(
        max_length=50,
        choices=HeaderBackgroundMode.choices,
        default=HeaderBackgroundMode.PARTICLES,
        help_text="Header background effect for this project (particles, meteors, shooting stars, etc.)",
    )

    notes = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)
    
    # Template Builder v1 fields
    is_master_template = models.BooleanField(
        default=False,
        help_text="If true, this project serves as a master template for cloning."
    )
    
    # Step 0 Multi-Intent Onboarding fields
    ENTRY_INTENT_CHOICES = [
        ("website", "Website"),
        ("prints", "Prints"),
        ("pos", "Point of Sale"),
    ]
    
    entry_intent = models.CharField(
        max_length=20,
        choices=ENTRY_INTENT_CHOICES,
        blank=True,
        help_text="The primary intent when user entered onboarding (website, prints, pos)."
    )
    
    business_name = models.CharField(
        max_length=200,
        blank=True,
        help_text="Official business name for branding and legal purposes."
    )
    
    primary_country = models.CharField(
        max_length=100,
        blank=True,
        help_text="Primary country of business operation."
    )
    
    primary_language = models.CharField(
        max_length=20,
        blank=True,
        help_text="Primary language for content (ISO language code)."
    )
    
    brand_primary_color = models.CharField(
        max_length=7,
        blank=True,
        help_text="User-preferred brand primary color in hex format."
    )
    
    brand_secondary_color = models.CharField(
        max_length=7,
        blank=True,
        help_text="User-preferred brand secondary color in hex format."
    )
    
    PREFERRED_THEME_MODE_CHOICES = [
        ("light", "Light"),
        ("dark", "Dark"),
        ("auto", "Auto (system preference)"),
    ]
    
    preferred_theme_mode = models.CharField(
        max_length=10,
        choices=PREFERRED_THEME_MODE_CHOICES,
        blank=True,
        help_text="User preference for light/dark theme mode."
    )
    
    onboarding_notes = models.TextField(
        blank=True,
        help_text="Internal notes from onboarding process."
    )
    
    # Builder Step 0 entry product field
    ENTRY_PRODUCT_CHOICES = [
        ("website", "Website"),
        ("printing", "Printing"),
        ("pos", "POS"),
    ]
    
    entry_product = models.CharField(
        max_length=20,
        choices=ENTRY_PRODUCT_CHOICES,
        default="website",
        help_text="The product/service selected during Step 0 onboarding."
    )
    
    # Hero slider template selection
    hero_slider_template = models.ForeignKey(
        'main_site.SliderTemplate',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="site_projects",
        help_text="Which HQ slider template this site uses as hero slider.",
    )
    
    # HQ vs Tenant separation flag
    is_headquarters = models.BooleanField(
        default=False,
        help_text="Marks this project as the main Just Code Works website (HQ)."
    )

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
    
    def get_site_type_display(self):
        """Return a clear indicator of whether this is HQ or tenant."""
        if self.is_headquarters:
            return "🏢 HQ Site"
        return "👤 Tenant Site"
    
    get_site_type_display.short_description = "Site Type"


class LocaleChoices(models.TextChoices):
    EN = "en", "English"
    PT = "pt", "Português"
    # Later we can add: DE = "de", "Deutsch", FR = "fr", "Français", ES = "es", "Español"


class HeroAnimationMode(models.TextChoices):
    NONE = "none", "None"
    FADE_UP = "fade-up", "Fade up"
    SLIDE_LEFT = "slide-left", "Slide left"
    TYPEWRITER = "typewriter", "Typewriter"


class Page(TimeStampedModel):
    project = models.ForeignKey(
        SiteProject, on_delete=models.CASCADE, related_name="pages"
    )
    slug = models.SlugField(
        max_length=120,
        help_text="Slug used in the path, e.g. 'home', 'services', 'websites'.",
    )
    path = models.CharField(
        max_length=255,
        help_text="Full path used in the frontend, e.g. '/services', '/websites/one-page'.",
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    # 🔹 New field
    locale = models.CharField(
        max_length=5,
        choices=LocaleChoices.choices,
        default=LocaleChoices.EN,
        help_text="Content locale for this page, e.g. 'en', 'pt'.",
    )

    # [SEO] SEO fields for each page + locale
    meta_title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional SEO title. Defaults to page title if empty.",
    )
    meta_description = models.TextField(
        blank=True,
        help_text="Optional SEO description shown in search results.",
    )
    meta_slug = models.SlugField(
        max_length=255,
        blank=True,
        help_text="Optional URL slug override for this locale. Defaults to slug/path.",
    )
    indexable = models.BooleanField(
        default=True,
        help_text="If false, this page should be marked as noindex for search engines.",
    )

    class Meta:
        unique_together = [("project", "slug", "locale")]
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.project.name} [{self.locale}]: {self.slug}"


class HeroSlide(TimeStampedModel):
    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        related_name="hero_slides",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    eyebrow = models.CharField(
        max_length=120,
        blank=True,
        help_text="Small text above the main title.",
    )
    title = models.CharField(
        max_length=200,
        help_text="Main hero title for this slide.",
    )
    subtitle = models.CharField(
        max_length=300,
        blank=True,
        help_text="Short subtitle or supporting line.",
    )
    body = models.TextField(
        blank=True,
        help_text="Optional longer text under the subtitle.",
    )

    primary_button_label = models.CharField(
        max_length=120,
        blank=True,
    )
    primary_button_url = models.CharField(
        max_length=255,
        blank=True,
    )
    secondary_button_label = models.CharField(
        max_length=120,
        blank=True,
    )
    secondary_button_url = models.CharField(
        max_length=255,
        blank=True,
    )

    image_url = models.URLField(
        blank=True,
        help_text="Hero image URL for this slide (right side / background).",
    )

    animation_mode = models.CharField(
        max_length=32,
        choices=HeroAnimationMode.choices,
        default=HeroAnimationMode.FADE_UP,
        help_text="How this slide's text should animate.",
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.page.slug} [{self.page.project.name}] — Slide {self.order} ({self.title[:40]})"


class Section(TimeStampedModel):
    page = models.ForeignKey(
        Page, on_delete=models.CASCADE, related_name="sections"
    )
    identifier = models.CharField(
        max_length=80,
        help_text="Technical section id, e.g. 'jcw-main-hero01'.",
    )
    internal_name = models.CharField(
        max_length=120,
        blank=True,
        help_text="Friendly name for the section, shown in editors.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        unique_together = [("page", "identifier")]

    def __str__(self) -> str:
        return f"{self.page.slug} · {self.identifier}"


class Field(TimeStampedModel):
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="fields"
    )
    key = models.CharField(
        max_length=80,
        help_text="Field key used in the frontend config, e.g. 'title', 'subtitle'.",
    )
    label = models.CharField(
        max_length=120,
        blank=True,
        help_text="Human label shown in the editor UI.",
    )
    value = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        unique_together = [("section", "key")]

    def __str__(self) -> str:
        return f"{self.section.identifier} · {self.key}"


def section_draft_upload_to(instance, filename):
    """Upload function for SectionDraft screenshots."""
    # Generate unique filename with UUID
    file_extension = filename.split('.')[-1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    return f"screenshot_uploads/{unique_filename}"


class SectionDraft(TimeStampedModel):
    """
    Stores uploaded screenshots that will be processed to generate website sections.
    Step 1: Upload screenshot and store
    Step 2: AI processing to generate section HTML/JSON
    Step 3: Convert to actual Page sections
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    image = models.FileField(
        upload_to=section_draft_upload_to,
        help_text="Screenshot image (PNG/JPG/SVG) to generate section from."
    )
    
    project = models.ForeignKey(
        'SiteProject',
        on_delete=models.CASCADE,
        related_name='section_drafts',
        help_text="Project this section draft belongs to."
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('error', 'Error'),
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Processing status of the section draft."
    )
    
    section_name = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional name for the section being generated."
    )
    
    ai_output_json = models.JSONField(
        null=True,
        blank=True,
        help_text="AI-generated section data (HTML, fields, etc.)."
    )
    
    locale = models.CharField(
        max_length=10,
        blank=True,
        help_text="Locale for generated content (en, pt, etc.)."
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self) -> str:
        name_part = f" - {self.section_name}" if self.section_name else ""
        return f"Section Draft ({self.status}){name_part}"


def bug_screenshot_upload_to(instance, filename):
    return f"bug_screenshots/{instance.bug_id}/{filename}"


class BugReport(TimeStampedModel):
    STATUS_CHOICES = [
        ("new", "New"),
        ("triaged", "Triaged"),
        ("in_progress", "In progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        SiteProject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="bug_reports",
        help_text="Optional: project this bug relates to.",
    )
    page_path = models.CharField(
        max_length=255,
        blank=True,
        help_text="Path where the bug happened, e.g. '/websites/one-page'.",
    )
    page_slug = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional slug of the page, e.g. 'websites-one-page'.",
    )
    user_email = models.EmailField(blank=True)
    user_name = models.CharField(max_length=150, blank=True)

    summary = models.CharField(
        max_length=255,
        help_text="Short summary of what went wrong.",
    )
    description = models.TextField(
        blank=True,
        help_text="User description or steps to reproduce.",
    )

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="new"
    )

    user_agent = models.CharField(max_length=255, blank=True)
    locale = models.CharField(max_length=32, blank=True)
    extra_meta = models.JSONField(
        default=dict,
        blank=True,
        help_text="Any extra JSON metadata (e.g. viewport size, browser info).",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.status}] {self.summary[:80]}"


class BugScreenshot(TimeStampedModel):
    bug = models.ForeignKey(
        BugReport,
        on_delete=models.CASCADE,
        related_name="screenshots",
    )
    image = models.ImageField(upload_to=bug_screenshot_upload_to)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Screenshot for bug {self.bug_id}"


class NavigationItem(TimeStampedModel):
    LOCATION_CHOICES = [
        ("header", "Header"),
        ("footer", "Footer"),
    ]

    project = models.ForeignKey(
        SiteProject,
        on_delete=models.CASCADE,
        related_name="navigation_items",
    )
    locale = models.CharField(
        max_length=5,
        choices=LocaleChoices.choices,
        default=LocaleChoices.EN,
        help_text="Language/locale for this navigation item",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
        help_text="Optional parent item for dropdowns or nested links.",
    )
    location = models.CharField(
        max_length=16,
        choices=LOCATION_CHOICES,
        help_text="Where this item appears (header vs footer).",
    )
    column = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text="For footer items: which column (1–5).",
    )

    label = models.CharField(max_length=100)
    page = models.ForeignKey(
        Page,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="nav_items",
        help_text="Optional link to a Page. If set, this overrides url.",
    )
    url = models.CharField(
        max_length=255,
        blank=True,
        help_text="Explicit URL path or external link. Used if no Page is linked.",
    )
    is_external = models.BooleanField(
        default=False,
        help_text="If true, treat URL as external.",
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["location", "locale", "column", "order", "id"]
        # Note: unique_together constraint will be added after migration

    def __str__(self):
        return f"{self.location} ({self.locale}) – {self.label}"


# [GARAGE-FORM] Quote Request Model for Garage/Auto Service Leads
class QuoteRequest(TimeStampedModel):
    """
    Stores quote requests submitted through garage quote forms.
    """
    site_project = models.ForeignKey(
        SiteProject, 
        on_delete=models.CASCADE, 
        related_name="quote_requests"
    )
    
    # Contact Information
    name = models.CharField(max_length=200, help_text="Customer name")
    email = models.EmailField(blank=True, help_text="Customer email")
    phone = models.CharField(max_length=50, blank=True, help_text="Customer phone number")
    
    # Vehicle Information
    license_plate = models.CharField(max_length=20, blank=True, help_text="Vehicle license plate")
    car_make_model = models.CharField(max_length=200, blank=True, help_text="Vehicle make and model")
    
    # Service Request Details
    SERVICE_TYPE_CHOICES = (
        ("troca_oleo", "Troca de óleo"),
        ("revisao", "Revisão geral"), 
        ("travoes", "Travões"),
        ("diagnostico", "Diagnóstico"),
        ("outro", "Outro"),
    )
    service_type = models.CharField(
        max_length=100, 
        choices=SERVICE_TYPE_CHOICES,
        blank=True,
        help_text="Type of automotive service requested"
    )
    message = models.TextField(blank=True, help_text="Additional message or problem description")
    
    # Metadata
    source_page_slug = models.CharField(
        max_length=100, 
        blank=True, 
        help_text="Page slug where form was submitted (e.g. 'orcamento')"
    )
    locale = models.CharField(max_length=10, default="pt", help_text="Form submission locale")
    consent_marketing = models.BooleanField(
        default=False, 
        help_text="Customer consent for marketing communications"
    )
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"
    
    def __str__(self) -> str:
        return f"{self.site_project.name} — {self.name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


# [MAIN WEBSITE SLIDERS] Slider system for main JCW website
class MainWebsiteSlider(TimeStampedModel):
    """
    Homepage sliders for the main JustCodeWorks website (not tenant websites)
    """
    name = models.CharField(max_length=200, help_text="Slider name for admin reference")
    slug = models.SlugField(unique=True, help_text="Unique identifier for the slider")
    
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
    particles_color = models.CharField(max_length=7, default="#ffffff", help_text="Primary particle color (hex)")
    particles_colors = models.TextField(blank=True, help_text="JSON array of additional particle colors")
    particles_opacity = models.FloatField(default=0.6, help_text="Particle opacity (0.1-1.0)")
    particles_multi_color = models.BooleanField(default=False, help_text="Use multiple particle colors")
    
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
        verbose_name = 'Main Website Slider'
        verbose_name_plural = 'Main Website Sliders'
    
    def __str__(self):
        return f"🏢 {self.name}"


class MainWebsiteSlide(TimeStampedModel):
    """
    Individual slides within a main website slider
    """
    slider = models.ForeignKey(MainWebsiteSlider, on_delete=models.CASCADE, related_name='slides')
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
        verbose_name = 'Main Website Slide'
        verbose_name_plural = 'Main Website Slides'
    
    def __str__(self):
        return f"🏢 {self.slider.name} - {self.title}"


# [TENANT SLIDERS] Slider system for tenant websites
class HomepageSlider(TimeStampedModel):
    """
    Homepage sliders for TENANT websites (not main JCW website)
    """
    name = models.CharField(max_length=200, help_text="Slider name for admin reference")
    slug = models.SlugField(unique=True, help_text="Unique identifier for the slider")
    site_project = models.ForeignKey(SiteProject, on_delete=models.CASCADE, related_name='homepage_sliders', null=True, blank=True)
    
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
    particles_color = models.CharField(max_length=7, default="#ffffff", help_text="Primary particle color (hex)")
    particles_colors = models.TextField(blank=True, help_text="JSON array of additional particle colors")
    particles_opacity = models.FloatField(default=0.6, help_text="Particle opacity (0.1-1.0)")
    particles_multi_color = models.BooleanField(default=False, help_text="Use multiple particle colors")
    
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
        verbose_name = 'Homepage Slider'
        verbose_name_plural = 'Homepage Sliders'
    
    def __str__(self):
        return f"👤 {self.name} ({self.site_project.name if self.site_project else 'No Project'})"


class HomepageSlide(TimeStampedModel):
    """
    Individual slides within a TENANT homepage slider
    """
    slider = models.ForeignKey(HomepageSlider, on_delete=models.CASCADE, related_name='slides')
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
        verbose_name = 'Homepage Slide'
        verbose_name_plural = 'Homepage Slides'
    
    def __str__(self):
        return f"👤 {self.slider.name} - {self.title}"


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

