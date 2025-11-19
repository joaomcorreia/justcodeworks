from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'main_site'

# Create router for viewsets
router = DefaultRouter()
# Slider endpoints removed

urlpatterns = [
    path('public/', views.MainWebsitePublicView.as_view(), name='main-website-public'),
    path('', include(router.urls)),
]