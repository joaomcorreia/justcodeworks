"""
URL configuration for jcw_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from sites.views import auth_me, tenant_showcase_html_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin/tenant-showcase/', tenant_showcase_html_view, name='admin-tenant-showcase-html'),
    path('api/', include('sites.api_urls')),
    # [MAIN-SITE] Main website API
    path('api/main-site/', include('main_site.urls')),
    # [AUTH] JWT endpoints for API token access (if needed later)
    path('api/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # [AUTH] Session-based auth/me endpoint (duplicated for compatibility)
    path('api/auth/me/', auth_me, name='auth_me'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
