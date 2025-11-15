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
    AdminTemplateSectionsView,
    AdminTemplateBrandingView,
    AdminTemplateLabSiteTemplateListView,
    AdminTemplateLabInternalTemplateListView,
    AdminDashboardTemplateListView,
    UserWebsitePreviewView,
    OnePageWebsiteOnboardingView,
    TenantShowcaseView,
    tenant_showcase_html_view,
    SiteProjectPublicView,
    generate_template_skeleton,
    clone_project,
    switch_current_project,
    login_view,
    logout_view,
    auth_me_view,
    csrf_token_view,
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

urlpatterns = [
    path("pages/my/", PageListForUserView.as_view(), name="page-list-for-user"),
    path("dashboard/template/", TenantDashboardTemplateView.as_view(), name="tenant-dashboard-template"),
    # CSRF token endpoint
    path("csrf/", csrf_token_view, name="csrf-token"),
    # Auth endpoints
    path("auth/login/", login_view, name="auth-login"),
    path("auth/logout/", logout_view, name="auth-logout"),
    path("auth/me/", auth_me_view, name="auth-me"),
    # [TEMPLAB] user template picker endpoints
    path("templates/", UserSiteTemplateListView.as_view(), name="user-site-template-list"),
    path("projects/<uuid:project_id>/set-template/", SiteProjectSetTemplateView.as_view(), name="set-project-template"),
    path("admin/templates/", AdminSiteTemplateListView.as_view(), name="admin-site-template-list"),
    # [TEMPLAB] template detail endpoint
    path("admin/templates/<int:pk>/", AdminSiteTemplateDetailView.as_view(), name="admin-site-template-detail"),
    # [TEMPLAB] template sections endpoint  
    path("admin/templates/<int:template_id>/sections/", AdminTemplateSectionsView.as_view(), name="admin-template-sections"),
    # [ASSETS] branding endpoint
    path("admin/templates/<int:pk>/branding/", AdminTemplateBrandingView.as_view(), name="admin-template-branding"),
    path("onboarding/one-page-website/", OnePageWebsiteOnboardingView.as_view(), name="onepage-onboarding"),
    
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
    
    # [RMOD] Public API for tenant sites
    path("sites/<slug>/public/", SiteProjectPublicView.as_view(), name="site-public-api"),
    
    path("", include(router.urls)),
]
