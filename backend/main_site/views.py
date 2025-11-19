from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import MainPage, MainNavigationItem, MainSiteSettings


class MainWebsitePublicView(APIView):
    """
    Public API endpoint for the main JustCodeWorks website.
    Returns site configuration, navigation, and public page data.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Get locale from request or default to 'en'
        locale = request.GET.get('locale', 'en')
        
        # Get site settings
        try:
            site_settings = MainSiteSettings.objects.first()
        except MainSiteSettings.DoesNotExist:
            site_settings = None
        
        if site_settings:
            settings_data = {
                'site_name': site_settings.site_name,
                'hero_title': site_settings.hero_title,
                'hero_subtitle': site_settings.hero_subtitle,
                'is_live': site_settings.is_live,
            }
        else:
            settings_data = {
                'site_name': 'JustCodeWorks',
                'hero_title': 'Everything you need to get your business online',
                'hero_subtitle': 'Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.',
                'is_live': True,
            }
        
        # Get navigation items for this locale
        navigation_items = MainNavigationItem.objects.filter(
            locale=locale,
            is_published=True
        ).order_by('order').values(
            'title', 'path', 'order', 'opens_in_new_tab'
        )
        
        # Get published pages for this locale
        pages = MainPage.objects.filter(
            locale=locale,
            is_published=True
        ).order_by('order')
        
        pages_data = []
        for page in pages:
            pages_data.append({
                'slug': page.slug,
                'path': page.path,
                'title': page.title,
                'order': page.order,
                'sections': [],
            })
        
        return Response({
            'site': settings_data,
            'locale': locale,
            'navigation': list(navigation_items),
            'pages': pages_data,
        })
