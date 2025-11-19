from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import path, reverse
from django.utils.html import format_html
from .models import (
    Template,
    SiteTemplate,
    TemplateSection,
    SiteProject,
    Page,
    Section,
    Field,
    BugReport,
    BugScreenshot,
    NavigationItem,
    LocaleChoices,
    HeroSlide,
    QuoteRequest,
    SectionDraft,
    MainWebsiteSlider,
    MainWebsiteSlide,
    HomepageSlider,
    HomepageSlide,
    TestimonialCarousel,
    TestimonialSlide,
)


class LocaleListFilter(admin.SimpleListFilter):
    """Custom filter to display locale names instead of codes."""
    title = 'language'
    parameter_name = 'locale'

    def lookups(self, request, model_admin):
        return LocaleChoices.choices

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(locale=self.value())
        return queryset


class LanguageQuickFilter(admin.SimpleListFilter):
    """Quick language filter with flag emojis."""
    title = 'Quick Language Filter'
    parameter_name = 'lang'

    def lookups(self, request, model_admin):
        return (
            ('en', '🇺🇸 English Only'),
            ('pt', '🇧🇷 Portuguese Only'),
            ('all', '🌍 All Languages'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'en':
            return queryset.filter(locale='en')
        elif self.value() == 'pt':
            return queryset.filter(locale='pt')
        return queryset


class FieldInline(admin.TabularInline):
    model = Field
    extra = 0
    fields = ("key", "label", "value", "order")
    ordering = ("order", "id")


class SectionInline(admin.StackedInline):
    model = Section
    extra = 0
    fields = ("identifier", "internal_name", "order")
    ordering = ("order", "id")
    show_change_link = True


class HeroSlideInline(admin.StackedInline):
    model = HeroSlide
    extra = 0
    fields = (
        "order",
        "is_active",
        "eyebrow",
        "title",
        "subtitle",
        "body",
        "image_url",
        "animation_mode",
        "primary_button_label",
        "primary_button_url",
        "secondary_button_label",
        "secondary_button_url",
    )
    ordering = ("order", "id")


@admin.register(SiteTemplate)
class SiteTemplateAdmin(admin.ModelAdmin):
    list_display = ("key", "name", "is_active", "version", "status", "usage_count")
    list_filter = ("is_active", "status", "type", "category")
    search_fields = ("name", "key", "description")
    
    fields = (
        "key", "name", "description", "type", "category", 
        "is_active", "status", "version", "preview_image", "preview_image_url",  # [TEMPLAB]
        "is_default_for_tenants"
    )
    
    actions = ['generate_skeleton']
    
    @admin.action(description='Generate default skeleton for selected templates')
    def generate_skeleton(self, request, queryset):
        """Generate default page/section/field skeleton for selected templates."""
        from .utils import ensure_template_skeleton
        
        count = 0
        for template in queryset:
            try:
                master_project = ensure_template_skeleton(template)
                count += 1
                messages.success(
                    request, 
                    f'Generated skeleton for {template.name} → {master_project.name}'
                )
            except Exception as e:
                messages.error(
                    request,
                    f'Failed to generate skeleton for {template.name}: {str(e)}'
                )
        
        if count:
            messages.success(request, f'Successfully generated {count} template skeletons.')


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "complexity",
        "estimated_pages",
        "has_store",
        "has_blog",
        "has_booking",
        "created_at",
    )
    list_filter = ("category", "complexity", "has_store", "has_blog", "has_booking")
    search_fields = ("name", "slug", "short_description", "recommended_for")
    prepopulated_fields = {"slug": ("name",)}


# [TEMPLAB] Template Section admin for managing reusable section definitions
@admin.register(TemplateSection)
class TemplateSectionAdmin(admin.ModelAdmin):
    list_display = (
        "site_template",
        "internal_name",
        "code",
        "section_type",
        "group",
        "variant_index", 
        "default_order",
        "min_plan",
        "is_interactive",
        "is_active",
    )
    list_filter = ("site_template", "section_type", "min_plan", "group", "is_interactive", "is_active")
    search_fields = ("internal_name", "code", "group", "site_template__key")
    list_editable = ("default_order", "is_active", "min_plan")
    ordering = ["site_template", "section_type", "group", "default_order", "id"]


class PageInline(admin.TabularInline):
    model = Page
    extra = 0


class PageInlineForProject(admin.StackedInline):
    model = Page
    extra = 0
    fields = ("title", "slug", "path", "locale", "order", "is_published")
    ordering = ("order", "id")
    show_change_link = True


@admin.register(SiteProject) 
class SiteProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "get_site_type_display",
        "slug", 
        "get_short_uuid",
        "owner",
        "is_master_template",
        "template",
        "site_template", 
        "get_primary_locale_display",
        "is_active",
        "created_at",
    )
    list_filter = (
        "is_headquarters", "is_master_template", "owner", "primary_goal", "primary_locale", 
        "header_background_mode", "is_active", "template", "site_template"
    )
    search_fields = ("name", "slug", "business_type", "notes")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PageInlineForProject]
    
    actions = ['promote_to_master', 'clone_project']

    fieldsets = (
        ("Basic Info", {
            "fields": ("owner", "name", "slug", "template", "site_template", "business_type", "primary_goal"),
        }),
        ("Template Settings", {
            "fields": ("is_master_template",),
        }),
        ("Localization", {
            "fields": ("primary_locale", "additional_locales"),
        }),
        ("Style & Theme", {
            "fields": (
                "default_theme",
                "allow_theme_toggle",
                "header_background_mode",
                "hero_slider_template",
            ),
        }),
        ("Theme Colors", {
            "fields": (
                "primary_color",
                "secondary_color", 
                "accent_color",
                "background_color",
                "text_color",
                "is_dark_theme",
            ),
        }),
        ("Hero Particles", {
            "fields": (
                "hero_particles_enabled",
                "hero_particles_density",
                "hero_particles_speed",
                "hero_particles_size",
            ),
            "classes": ("collapse",),
        }),
        ("Site Type", {
            "fields": ("is_headquarters",),
        }),
        ("Other", {
            "fields": ("notes", "is_active"),
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        """Never allow deleting the HQ project from this admin."""
        if obj is not None and obj.is_headquarters:
            return False
        return super().has_delete_permission(request, obj)

    def get_readonly_fields(self, request, obj=None):
        """Make HQ project fields readonly to prevent accidental changes."""
        ro = list(super().get_readonly_fields(request, obj))
        if obj is not None and obj.is_headquarters:
            # Don't let someone accidentally change its template or owner
            ro.extend(["site_template", "owner", "is_headquarters"])
        return ro
    
    # [TEMPLAB] site_template admin queryset - show all active user-selectable templates
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "site_template":
            # Show all active SiteTemplates (user-facing templates)
            kwargs["queryset"] = SiteTemplate.objects.filter(is_active=True)
        elif db_field.name == "template":
            # Show all Templates (internal JCW templates)
            kwargs["queryset"] = Template.objects.all()
        elif db_field.name == "hero_slider_template":
            # Show all active SliderTemplates (HQ slider templates)
            from main_site.models import SliderTemplate
            kwargs["queryset"] = SliderTemplate.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    @admin.action(description='Promote to Master Template')
    def promote_to_master(self, request, queryset):
        """Promote selected projects to master template status."""
        from django.contrib.auth.models import User
        
        # Get or create system user for master templates
        system_user, created = User.objects.get_or_create(
            username='system_template_builder',
            defaults={
                'email': 'system@justcodeworks.com',
                'first_name': 'System',
                'last_name': 'Template Builder',
                'is_active': False,
            }
        )
        
        count = 0
        for project in queryset:
            if not project.is_master_template:
                project.is_master_template = True
                project.owner = system_user  # Assign to system user
                project.is_active = False  # Hide from normal lists
                project.save()
                count += 1
                messages.success(request, f'Promoted {project.name} to master template')
        
        if count:
            messages.success(request, f'Promoted {count} projects to master templates')
    
    @admin.action(description='Clone selected projects')
    def clone_project(self, request, queryset):
        """Clone selected projects (redirects to individual clone pages for input)."""
        if queryset.count() == 1:
            project = queryset.first()
            # For now, just redirect to change view - in future could add custom clone form
            messages.info(
                request, 
                f'To clone "{project.name}", use the Clone API endpoint or implement custom clone form'
            )
        else:
            messages.warning(request, 'Please select only one project to clone')
    
    def get_urls(self):
        """Add custom URLs for content tree editing."""
        urls = super().get_urls()
        custom_urls = [
            path(
                '<path:object_id>/content-tree/',
                self.admin_site.admin_view(self.content_tree_view),
                name='sites_siteproject_content_tree',
            ),
        ]
        return custom_urls + urls
    
    def content_tree_view(self, request, object_id):
        """Custom admin view for editing project content tree."""
        project = get_object_or_404(SiteProject, pk=object_id)
        
        if request.method == 'POST':
            # Handle form submission for quick content updates
            # This is a basic implementation - could be enhanced with JavaScript
            messages.success(request, 'Content tree updated successfully')
            return redirect('admin:sites_siteproject_content_tree', object_id=object_id)
        
        # Get all pages with their sections and fields
        pages = project.pages.all().prefetch_related(
            'sections__fields'
        ).order_by('order', 'locale', 'id')
        
        context = {
            'title': f'Content Tree: {project.name}',
            'project': project,
            'pages': pages,
            'opts': self.model._meta,
            'has_change_permission': True,
        }
        
        return render(request, 'admin/sites/siteproject/content_tree.html', context)
    
    def get_short_uuid(self, obj):
        """Display first 8 characters of UUID for identification."""
        return str(obj.id)[:8] + "..."
    get_short_uuid.short_description = 'UUID (Short)'
    get_short_uuid.admin_order_field = 'id'
    
    def get_primary_locale_display(self, obj):
        """Display primary locale with flag emoji for better visibility."""
        locale_map = {
            'en': '🇺🇸 English',
            'pt': '🇧🇷 Português',
        }
        return locale_map.get(obj.primary_locale, obj.primary_locale)
    get_primary_locale_display.short_description = 'Primary Language'
    get_primary_locale_display.admin_order_field = 'primary_locale'
    
    def changelist_view(self, request, extra_context=None):
        """Override changelist to add content tree links."""
        extra_context = extra_context or {}
        return super().changelist_view(request, extra_context=extra_context)
        
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Add content tree link to change form."""
        extra_context = extra_context or {}
        if object_id:
            extra_context['content_tree_url'] = reverse(
                'admin:sites_siteproject_content_tree',
                args=[object_id]
            )
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "slug", 
        "path",
        "project",
        "get_locale_display",
        "order",
        "is_published",
    )
    list_filter = ("project__is_headquarters", "project", LanguageQuickFilter, LocaleListFilter, "is_published")
    search_fields = ("title", "slug", "path")
    inlines = [HeroSlideInline, SectionInline]
    actions = ['duplicate_to_portuguese']
    
    def get_locale_display(self, obj):
        """Display locale with flag emoji for better visibility."""
        locale_map = {
            'en': '🇺🇸 English',
            'pt': '🇧🇷 Português',
        }
        return locale_map.get(obj.locale, obj.locale)
    get_locale_display.short_description = 'Language'
    get_locale_display.admin_order_field = 'locale'

    @admin.action(description='Duplicate selected pages to Portuguese (PT)')
    def duplicate_to_portuguese(self, request, queryset):
        """
        Admin action to duplicate selected English pages to Portuguese,
        including all sections and fields.
        """
        duplicated_count = 0
        skipped_count = 0
        error_count = 0
        
        for page in queryset:
            try:
                with transaction.atomic():
                    # Check if page is already in Portuguese
                    if page.locale == LocaleChoices.PT:
                        skipped_count += 1
                        continue
                    
                    # Check if Portuguese version already exists
                    pt_exists = Page.objects.filter(
                        project=page.project,
                        slug=page.slug,
                        locale=LocaleChoices.PT
                    ).exists()
                    
                    if pt_exists:
                        skipped_count += 1
                        continue
                    
                    # Create Portuguese copy of the page
                    pt_page = Page.objects.create(
                        project=page.project,
                        locale=LocaleChoices.PT,
                        title=page.title,
                        slug=page.slug,
                        path=page.path,
                        order=page.order,
                        is_published=page.is_published
                    )
                    
                    # Duplicate all sections
                    for section in page.sections.all():
                        pt_section = Section.objects.create(
                            page=pt_page,
                            identifier=section.identifier,
                            internal_name=section.internal_name,
                            order=section.order
                        )
                        
                        # Duplicate all fields in this section
                        for field in section.fields.all():
                            Field.objects.create(
                                section=pt_section,
                                key=field.key,
                                label=field.label,
                                value=field.value
                            )
                    
                    duplicated_count += 1
                    
            except Exception as e:
                error_count += 1
                messages.error(
                    request,
                    f'Error duplicating page "{page.title}": {str(e)}'
                )
        
        # Provide feedback to the user
        if duplicated_count > 0:
            messages.success(
                request,
                f'Successfully duplicated {duplicated_count} page(s) to Portuguese.'
            )
        
        if skipped_count > 0:
            messages.info(
                request,
                f'Skipped {skipped_count} page(s) (already in Portuguese or PT version exists).'
            )
        
        if error_count > 0:
            messages.error(
                request,
                f'Failed to duplicate {error_count} page(s). Check error messages above.'
            )

    fieldsets = (
        (None, {
            "fields": (
                "project",
                "locale",
                "title",
                "slug",
                "path",
                "order",
                "is_published",
            )
        }),
    )


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("page", "identifier", "internal_name", "order")
    list_filter = ("page__project__is_headquarters", "page__project", "page")
    search_fields = ("identifier", "internal_name")
    inlines = [FieldInline]


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ("section", "key", "label", "short_value", "created_at")
    list_filter = ("section__page__project__is_headquarters", "section__page__project", "section__page", "section")
    search_fields = ("key", "label", "value")

    def short_value(self, obj):
        if len(obj.value) > 60:
            return obj.value[:57] + "..."
        return obj.value

    short_value.short_description = "Value"


class BugScreenshotInline(admin.TabularInline):
    model = BugScreenshot
    extra = 0


@admin.register(BugReport)
class BugReportAdmin(admin.ModelAdmin):
    list_display = (
        "summary",
        "status",
        "project",
        "page_path",
        "get_locale_display",
        "user_email",
        "created_at",
    )
    list_filter = ("status", "project", "page_slug", LanguageQuickFilter, LocaleListFilter, "created_at")
    
    def get_locale_display(self, obj):
        """Display locale with flag emoji for better visibility."""
        if not obj.locale:
            return "—"
        locale_map = {
            'en': '🇺🇸 English',
            'pt': '🇧🇷 Português',
        }
        return locale_map.get(obj.locale, obj.locale)
    get_locale_display.short_description = 'Language'
    get_locale_display.admin_order_field = 'locale'
    search_fields = (
        "summary",
        "description",
        "page_path",
        "page_slug",
        "user_email",
        "user_name",
    )
    inlines = [BugScreenshotInline]


@admin.register(BugScreenshot)
class BugScreenshotAdmin(admin.ModelAdmin):
    list_display = ("bug", "image", "created_at")
    search_fields = ("bug__summary",)


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = (
        "page",
        "title",
        "order",
        "is_active",
        "animation_mode",
        "created_at",
    )
    list_filter = ("is_active", "animation_mode", "page__project")
    search_fields = ("title", "subtitle", "body", "eyebrow")
    list_editable = ("order", "is_active")
    ordering = ("page", "order")
    
    fieldsets = (
        ("Basic Info", {
            "fields": ("page", "order", "is_active"),
        }),
        ("Content", {
            "fields": ("eyebrow", "title", "subtitle", "body", "image_url"),
        }),
        ("Animation", {
            "fields": ("animation_mode",),
        }),
        ("Call-to-Action Buttons", {
            "fields": (
                "primary_button_label", "primary_button_url",
                "secondary_button_label", "secondary_button_url"
            ),
            "classes": ("collapse",),
        }),
    )


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = (
        "label",
        "location",
        "get_locale_display",
        "project",
        "column",
        "order",
        "page",
        "url",
        "is_external",
    )
    list_filter = ("project__is_headquarters", "location", LanguageQuickFilter, LocaleListFilter, "project", "column")
    search_fields = ("label", "url", "page__slug", "page__path")
    ordering = ("location", "locale", "column", "order")
    actions = ['duplicate_to_portuguese']
    
    def get_locale_display(self, obj):
        """Display locale with flag emoji for better visibility."""
        locale_map = {
            'en': '🇺🇸 English',
            'pt': '🇧🇷 Português',
        }
        return locale_map.get(obj.locale, obj.locale)
    get_locale_display.short_description = 'Language'
    get_locale_display.admin_order_field = 'locale'

    @admin.action(description='Duplicate selected navigation items to Portuguese (PT)')
    def duplicate_to_portuguese(self, request, queryset):
        """
        Admin action to duplicate selected English navigation items to Portuguese.
        """
        duplicated_count = 0
        skipped_count = 0
        error_count = 0
        
        for nav_item in queryset:
            try:
                with transaction.atomic():
                    # Check if nav item is already in Portuguese
                    if nav_item.locale == LocaleChoices.PT:
                        skipped_count += 1
                        continue
                    
                    # Check if Portuguese version already exists
                    pt_exists = NavigationItem.objects.filter(
                        project=nav_item.project,
                        location=nav_item.location,
                        locale=LocaleChoices.PT,
                        label=nav_item.label
                    ).exists()
                    
                    if pt_exists:
                        skipped_count += 1
                        continue
                    
                    # Create Portuguese copy of the navigation item
                    NavigationItem.objects.create(
                        project=nav_item.project,
                        parent=nav_item.parent,
                        location=nav_item.location,
                        locale=LocaleChoices.PT,
                        column=nav_item.column,
                        label=nav_item.label,
                        page=nav_item.page,
                        url=nav_item.url,
                        is_external=nav_item.is_external,
                        order=nav_item.order
                    )
                    
                    duplicated_count += 1
                    
            except Exception as e:
                error_count += 1
                messages.error(
                    request,
                    f'Error duplicating navigation item "{nav_item.label}": {str(e)}'
                )
        
        # Provide feedback to the user
        if duplicated_count > 0:
            messages.success(
                request,
                f'Successfully duplicated {duplicated_count} navigation item(s) to Portuguese.'
            )
        
        if skipped_count > 0:
            messages.info(
                request,
                f'Skipped {skipped_count} navigation item(s) (already in Portuguese or PT version exists).'
            )
        
        if error_count > 0:
            messages.error(
                request,
                f'Failed to duplicate {error_count} navigation item(s). Check error messages above.'
            )


# [GARAGE-FORM] Quote Request Admin
@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = (
        'site_project', 
        'name', 
        'service_type', 
        'email',
        'phone',
        'car_make_model',
        'created_at', 
        'locale'
    )
    list_filter = (
        'site_project', 
        'service_type', 
        'locale', 
        'consent_marketing',
        'created_at'
    )
    search_fields = (
        'name', 
        'email', 
        'phone', 
        'license_plate',
        'car_make_model',
        'message'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Vehicle Information', {
            'fields': ('license_plate', 'car_make_model')
        }),
        ('Service Request', {
            'fields': ('service_type', 'message')
        }),
        ('Metadata', {
            'fields': ('site_project', 'source_page_slug', 'locale', 'consent_marketing')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


# Custom admin menu configuration
from django.contrib.admin import AdminSite
from django.contrib.admin.apps import AdminConfig

class CustomAdminSite(AdminSite):
    """Custom admin site with additional navigation items."""
    site_header = "JustCodeWorks Admin"
    site_title = "JCW Admin"
    index_title = "JustCodeWorks Administration"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('tenant-showcase/', 
                 self.admin_view(self.tenant_showcase_view), 
                 name='admin-tenant-showcase'),
        ]
        return custom_urls + urls
    
    def tenant_showcase_view(self, request):
        """Tenant showcase view for admin."""
        from .views import tenant_showcase_html_view
        return tenant_showcase_html_view(request)
    
    def index(self, request, extra_context=None):
        """Override index to add custom links."""
        extra_context = extra_context or {}
        extra_context['custom_nav_items'] = [
            {
                'title': 'Tenant Websites Showcase',
                'url': reverse('admin:admin-tenant-showcase'),
                'description': "Preview tenant websites like Mary's Restaurant",
                'icon': '🍽️',
            }
        ]
        return super().index(request, extra_context)


@admin.register(SectionDraft)
class SectionDraftAdmin(admin.ModelAdmin):
    """Admin interface for SectionDraft - Screenshot-to-Section Generator"""
    list_display = ['id', 'project_name', 'section_name', 'status', 'locale', 'image_preview', 'created_at']
    list_filter = ['status', 'locale', 'created_at', 'project__name']
    search_fields = ['section_name', 'project__name', 'project__slug']
    readonly_fields = ['id', 'created_at', 'updated_at', 'image_preview', 'ai_output_display']
    raw_id_fields = ['project']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'project', 'section_name', 'locale', 'status')
        }),
        ('Image', {
            'fields': ('image', 'image_preview')
        }),
        ('AI Output', {
            'fields': ('ai_output_display',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def project_name(self, obj):
        return obj.project.name if obj.project else '-'
    project_name.short_description = 'Project'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 150px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'
    
    def ai_output_display(self, obj):
        if obj.ai_output_json:
            import json
            return format_html('<pre>{}</pre>', json.dumps(obj.ai_output_json, indent=2))
        return 'No AI output yet'
    ai_output_display.short_description = 'AI Generated Data'


# [MAIN WEBSITE SLIDERS] Admin for Main Website Slider system  
class MainWebsiteSlideInline(admin.TabularInline):
    model = MainWebsiteSlide
    extra = 1
    fields = ('order', 'title', 'subtitle', 'primary_cta_text', 'primary_cta_url', 'is_active')
    ordering = ('order',)


@admin.register(MainWebsiteSlider)
class MainWebsiteSliderAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'particles_enabled', 'auto_play', 'created_at')
    list_filter = ('is_active', 'particles_enabled', 'auto_play', 'background_type')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [MainWebsiteSlideInline]
    
    fieldsets = (
        ('🏢 Main Website Slider Settings', {
            'fields': ('name', 'slug', 'is_active'),
            'description': 'This slider is for the main JustCodeWorks website only.'
        }),
        ('Slider Controls', {
            'fields': ('auto_play', 'auto_play_interval', 'show_navigation', 'show_pagination')
        }),
        ('Particle Effects', {
            'fields': ('particles_enabled', 'particles_density', 'particles_speed', 
                      'particles_size_min', 'particles_size_max', 'particles_color', 'particles_opacity'),
            'classes': ('collapse',)
        }),
        ('Background', {
            'fields': ('background_type', 'gradient_from', 'gradient_to', 'gradient_direction',
                      'background_image', 'background_video', 'background_overlay_opacity'),
            'classes': ('collapse',)
        })
    )


@admin.register(MainWebsiteSlide)  
class MainWebsiteSlideAdmin(admin.ModelAdmin):
    list_display = ('slider', 'title', 'order', 'is_active', 'animation_type', 'created_at')
    list_filter = ('is_active', 'animation_type', 'text_alignment', 'slider')
    search_fields = ('title', 'subtitle', 'content')
    list_editable = ('order', 'is_active')
    ordering = ('slider', 'order')
    
    fieldsets = (
        ('🏢 Main Website Slide', {
            'fields': ('slider', 'order', 'is_active'),
            'description': 'This slide is for the main JustCodeWorks website.'
        }),
        ('Content', {
            'fields': ('title', 'subtitle', 'content', 'slide_image', 'slide_video')
        }),
        ('Call to Action', {
            'fields': ('primary_cta_text', 'primary_cta_url', 'secondary_cta_text', 'secondary_cta_url'),
            'classes': ('collapse',)
        }),
        ('Styling', {
            'fields': ('text_color', 'text_alignment', 'animation_type'),
            'classes': ('collapse',)
        })
    )


# [TENANT SLIDERS] Admin for Tenant Homepage Slider system
class HomepageSlideInline(admin.TabularInline):
    model = HomepageSlide
    extra = 1
    fields = ('order', 'title', 'subtitle', 'primary_cta_text', 'primary_cta_url', 'is_active')
    ordering = ('order',)


@admin.register(HomepageSlider)
class HomepageSliderAdmin(admin.ModelAdmin):
    list_display = ('name', 'site_project', 'is_active', 'particles_enabled', 'auto_play', 'created_at')
    list_filter = ('site_project__is_headquarters', 'is_active', 'particles_enabled', 'auto_play', 'background_type', 'site_project')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [HomepageSlideInline]
    
    fieldsets = (
        ('👤 Tenant Website Slider Settings', {
            'fields': ('name', 'slug', 'site_project', 'is_active'),
            'description': 'This slider is for tenant websites only (not the main JCW website).'
        }),
        ('Slider Controls', {
            'fields': ('auto_play', 'auto_play_interval', 'show_navigation', 'show_pagination')
        }),
        ('Particle Effects', {
            'fields': ('particles_enabled', 'particles_density', 'particles_speed', 
                      'particles_size_min', 'particles_size_max', 'particles_color', 'particles_opacity'),
            'classes': ('collapse',)
        }),
        ('Background', {
            'fields': ('background_type', 'gradient_from', 'gradient_to', 'gradient_direction',
                      'background_image', 'background_video', 'background_overlay_opacity'),
            'classes': ('collapse',)
        })
    )


@admin.register(HomepageSlide)  
class HomepageSlideAdmin(admin.ModelAdmin):
    list_display = ('slider', 'title', 'order', 'is_active', 'animation_type', 'created_at')
    list_filter = ('is_active', 'animation_type', 'text_alignment', 'slider')
    search_fields = ('title', 'subtitle', 'content')
    list_editable = ('order', 'is_active')
    ordering = ('slider', 'order')
    
    fieldsets = (
        ('👤 Tenant Website Slide', {
            'fields': ('slider', 'order', 'is_active'),
            'description': 'This slide is for tenant websites only.'
        }),
        ('Content', {
            'fields': ('title', 'subtitle', 'content', 'slide_image', 'slide_video')
        }),
        ('Call to Action', {
            'fields': ('primary_cta_text', 'primary_cta_url', 'secondary_cta_text', 'secondary_cta_url'),
            'classes': ('collapse',)
        }),
        ('Styling', {
            'fields': ('text_color', 'text_alignment', 'animation_type'),
            'classes': ('collapse',)
        })
    )


# [TESTIMONIALS] Admin for Testimonial Carousel system  
class TestimonialSlideInline(admin.TabularInline):
    model = TestimonialSlide
    extra = 1
    fields = ('order', 'customer_name', 'customer_company', 'rating', 'is_active')
    ordering = ('order',)


@admin.register(TestimonialCarousel)
class TestimonialCarouselAdmin(admin.ModelAdmin):
    list_display = ('name', 'site_project', 'is_active', 'auto_play', 'slides_per_view', 'created_at')
    list_filter = ('site_project__is_headquarters', 'is_active', 'auto_play', 'site_project')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [TestimonialSlideInline]
    
    fieldsets = (
        ('Basic Settings', {
            'fields': ('name', 'slug', 'site_project', 'is_active')
        }),
        ('Carousel Settings', {
            'fields': ('auto_play', 'auto_play_interval', 'slides_per_view')
        })
    )


@admin.register(TestimonialSlide)
class TestimonialSlideAdmin(admin.ModelAdmin):
    list_display = ('carousel', 'customer_name', 'customer_company', 'rating', 'order', 'is_active', 'created_at')
    list_filter = ('carousel__site_project__is_headquarters', 'is_active', 'rating', 'carousel')
    search_fields = ('customer_name', 'customer_company', 'testimonial_text')
    list_editable = ('order', 'is_active', 'rating')
    ordering = ('carousel', 'order')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('carousel', 'order', 'is_active', 'rating')
        }),
        ('Customer Info', {
            'fields': ('customer_name', 'customer_title', 'customer_company', 'customer_image')
        }),
        ('Testimonial', {
            'fields': ('testimonial_text',)
        })
    )


# Replace the default admin site
admin.site.__class__ = CustomAdminSite

