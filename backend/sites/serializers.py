import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Template, SiteTemplate, TemplateSection, SiteProject, Page, Section, Field, BugReport, BugScreenshot, NavigationItem, HeroSlide, DashboardTemplate, DashboardBlock, QuoteRequest


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "complexity",
            "short_description",
            "long_description",
            "recommended_for",
            "sections_summary",
            "estimated_pages",
            "has_store",
            "has_blog",
            "has_booking",
        ]


class SiteTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteTemplate
        fields = [
            "id",
            "key",
            "name",
            "description",
            "is_active",
        ]


# [TEMPLAB] template list serializer for user template picker
class SiteTemplateListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing available templates in the user template picker.
    """
    class Meta:
        model = SiteTemplate
        fields = [
            "id",
            "key",
            "name",
            "description",
            "type",
            "category", 
            "status",
            "usage_count",
            "version",
            "is_user_selectable",  # [TEMPLAB] template list serializer extended
        ]


# [TEMPLAB] project template assign serializer
class SiteProjectTemplateAssignSerializer(serializers.Serializer):
    """
    Serializer for assigning a template to a user's SiteProject.
    """
    template_id = serializers.IntegerField(required=True)

    def validate_template_id(self, value):
        """Ensure the template exists and is available for users."""
        try:
            template = SiteTemplate.objects.get(
                id=value,
                is_active=True,
                is_user_selectable=True,  # [TEMPLAB] template assignment validation
                status="published"
            )
            return value
        except SiteTemplate.DoesNotExist:
            raise serializers.ValidationError("Invalid or unavailable template.")


class AdminSiteTemplateSerializer(serializers.ModelSerializer):
    site_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteTemplate
        fields = (
            "id",
            "key",
            "name",
            "description",
            "type",
            "category",
            "status",
            "sections_count",
            "usage_count",
            "is_active",
            "updated_at",  # from TimeStampedModel
            "site_count",
        )
    
    def get_site_count(self, obj):
        """Count of SiteProjects using this template"""
        from .models import SiteProject
        return SiteProject.objects.filter(site_template=obj).count()


class AdminSiteTemplateDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Template Lab with all fields including preview_image.
    """
    preview_image = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteTemplate
        fields = (
            "id",
            "key", 
            "name",
            "description",
            "type",
            "category",
            "status",
            "sections_count",
            "usage_count",
            "is_active",
            "updated_at",
            "preview_image",
            "version",
            "header_logo_url",
            "footer_logo_url", 
            "favicon_url",
        )
    
    def get_preview_image(self, obj):
        if obj.preview_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.preview_image.url)
        return None


# [TEMPLAB] Template Section serializer for admin API
class AdminTemplateSectionSerializer(serializers.ModelSerializer):
    """
    Admin serializer for TemplateSection with all fields for Template Lab management.
    """
    site_template_key = serializers.CharField(source="site_template.key", read_only=True)
    
    class Meta:
        model = TemplateSection
        fields = (
            "id",
            "site_template_key",
            "identifier", 
            "internal_name",
            "code",
            "group",
            "variant_index",
            "default_order",
            "is_active",
            "notes",
            "preview_image",
            # [TEMPLAB] New classification fields
            "section_type",
            "min_plan", 
            "is_interactive",
        )


# [ASSETS] serializer
class TemplateBrandingSerializer(serializers.ModelSerializer):
    """
    Serializer for template branding assets (logos, favicon).
    """
    class Meta:
        model = SiteTemplate
        fields = (
            "id",
            "header_logo_url",
            "footer_logo_url",
            "favicon_url",
        )


class TemplateSectionSerializer(serializers.Serializer):
    """
    Serializer for template sections (mock data for Template Lab v1).
    """
    id = serializers.IntegerField()
    key = serializers.CharField()
    name = serializers.CharField()
    type = serializers.CharField()
    order = serializers.IntegerField()
    is_active = serializers.BooleanField()
    screenshot_url = serializers.URLField(allow_null=True, required=False)


class SiteProjectSerializer(serializers.ModelSerializer):
    template = TemplateSerializer(read_only=True)
    template_id = serializers.UUIDField(
        write_only=True,
        required=False,
        allow_null=True,
        help_text="ID of the template to use for this project.",
    )
    site_template = SiteTemplateSerializer(read_only=True)
    template_key = serializers.CharField(source="site_template.key", read_only=True)
    template_name = serializers.CharField(source="site_template.name", read_only=True)
    owner = serializers.SerializerMethodField(read_only=True)
    
    def get_owner(self, obj):
        """Return owner information."""
        if obj.owner:
            return {
                'id': obj.owner.id,
                'username': obj.owner.username,
                'first_name': obj.owner.first_name,
                'last_name': obj.owner.last_name,
            }
        return None

    class Meta:
        model = SiteProject
        fields = [
            "id",
            "name",
            "slug",
            "owner",
            "template",
            "template_id",
            "site_template",
            "template_key",
            "template_name",
            "business_type",
            "primary_goal",
            "primary_locale",
            "additional_locales",
            "primary_color",
            "notes",
            "is_active",
            "created_at",
            "updated_at",
            # Style and theming fields
            "default_theme",
            "allow_theme_toggle",
            "accent_color",
            "header_background_mode",
            # Hero particles configuration
            "hero_particles_enabled",
            "hero_particles_density",
            "hero_particles_speed",
            "hero_particles_size",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "template"]

    def create(self, validated_data):
        from .models import Template

        template_id = validated_data.pop("template_id", None)
        template = None
        if template_id:
            template = Template.objects.filter(id=template_id).first()
        instance = SiteProject.objects.create(template=template, **validated_data)
        return instance


# [ADMIN]
class AdminSiteProjectSerializer(serializers.ModelSerializer):
    """
    Admin serializer for SiteProject with additional read-only fields for admin panel.
    """
    owner_email = serializers.EmailField(source="owner.email", read_only=True)
    site_template_name = serializers.CharField(
        source="site_template.name", read_only=True
    )
    template_name = serializers.CharField(
        source="template.name", read_only=True, default=None
    )

    class Meta:
        model = SiteProject
        fields = [
            "id",
            "name",
            "slug",
            "owner_email",
            "is_master_template",
            "template_name",
            "site_template_name",
            "primary_locale",
            "is_active",
            "created_at",
        ]


# [ADMIN-EXPLORER] Sites Explorer Serializer
class AdminSitesListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for admin sites explorer page.
    Lists all SiteProjects with essential information.
    """
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    owner_email = serializers.CharField(source="owner.email", read_only=True) 
    site_template_key = serializers.CharField(source="site_template.key", read_only=True)
    site_template_name = serializers.CharField(source="site_template.name", read_only=True)

    class Meta:
        model = SiteProject
        fields = [
            "id",
            "name", 
            "slug",
            "site_template_key",
            "site_template_name",
            "owner_username",
            "owner_email",
            "primary_locale", 
            "is_active",
            "created_at"
        ]


# Field Serializer
class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = [
            "id",
            "key",
            "label",
            "value",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# Section Serializer (flat)
class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = [
            "id",
            "page",
            "identifier",
            "internal_name",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# Hero Slide Serializer
class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = [
            "id",
            "order",
            "is_active",
            "eyebrow",
            "title",
            "subtitle",
            "body",
            "primary_button_label",
            "primary_button_url",
            "secondary_button_label",
            "secondary_button_url",
            "image_url",
            "animation_mode",
        ]


# Page Serializer (flat)
class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = [
            "id",
            "project",
            "slug",
            "path",
            "title",
            "locale",
            "order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# Nested Section Serializer with Fields
class SectionWithFieldsSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "identifier",
            "internal_name",
            "order",
            "fields",
        ]


# Page Snapshot Serializer (nested)
class PageSnapshotSerializer(serializers.ModelSerializer):
    sections = SectionWithFieldsSerializer(many=True, read_only=True)
    hero_slides = HeroSlideSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = [
            "id",
            "project",
            "slug",
            "path",
            "title",
            "order",
            "is_published",
            "locale",
            "sections",
            "hero_slides",
        ]


# Bug Screenshot Serializer
class BugScreenshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BugScreenshot
        fields = [
            "id",
            "image",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "image", "created_at"]


# Bug Report Serializer (for reading)
class BugReportSerializer(serializers.ModelSerializer):
    screenshots = BugScreenshotSerializer(many=True, read_only=True)

    class Meta:
        model = BugReport
        fields = [
            "id",
            "project",
            "page_path",
            "page_slug",
            "user_email",
            "user_name",
            "summary",
            "description",
            "status",
            "user_agent",
            "locale",
            "extra_meta",
            "screenshots",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "user_agent",
            "created_at",
            "updated_at",
        ]


# Bug Report Create Serializer (with base64 screenshot)
class BugReportCreateSerializer(serializers.ModelSerializer):
    screenshot_data_url = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Optional data URL of a PNG/JPEG screenshot.",
    )

    class Meta:
        model = BugReport
        fields = [
            "id",
            "project",
            "page_path",
            "page_slug",
            "user_email",
            "user_name",
            "summary",
            "description",
            "locale",
            "extra_meta",
            "screenshot_data_url",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        screenshot_data_url = validated_data.pop("screenshot_data_url", "").strip()
        request = self.context.get("request")
        user_agent = request.META.get("HTTP_USER_AGENT", "") if request else ""

        bug = BugReport.objects.create(
            user_agent=user_agent,
            status="new",
            **validated_data,
        )

        if screenshot_data_url:
            try:
                header, data = screenshot_data_url.split(",", 1)
                decoded = base64.b64decode(data)
                
                # Extract file extension from data URL header if possible
                ext = "png"  # default
                if "data:image/" in header:
                    mime_type = header.split("data:image/")[1].split(";")[0]
                    if mime_type in ["jpeg", "jpg"]:
                        ext = "jpg"
                    elif mime_type == "gif":
                        ext = "gif"
                    elif mime_type == "webp":
                        ext = "webp"
                
                filename = f"{uuid.uuid4()}.{ext}"
                screenshot = BugScreenshot(
                    bug=bug,
                )
                screenshot.image.save(filename, ContentFile(decoded), save=True)
            except Exception:
                # optional: log error, but don't fail the bug report creation
                pass

        return bug


class NavigationItemSerializer(serializers.ModelSerializer):
    page_slug = serializers.CharField(source="page.slug", read_only=True)
    page_path = serializers.CharField(source="page.path", read_only=True)

    class Meta:
        model = NavigationItem
        fields = [
            "id",
            "project",
            "parent",
            "location",
            "locale",
            "column",
            "label",
            "page",
            "page_slug",
            "page_path",
            "url",
            "is_external",
            "order",
        ]
        read_only_fields = ["id"]


class PageListSerializer(serializers.ModelSerializer):
    project_slug = serializers.CharField(source="project.slug", read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = Page
        fields = (
            "id",
            "title",
            "slug",
            "path",
            "locale",
            "is_published",
            "order",
            "project_slug",
            "project_name",
        )


class DashboardBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardBlock
        fields = (
            "id",
            "key",
            "title",
            "description",
            "region",
            "order",
            "is_active",
            "target_route",
        )


class DashboardTemplateSerializer(serializers.ModelSerializer):
    blocks = DashboardBlockSerializer(many=True, read_only=True)

    class Meta:
        model = DashboardTemplate
        fields = (
            "id",
            "key",
            "name",
            "description",
            "is_default_for_tenants",
            "blocks",
        )


class OnePageWebsiteOnboardingSerializer(serializers.Serializer):
    """Serializer for one-page website onboarding form"""
    
    # Business owner fields
    owner_name = serializers.CharField(max_length=255)
    owner_is_real_owner = serializers.BooleanField(default=True)
    business_address = serializers.CharField(max_length=500)
    business_email = serializers.EmailField()
    business_phone = serializers.CharField(max_length=50)
    
    # Business details
    business_name = serializers.CharField(max_length=255)
    business_type = serializers.CharField(max_length=255)
    business_services = serializers.CharField(max_length=1000)
    business_description = serializers.CharField(max_length=1000)
    business_website = serializers.URLField(required=False, allow_blank=True)
    favorite_colors = serializers.CharField(max_length=255)
    
    # Account login
    account_email = serializers.EmailField()
    account_password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    
    def validate_account_email(self, value):
        """Ensure the account email is unique"""
        from django.contrib.auth.models import User
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


# Template Builder Admin Serializers

class GenerateSkeletonSerializer(serializers.Serializer):
    """Serializer for generating template skeleton."""
    pass  # No input needed, action is idempotent


class CloneProjectSerializer(serializers.Serializer):
    """Serializer for cloning a project."""
    owner_email = serializers.EmailField(required=False, help_text="Email of the new project owner")
    name = serializers.CharField(max_length=150, required=False, help_text="Name for cloned project")
    slug = serializers.SlugField(max_length=150, required=False, help_text="Slug for cloned project")
    locales = serializers.ListField(
        child=serializers.CharField(max_length=5),
        required=False,
        help_text="List of locale codes to clone (e.g., ['en', 'pt'])"
    )
    
    def validate_owner_email(self, value):
        """Validate that owner email exists."""
        if value:
            from django.contrib.auth.models import User
            if not User.objects.filter(email=value).exists():
                raise serializers.ValidationError("No user found with this email address.")
        return value
    
    def validate_slug(self, value):
        """Validate that slug is unique."""
        if value and SiteProject.objects.filter(slug=value).exists():
            raise serializers.ValidationError("A project with this slug already exists.")
        return value


class CloneProjectResponseSerializer(serializers.Serializer):
    """Response serializer for clone project action."""
    success = serializers.BooleanField()
    message = serializers.CharField()
    new_project_id = serializers.UUIDField(required=False)
    new_project_name = serializers.CharField(required=False)
    pages_cloned = serializers.IntegerField(required=False)
    sections_cloned = serializers.IntegerField(required=False)
    fields_cloned = serializers.IntegerField(required=False)


# [TEMPLAB] Template Lab admin serializers
class SiteTemplateSummarySerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for Template Lab - SiteTemplate (user-facing templates).
    """
    class Meta:
        model = SiteTemplate
        fields = [
            "id",
            "name", 
            "key",
            "description",
            "category",
            "status",
            "is_active",
            "is_default_for_tenants",
            "usage_count",
            "sections_count",
        ]


# [TEMPLAB] Template Lab admin serializers  
class TemplateSummarySerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for Template Lab - Template (internal JCW templates).
    """
    class Meta:
        model = Template
        fields = [
            "id",
            "name",
            "slug", 
            "short_description",
            "category",
            "complexity",
            "estimated_pages",
            "has_store",
            "has_blog", 
            "has_booking",
        ]


# [RMOD] Public API serializers for tenant sites
class FieldPublicSerializer(serializers.ModelSerializer):
    """
    Public serializer for fields - returns key, label, value.
    """
    class Meta:
        model = Field
        fields = ["key", "label", "value", "order"]


class SectionPublicSerializer(serializers.ModelSerializer):
    """
    Public serializer for sections with nested fields.
    """
    fields = FieldPublicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Section
        fields = ["id", "identifier", "internal_name", "order", "fields"]


class PagePublicSerializer(serializers.ModelSerializer):
    """
    Public serializer for pages with nested sections and fields.
    """
    sections = SectionPublicSerializer(many=True, read_only=True)
    # [SEO] Include SEO data with fallbacks
    seo = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = [
            "id",
            "slug", 
            "path", 
            "title", 
            "order", 
            "is_published", 
            "locale", 
            "sections",
            "seo"
        ]

    def get_seo(self, obj):
        """
        Return SEO data with appropriate fallbacks.
        """
        # Fallbacks: meta_title falls back to title; meta_slug falls back to slug or path
        meta_title = obj.meta_title or obj.title
        meta_description = obj.meta_description or ""
        # Prefer meta_slug, then path, then slug
        slug = obj.meta_slug or obj.path or obj.slug

        return {
            "meta_title": meta_title,
            "meta_description": meta_description,
            "slug": slug,
            "indexable": obj.indexable,
        }


class SiteProjectPublicSerializer(serializers.ModelSerializer):
    """
    Public read-only serializer for tenant sites.
    Returns project info, template key, and all pages with sections and fields.
    """
    pages = PagePublicSerializer(many=True, read_only=True)
    site_template_key = serializers.CharField(source="site_template.key", read_only=True)
    
    class Meta:
        model = SiteProject
        fields = [
            "id",
            "name", 
            "slug",
            "site_template_key",
            "pages"
        ]


# [SEO] Page SEO Update Serializer
class PageSeoUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating Page SEO fields only.
    """
    class Meta:
        model = Page
        fields = [
            "meta_title",
            "meta_description", 
            "meta_slug",
            "indexable",
        ]


# [CONTENT] Field and Section Content Update Serializers
class FieldUpdateSerializer(serializers.Serializer):
    key = serializers.CharField()
    value = serializers.CharField(allow_blank=True, allow_null=True, required=False)


class SectionContentUpdateSerializer(serializers.Serializer):
    """
    Payload to update fields of a single Section.
    """
    fields = FieldUpdateSerializer(many=True)

    def update(self, instance, validated_data):
        fields_data = validated_data.get("fields", [])
        field_map = {f.key: f for f in instance.fields.all()}

        for item in fields_data:
            key = item.get("key")
            value = item.get("value", "")
            field = field_map.get(key)
            if field:
                field.value = value
                field.save()

        return instance

    def create(self, validated_data):
        raise NotImplementedError("Use update() with an existing Section.")


# [GARAGE-FORM] Quote Request Serializer
class QuoteRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for garage quote form submissions.
    Validates customer data and vehicle information.
    """
    class Meta:
        model = QuoteRequest
        fields = [
            'name',
            'email', 
            'phone',
            'license_plate',
            'car_make_model',
            'service_type',
            'message',
            'source_page_slug',
            'locale',
            'consent_marketing'
        ]
        
    def validate(self, data):
        """
        Ensure at least one contact method (email or phone) is provided.
        """
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        
        if not email and not phone:
            raise serializers.ValidationError(
                "Deve fornecer pelo menos um contacto: email ou telefone."
            )
            
        return data
        
    def validate_name(self, value):
        """
        Validate customer name is not empty.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("O nome é obrigatório.")
        return value.strip()
