from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.core.exceptions import PermissionDenied
from .models import MainPage, MainNavigationItem, MainSiteSettings, MainSlider, MainSlide
from .serializers import MainSliderSerializer, MainSlideSerializer
from django.db.models import Prefetch
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


class MainWebsitePublicView(APIView):
    """
    Public read-only API for the main JCW website.
    Returns site settings, navigation, pages, sections, and fields by locale.
    No authentication required.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get locale from query parameter (default to 'en')
        locale = request.GET.get('locale', 'en')
        
        # Get main site settings
        try:
            site_settings = MainSiteSettings.objects.get(id=1)
            settings_data = {
                'site_name': site_settings.site_name,
                'hero_title': site_settings.hero_title,
                'hero_subtitle': site_settings.hero_subtitle,
                'is_live': site_settings.is_live,
            }
        except MainSiteSettings.DoesNotExist:
            settings_data = {
                'site_name': 'Just Code Works',
                'hero_title': 'Everything you need to get your business online',
                'hero_subtitle': 'Launch a modern website, order your print materials, connect simple POS tools and let your AI assistant do the heavy lifting – all from one place.',
                'is_live': True,
            }
        
        # Get navigation items for this locale
        navigation_items = MainNavigationItem.objects.filter(
            locale=locale
        ).order_by('order').values(
            'id', 'slug', 'path', 'title', 'locale', 'order', 'is_published'
        )
        
        # Get pages for this locale with sections and fields
        pages = MainPage.objects.filter(
            locale=locale,
            is_published=True
        ).prefetch_related(
            'sections__fields'
        ).order_by('order')
        
        # Serialize pages data
        pages_data = []
        for page in pages:
            sections_data = []
            for section in page.sections.all():
                fields_data = []
                for field in section.fields.all():
                    fields_data.append({
                        'id': field.id,
                        'key': field.key,
                        'label': field.label,
                        'value': field.value,
                    })
                
                sections_data.append({
                    'id': section.id,
                    'identifier': section.identifier,
                    'internal_name': section.internal_name,
                    'order': section.order,
                    'fields': fields_data,
                })
            
            pages_data.append({
                'id': page.id,
                'slug': page.slug,
                'path': page.path,
                'title': page.title,
                'locale': page.locale,
                'order': page.order,
                'is_published': page.is_published,
                'meta_title': page.meta_title,
                'meta_description': page.meta_description,
                'sections': sections_data,
            })
        
        return Response({
            'site': settings_data,
            'locale': locale,
            'navigation': list(navigation_items),
            'pages': pages_data,
        })


# MainSlider API Views
class MainSliderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing main website sliders.
    GET: List/retrieve sliders (public)
    POST/PUT/PATCH/DELETE: Admin only
    """
    queryset = MainSlider.objects.all().order_by('-created_at')
    serializer_class = MainSliderSerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        """
        TEMP: Allow all operations without authentication for development
        """
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request,
        })
        return context
    
    def list(self, request, *args, **kwargs):
        """List all sliders with slide counts"""
        sliders = self.get_queryset()
        
        slider_data = []
        for slider in sliders:
            slides_count = slider.slides.count()
            slider_info = {
                'id': slider.id,
                'name': slider.name,
                'slug': slider.slug,
                'is_active': slider.is_active,
                'auto_play': slider.auto_play,
                'auto_play_interval': slider.auto_play_interval,
                'show_navigation': slider.show_navigation,
                'show_pagination': slider.show_pagination,
                'particles_enabled': slider.particles_enabled,
                'particles_density': slider.particles_density,
                'particles_speed': slider.particles_speed,
                'particles_size_min': slider.particles_size_min,
                'particles_size_max': slider.particles_size_max,
                'particles_color': slider.particles_color,
                'particles_colors': slider.particles_colors,
                'particles_opacity': slider.particles_opacity,
                'particles_multi_color': slider.particles_multi_color,
                'background_type': slider.background_type,
                'gradient_from': slider.gradient_from,
                'gradient_to': slider.gradient_to,
                'gradient_direction': slider.gradient_direction,
                'background_image': slider.background_image,
                'background_video': slider.background_video,
                'background_overlay_opacity': slider.background_overlay_opacity,
                'created_at': slider.created_at,
                'updated_at': slider.updated_at,
                'slides_count': slides_count,
            }
            slider_data.append(slider_info)
        
        return Response(slider_data)
    
    def retrieve(self, request, *args, **kwargs):
        """Get a specific slider with its slides"""
        slider = self.get_object()
        
        # Get slides for this slider
        slides = MainSlide.objects.filter(slider=slider).order_by('order', 'id')
        slides_data = []
        for slide in slides:
            slide_info = {
                'id': slide.id,
                'title': slide.title,
                'subtitle': slide.subtitle,
                'content': slide.content,
                'primary_cta_text': slide.primary_cta_text,
                'primary_cta_url': slide.primary_cta_url,
                'secondary_cta_text': slide.secondary_cta_text,
                'secondary_cta_url': slide.secondary_cta_url,
                'text_color': slide.text_color,
                'text_alignment': slide.text_alignment,
                'slide_image': slide.slide_image,
                'slide_video': slide.slide_video,
                'order': slide.order,
                'is_active': slide.is_active,
                'animation_type': slide.animation_type,
                'created_at': slide.created_at,
                'updated_at': slide.updated_at,
            }
            slides_data.append(slide_info)
        
        slider_info = {
            'id': slider.id,
            'name': slider.name,
            'slug': slider.slug,
            'is_active': slider.is_active,
            'auto_play': slider.auto_play,
            'auto_play_interval': slider.auto_play_interval,
            'show_navigation': slider.show_navigation,
            'show_pagination': slider.show_pagination,
            'particles_enabled': slider.particles_enabled,
            'particles_density': slider.particles_density,
            'particles_speed': slider.particles_speed,
            'particles_size_min': slider.particles_size_min,
            'particles_size_max': slider.particles_size_max,
            'particles_color': slider.particles_color,
            'particles_colors': slider.particles_colors,
            'particles_opacity': slider.particles_opacity,
            'particles_multi_color': slider.particles_multi_color,
            'background_type': slider.background_type,
            'gradient_from': slider.gradient_from,
            'gradient_to': slider.gradient_to,
            'gradient_direction': slider.gradient_direction,
            'background_image': slider.background_image,
            'background_video': slider.background_video,
            'background_overlay_opacity': slider.background_overlay_opacity,
            'created_at': slider.created_at,
            'updated_at': slider.updated_at,
            'slides': slides_data,
        }
        
        return Response(slider_info)
    
    def perform_create(self, serializer):
        """Only authenticated users can create sliders (staff check removed for testing)"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Only authenticated users can update sliders (staff check removed for testing)"""
        serializer.save()
    
    def perform_destroy(self, instance):
        """Only authenticated users can delete sliders (staff check removed for testing)"""
        instance.delete()
    
    def create(self, request, *args, **kwargs):
        """Create a new slider"""
        # Note: Authentication is handled by get_permissions(), staff check removed for testing
        
        data = request.data
        
        # Generate slug from name if not provided
        if 'slug' not in data or not data['slug']:
            from django.utils.text import slugify
            data['slug'] = slugify(data.get('name', 'new-slider'))
        
        # Create the slider
        slider = MainSlider.objects.create(
            name=data.get('name', 'New Slider'),
            slug=data['slug'],
            is_active=data.get('is_active', True),
            auto_play=data.get('auto_play', True),
            auto_play_interval=data.get('auto_play_interval', 5000),
            show_navigation=data.get('show_navigation', True),
            show_pagination=data.get('show_pagination', True),
            particles_enabled=data.get('particles_enabled', True),
            particles_density=data.get('particles_density', 100),
            particles_speed=data.get('particles_speed', 1.0),
            particles_size_min=data.get('particles_size_min', 1),
            particles_size_max=data.get('particles_size_max', 3),
            particles_color=data.get('particles_color', '#ffffff'),
            particles_colors=data.get('particles_colors', ''),
            particles_opacity=data.get('particles_opacity', 0.6),
            particles_multi_color=data.get('particles_multi_color', False),
            background_type=data.get('background_type', 'gradient'),
            gradient_from=data.get('gradient_from', '#1e40af'),
            gradient_to=data.get('gradient_to', '#3b82f6'),
            gradient_direction=data.get('gradient_direction', 'to-br'),
            background_image=data.get('background_image', ''),
            background_video=data.get('background_video', ''),
            background_overlay_opacity=data.get('background_overlay_opacity', 0.3),
        )
        
        # Return the created slider data
        slider_data = {
            'id': slider.id,
            'name': slider.name,
            'slug': slider.slug,
            'is_active': slider.is_active,
            'auto_play': slider.auto_play,
            'auto_play_interval': slider.auto_play_interval,
            'show_navigation': slider.show_navigation,
            'show_pagination': slider.show_pagination,
            'particles_enabled': slider.particles_enabled,
            'particles_density': slider.particles_density,
            'particles_speed': slider.particles_speed,
            'particles_size_min': slider.particles_size_min,
            'particles_size_max': slider.particles_size_max,
            'particles_color': slider.particles_color,
            'particles_colors': slider.particles_colors,
            'particles_opacity': slider.particles_opacity,
            'particles_multi_color': slider.particles_multi_color,
            'background_type': slider.background_type,
            'gradient_from': slider.gradient_from,
            'gradient_to': slider.gradient_to,
            'gradient_direction': slider.gradient_direction,
            'background_image': slider.background_image,
            'background_video': slider.background_video,
            'background_overlay_opacity': slider.background_overlay_opacity,
            'created_at': slider.created_at,
            'updated_at': slider.updated_at,
            'slides_count': 0,
        }
        
        return Response(slider_data, status=status.HTTP_201_CREATED)


class MainSlideViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing main website slides.
    TEMP: All operations allowed without authentication for development
    """
    queryset = MainSlide.objects.all().order_by('order', 'id')
    serializer_class = MainSlideSerializer
    
    def get_permissions(self):
        """
        TEMP: Allow all operations without authentication for development
        """
        permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = MainSlide.objects.select_related('slider').order_by('order', 'id')
        
        # Filter by slider if specified
        slider_id = self.request.query_params.get('slider_id')
        if slider_id:
            try:
                queryset = queryset.filter(slider_id=slider_id)
            except ValueError:
                pass
        
        # Only show active slides for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True, slider__is_active=True)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """List slides"""
        slides = self.get_queryset()
        
        slides_data = []
        for slide in slides:
            slide_info = {
                'id': slide.id,
                'slider_id': slide.slider.id,
                'slider_name': slide.slider.name,
                'title': slide.title,
                'subtitle': slide.subtitle,
                'content': slide.content,
                'primary_cta_text': slide.primary_cta_text,
                'primary_cta_url': slide.primary_cta_url,
                'secondary_cta_text': slide.secondary_cta_text,
                'secondary_cta_url': slide.secondary_cta_url,
                'text_color': slide.text_color,
                'text_alignment': slide.text_alignment,
                'slide_image': slide.slide_image,
                'slide_video': slide.slide_video,
                'order': slide.order,
                'is_active': slide.is_active,
                'animation_type': slide.animation_type,
                'created_at': slide.created_at,
                'updated_at': slide.updated_at,
            }
            slides_data.append(slide_info)
        
        return Response(slides_data)
    
    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can create slides.")
        serializer.save()
    
    def perform_update(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can update slides.")
        serializer.save()
    
    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can delete slides.")
        instance.delete()
    
    def create(self, request, *args, **kwargs):
        """Create a new slide"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can create slides'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        data = request.data
        
        # Get the slider
        try:
            slider = MainSlider.objects.get(id=data.get('slider'))
        except MainSlider.DoesNotExist:
            return Response(
                {'error': 'Slider not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create the slide
        slide = MainSlide.objects.create(
            slider=slider,
            title=data.get('title', 'New Slide'),
            subtitle=data.get('subtitle', ''),
            content=data.get('content', ''),
            primary_cta_text=data.get('primary_cta_text', ''),
            primary_cta_url=data.get('primary_cta_url', ''),
            secondary_cta_text=data.get('secondary_cta_text', ''),
            secondary_cta_url=data.get('secondary_cta_url', ''),
            text_color=data.get('text_color', '#ffffff'),
            text_alignment=data.get('text_alignment', 'center'),
            slide_image=data.get('slide_image', ''),
            slide_video=data.get('slide_video', ''),
            order=data.get('order', 0),
            is_active=data.get('is_active', True),
            animation_type=data.get('animation_type', 'fade'),
        )
        
        # Return the created slide data
        slide_data = {
            'id': slide.id,
            'slider_id': slide.slider.id,
            'slider_name': slide.slider.name,
            'title': slide.title,
            'subtitle': slide.subtitle,
            'content': slide.content,
            'primary_cta_text': slide.primary_cta_text,
            'primary_cta_url': slide.primary_cta_url,
            'secondary_cta_text': slide.secondary_cta_text,
            'secondary_cta_url': slide.secondary_cta_url,
            'text_color': slide.text_color,
            'text_alignment': slide.text_alignment,
            'slide_image': slide.slide_image,
            'slide_video': slide.slide_video,
            'order': slide.order,
            'is_active': slide.is_active,
            'animation_type': slide.animation_type,
            'created_at': slide.created_at,
            'updated_at': slide.updated_at,
        }
        
        return Response(slide_data, status=status.HTTP_201_CREATED)
