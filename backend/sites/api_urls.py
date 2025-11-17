from django.urls import path, include
from rest_framework.routers import DefaultRouter

# [JCW] api urls verified - all write endpoints properly protected
from .views import (
    SiteProjectViewSet,
    PageViewSet,
    SectionViewSet,
    FieldViewSet,
    BugReportViewSet,
    NavigationItemViewSet,
    PageListForUserView,
    TenantDashboardTemplateView,
    UserSiteTemplateListView,
    SiteProjectSetTemplateView,
    AdminSiteTemplateListView,
    AdminSiteTemplateDetailView,
    AdminSiteTemplateDetailByKeyView,
    AdminSiteProjectListView,
    AdminSiteProjectDetailView,
    AdminSiteTemplateSectionsView,
    AdminTemplateBrandingView,
    AdminTemplateLabSiteTemplateListView,
    AdminTemplateLabInternalTemplateListView,
    AdminDashboardTemplateListView,
    UserWebsitePreviewView,
    UserSitesForEditingView,
    OnePageWebsiteOnboardingView,
    TenantShowcaseView,
    tenant_showcase_html_view,
    SiteProjectPublicView,
    PageSeoUpdateView,
    SectionContentUpdateView,
    generate_template_skeleton,
    clone_project,
    switch_current_project,
    login_view,
    register_view,
    logout_view,
    auth_me_view,
    csrf_token_view,
    QuoteRequestCreateView,
    AdminQuoteRequestListView,
    AdminQuoteRequestDetailView,
    AdminTemplateSampleSiteView,
    AdminSitesListView,
    AdminSitePublicView,
    TemplateSectionFromSectionView,
    step0_onboarding_view,
    BuilderStep0View,
    HomepageSliderViewSet,
    HomepageSlideViewSet,
    TestimonialCarouselViewSet,
    TestimonialSlideViewSet,
    SectionDraftUploadView,
    SectionDraftProcessView,
    SectionDraftCreateSectionView,
    SectionAISuggestView,
)
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

router = DefaultRouter()
# [TEMPLAB] templates list permissions aligned - using UserSiteTemplateListView in urlpatterns instead
router.register(r"projects", SiteProjectViewSet, basename="project")
router.register(r"pages", PageViewSet, basename="page")
router.register(r"sections", SectionViewSet, basename="section")
router.register(r"fields", FieldViewSet, basename="field")
router.register(r"bug-reports", BugReportViewSet, basename="bug-report")
router.register(r"navigation", NavigationItemViewSet, basename="navigation")

# [SLIDERS] Homepage slider and testimonial carousel endpoints
router.register(r"homepage-sliders", HomepageSliderViewSet, basename="homepage-slider")
router.register(r"homepage-slides", HomepageSlideViewSet, basename="homepage-slide")
router.register(r"testimonial-carousels", TestimonialCarouselViewSet, basename="testimonial-carousel")
router.register(r"testimonial-slides", TestimonialSlideViewSet, basename="testimonial-slide")

urlpatterns = [
    path("pages/my/", PageListForUserView.as_view(), name="page-list-for-user"),
    # [SEO] Page SEO update endpoint
    path("pages/<int:pk>/seo/", PageSeoUpdateView.as_view(), name="page-seo-update"),
    # [CONTENT] Section content update endpoint
    path("sections/<int:pk>/content/", SectionContentUpdateView.as_view(), name="section-content-update"),
    path("dashboard/template/", TenantDashboardTemplateView.as_view(), name="tenant-dashboard-template"),
    # CSRF token endpoint
    path("csrf/", csrf_token_view, name="csrf-token"),
    # Auth endpoints
    path("auth/login/", login_view, name="auth-login"),
    path("auth/register/", register_view, name="auth-register"),
    path("auth/logout/", logout_view, name="auth-logout"),
    path("auth/me/", auth_me_view, name="auth-me"),
    # [TEMPLAB] user template picker endpoints
    path("templates/", UserSiteTemplateListView.as_view(), name="user-site-template-list"),
    path("projects/<uuid:project_id>/set-template/", SiteProjectSetTemplateView.as_view(), name="set-project-template"),
    path("admin/templates/", AdminSiteTemplateListView.as_view(), name="admin-site-template-list"),
    # [TEMPLAB] template detail endpoint
    path("admin/templates/<int:pk>/", AdminSiteTemplateDetailView.as_view(), name="admin-site-template-detail"),
    path("admin/templates/key/<str:key>/", AdminSiteTemplateDetailByKeyView.as_view(), name="admin-site-template-detail-by-key"),
    # [TEMPLAB] site template sections endpoint  
    path("admin/site-templates/<str:key>/sections/", AdminSiteTemplateSectionsView.as_view(), name="admin-site-template-sections"),
    # [ASSETS] branding endpoint
    path("admin/templates/<int:pk>/branding/", AdminTemplateBrandingView.as_view(), name="admin-template-branding"),
    # [ADMIN] Site Projects admin endpoints
    path("admin/site-projects/", AdminSiteProjectListView.as_view(), name="admin-site-projects-list"),
    path("admin/site-projects/<uuid:pk>/", AdminSiteProjectDetailView.as_view(), name="admin-site-projects-detail"),
    # [USER] User's sites for editing
    path("admin/user-sites/", UserSitesForEditingView.as_view(), name="user-sites-for-editing"),
    # [ADMIN-SITES] Sites Explorer admin endpoints
    path("admin/sites/", AdminSitesListView.as_view(), name="admin-sites-list"),
    path("admin/sites/<slug:slug>/public/", AdminSitePublicView.as_view(), name="admin-site-public"),
    
    # [GARAGE-FORM] Admin Quote Requests endpoints
    path("admin/quote-requests/", AdminQuoteRequestListView.as_view(), name="admin-quote-requests-list"),
    path("admin/quote-requests/<int:pk>/", AdminQuoteRequestDetailView.as_view(), name="admin-quote-requests-detail"),
    
    # [TEMPLAB] Template Preview - Sample Site Mapping
    path("admin/templates/<str:template_key>/sample-site/", AdminTemplateSampleSiteView.as_view(), name="admin-template-sample-site"),
    
    # [TEMPLAB] Save Section as Reusable Template Section
    path("admin/template-sections/from-section/", TemplateSectionFromSectionView.as_view(), name="template-section-from-section"),
    
    path("onboarding/one-page-website/", OnePageWebsiteOnboardingView.as_view(), name="onepage-onboarding"),
    
    # [ONBOARDING] Step 0 Multi-Intent Onboarding
    path("onboarding/step-0/", step0_onboarding_view, name="step0-onboarding"),
    
    # [JCW] Step 0 Builder - Complete site creation from onboarding data
    path("builder/step0/", BuilderStep0View.as_view(), name="builder-step0"),
    
    # Template Builder Admin APIs
    path("admin/templates/<int:site_template_id>/generate-skeleton/", generate_template_skeleton, name="admin-generate-skeleton"),
    path("admin/projects/<uuid:project_id>/clone/", clone_project, name="admin-clone-project"),
    
    # Project Management APIs
    path("admin/projects/switch/", switch_current_project, name="switch-current-project"),
    
    # [TEMPLAB] Template Lab admin endpoints
    path("admin/templates/site/", AdminTemplateLabSiteTemplateListView.as_view(), name="admin-template-lab-site-templates"),
    path("admin/templates/internal/", AdminTemplateLabInternalTemplateListView.as_view(), name="admin-template-lab-internal-templates"),
    
    # Django Preview admin endpoints
    path("admin/dashboard-templates/", AdminDashboardTemplateListView.as_view(), name="admin-dashboard-template-list"),
    
    # User dashboard preview endpoints
    path("user/website-preview/", UserWebsitePreviewView.as_view(), name="user-website-preview"),
    
    # [ADMIN] Tenant showcase endpoints
    path("admin/tenant-showcase/", TenantShowcaseView.as_view(), name="admin-tenant-showcase"),
    
    # [AI] Section AI suggestion endpoint
    path("builder/sections/<int:section_id>/ai-suggest/", SectionAISuggestView.as_view(), name="section-ai-suggest"),
    
    # [SECTIONS] Screenshot upload for section generation
    path("sections/upload-screenshot/", SectionDraftUploadView.as_view(), name="section-upload-screenshot"),
    path("sections/<uuid:draft_id>/process/", SectionDraftProcessView.as_view(), name="section-draft-process"),
    path("sections/drafts/<uuid:draft_id>/create-section/", SectionDraftCreateSectionView.as_view(), name="section-draft-create-section"),
    
    # [RMOD] Public API for tenant sites
    path("sites/<slug>/public/", SiteProjectPublicView.as_view(), name="site-public-api"),
    
    # [GARAGE-FORM] Quote request submission endpoint
    path("sites/<slug:site_slug>/quote-requests/", QuoteRequestCreateView.as_view(), name="quote-request-create"),
    
    path("", include(router.urls)),
]
