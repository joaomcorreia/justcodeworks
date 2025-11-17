import json
from django.conf import settings
from django.db import models
from rest_framework import viewsets, mixins, status, generics, permissions, authentication
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from django.db.models import Prefetch

from .models import Template, SiteProject, Page, Section, Field, BugReport, NavigationItem, HeroSlide, DashboardTemplate, SiteTemplate, TemplateSection, QuoteRequest, SectionDraft, HomepageSlider, HomepageSlide, TestimonialCarousel, TestimonialSlide
from .serializers import (
    TemplateSerializer,
    SiteProjectSerializer,
    PageSerializer,
    SectionSerializer,
    FieldSerializer,
    PageListSerializer,
    PageSnapshotSerializer,
    BugReportSerializer,
    BugReportCreateSerializer,
    NavigationItemSerializer,
    DashboardTemplateSerializer,
    SiteTemplateListSerializer,
    SiteProjectTemplateAssignSerializer,
    AdminSiteTemplateSerializer,
    AdminSiteTemplateDetailSerializer,
    AdminTemplateSectionSerializer,
    AdminSiteProjectSerializer,
    TemplateSectionSerializer,
    TemplateBrandingSerializer,
    SiteTemplateSummarySerializer,
    TemplateSummarySerializer,
    PageSeoUpdateSerializer,
    SectionContentUpdateSerializer,
    SiteProjectPublicSerializer,
    QuoteRequestSerializer,
    AdminQuoteRequestSerializer,
    AdminSitesListSerializer,
    SectionDraftSerializer,
    SectionDraftCreateSerializer,
    HomepageSliderSerializer,
    HomepageSliderListSerializer,
    HomepageSlideSerializer,
    TestimonialCarouselSerializer,
    TestimonialSlideSerializer,
)


def get_page_with_locale_fallback(queryset, project_id=None, slug=None, path=None, locale=None):
    """
    Helper function to get a page with locale fallback logic.
    
    When locale is provided:
    1. First try to find the page for the requested locale
    2. If not found, fall back to 'en' locale
    3. If still not found, return None
    
    Args:
        queryset: Base Page queryset to filter on
        project_id: Optional project filter
        slug: Optional slug filter  
        path: Optional path filter
        locale: Optional locale filter (triggers fallback logic)
        
    Returns:
        Page instance or None if not found
    """
    # Apply base filters
    qs = queryset
    if project_id:
        qs = qs.filter(project_id=project_id)
    if slug:
        qs = qs.filter(slug=slug)
    if path:
        qs = qs.filter(path=path)
        
    if not locale:
        # No locale specified, return first match
        return qs.first()
    
    # Try requested locale first
    page = qs.filter(locale=locale).first()
    if page:
        return page
        
    # Fall back to 'en' if requested locale not found and it's not already 'en'
    if locale != 'en':
        page = qs.filter(locale='en').first()
        if page:
            return page
    
    # No fallback found
    return None


class TemplateViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    Read-only API for templates used by the Templates Lab.
    """

    queryset = Template.objects.all().order_by("name")
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]


class SiteProjectViewSet(viewsets.ModelViewSet):
    """
    API for site projects with owner-based access control.
    - Public: can read active projects
    - Authenticated: can list/create/update their own projects
    """
    
    serializer_class = SiteProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    # [TEMPLAB] templates assign permissions aligned - explicit auth classes
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]

    def get_queryset(self):
        qs = SiteProject.objects.all().order_by("-created_at")
        slug = self.request.query_params.get("slug")
        if slug:
            qs = qs.filter(slug=slug)
            
        # [TEMPLAB] templates assign permissions aligned - authenticated users only see their projects
        if self.request.user.is_authenticated:
            # Authenticated users see only their own projects
            return qs.filter(owner=self.request.user, is_active=True)
        else:
            # Public users see all active projects (for public viewing)
            if self.request.method in ("GET", "HEAD", "OPTIONS"):
                return qs.filter(is_active=True)
            else:
                return SiteProject.objects.none()

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else None
        serializer.save(owner=owner)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.owner and instance.owner != self.request.user:
            raise PermissionDenied("You do not own this project.")
        serializer.save()


class PageViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API for pages with owner-based access control.
    - Public: can read published pages on active projects
    - Authenticated: can list/update pages they own
    """
    queryset = Page.objects.all().select_related("project").prefetch_related(
        Prefetch(
            "hero_slides",
            queryset=HeroSlide.objects.filter(is_active=True).order_by("order", "id"),
        )
    )
    serializer_class = PageSerializer
    # [JCW] permissions tightened
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get("project")
        path = self.request.query_params.get("path")
        slug = self.request.query_params.get("slug")
        locale = self.request.query_params.get("locale")

        # Apply filtering
        if project_id:
            qs = qs.filter(project_id=project_id)
        if path:
            qs = qs.filter(path=path)
        if slug:
            qs = qs.filter(slug=slug)
        if locale:
            qs = qs.filter(locale=locale)

        # Public GET: only published pages on active projects
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return qs.filter(
                project__is_active=True,
                is_published=True,
            )

        # For updates (admin), restrict to owner
        user = self.request.user
        if not user.is_authenticated:
            return Page.objects.none()

        return qs.filter(project__owner=user)

    def perform_update(self, serializer):
        page = self.get_object()
        user = self.request.user
        if not user.is_authenticated or page.project.owner != user:
            raise PermissionDenied("You do not own this page.")
        serializer.save()

    def list(self, request, *args, **kwargs):
        """
        Override list to implement locale fallback when filtering by slug.
        
        If slug + locale are provided, use fallback logic instead of strict filtering.
        Otherwise, use standard list behavior.
        """
        slug = self.request.query_params.get("slug")
        locale = self.request.query_params.get("locale")
        project_id = self.request.query_params.get("project")
        
        # If we have slug + locale, use fallback logic and return single result
        if slug and locale:
            # Get base queryset with access control
            qs = super().get_queryset()
            
            # Apply access control (public GET restrictions)
            if self.request.method in ("GET", "HEAD", "OPTIONS"):
                qs = qs.filter(
                    project__is_active=True,
                    is_published=True,
                )
            else:
                # For authenticated operations, restrict to owner
                user = self.request.user
                if not user.is_authenticated:
                    qs = Page.objects.none()
                else:
                    qs = qs.filter(project__owner=user)
            
            # Use fallback helper to find page
            page = get_page_with_locale_fallback(
                queryset=qs,
                project_id=project_id,
                slug=slug,
                locale=locale
            )
            
            if page:
                serializer = self.get_serializer([page], many=True)
                return Response(serializer.data)
            else:
                return Response([])
        
        # Standard list behavior for all other cases
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def snapshot(self, request, pk=None):
        """
        Returns the page plus its sections and fields in a single payload.

        Intended for the frontend page editor to hydrate all content in one call.
        """
        page = self.get_object()
        serializer = PageSnapshotSerializer(page)
        return Response(serializer.data)


class SectionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API for sections with owner-based access control.
    - Public: can read sections of published pages on active projects
    - Authenticated: can update sections they own
    """
    queryset = Section.objects.all().select_related("page", "page__project")
    serializer_class = SectionSerializer
    # [JCW] permissions tightened
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        page_id = self.request.query_params.get("page")
        identifier = self.request.query_params.get("identifier")

        if page_id:
            qs = qs.filter(page_id=page_id)
        if identifier:
            qs = qs.filter(identifier=identifier)

        # Public GET: only sections of published pages on active projects
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return qs.filter(page__project__is_active=True, page__is_published=True)

        # For updates (admin), restrict to owner
        user = self.request.user
        if not user.is_authenticated:
            return Section.objects.none()
        return qs.filter(page__project__owner=user)

    def perform_update(self, serializer):
        section = self.get_object()
        user = self.request.user
        if not user.is_authenticated or section.page.project.owner != user:
            raise PermissionDenied("You do not own this section.")
        serializer.save()


class FieldViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API for individual fields with owner-based access control.
    - Public: can read fields of published pages on active projects
    - Authenticated: can update fields they own
    """
    queryset = Field.objects.all().select_related(
        "section", "section__page", "section__page__project"
    )
    serializer_class = FieldSerializer
    # [JCW] permissions tightened
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        section_id = self.request.query_params.get("section")
        key = self.request.query_params.get("key")

        if section_id:
            qs = qs.filter(section_id=section_id)
        if key:
            qs = qs.filter(key=key)

        # Public GET: only fields of published pages on active projects
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return qs.filter(
                section__page__project__is_active=True,
                section__page__is_published=True,
            )

        # For updates (admin), restrict to owner
        user = self.request.user
        if not user.is_authenticated:
            return Field.objects.none()
        return qs.filter(section__page__project__owner=user)

    def perform_update(self, serializer):
        field = self.get_object()
        user = self.request.user
        if not user.is_authenticated or field.section.page.project.owner != user:
            raise PermissionDenied("You do not own this field.")
        serializer.save()


class BugReportViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    API for bug reports with mixed access control.
    - Create: open to everyone (anonymous bug reporting)
    - List/Retrieve: authenticated users see reports for their projects only
    """
    queryset = BugReport.objects.all().select_related("project")

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return BugReportCreateSerializer
        return BugReportSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get("project")
        status_param = self.request.query_params.get("status")

        if project_id:
            qs = qs.filter(project_id=project_id)
        if status_param:
            qs = qs.filter(status=status_param)

        user = self.request.user
        if not user.is_authenticated:
            return BugReport.objects.none()

        # Only see reports linked to projects the user owns
        return qs.filter(project__owner=user)


class NavigationItemViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Read-only API for navigation items (header + footer) per project.
    Writes are done via Django admin for now.
    """
    queryset = NavigationItem.objects.all().select_related("project", "page")
    serializer_class = NavigationItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        project_id = self.request.query_params.get("project")
        location = self.request.query_params.get("location")
        locale = self.request.query_params.get("locale")
        column = self.request.query_params.get("column")

        if project_id:
            qs = qs.filter(project_id=project_id)
        if location:
            qs = qs.filter(location=location)
        if locale:
            qs = qs.filter(locale=locale)
        if column:
            try:
                qs = qs.filter(column=int(column))
            except ValueError:
                pass

        # For now, only show nav for active projects
        qs = qs.filter(project__is_active=True)

        return qs.order_by("location", "locale", "column", "order", "id")


class PageListForUserView(generics.ListAPIView):
    """
    Returns pages belonging to projects owned by the authenticated user.
    Optional query params:
      - project_slug: limit pages to a specific project
      - locale: filter by locale (e.g. 'en', 'pt')
    """
    serializer_class = PageListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        qs = Page.objects.select_related("project").filter(
            project__owner=user
        )

        project_slug = self.request.query_params.get("project_slug")
        if project_slug:
            qs = qs.filter(project__slug=project_slug)

        locale = self.request.query_params.get("locale")
        if locale:
            qs = qs.filter(locale=locale)

        return qs.order_by("project__name", "locale", "order", "id")


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login endpoint for Django session authentication (CSRF temporarily disabled for testing)
    """
    from django.contrib.auth import authenticate, login
    
    # Debug information
    csrf_token = request.META.get('HTTP_X_CSRFTOKEN')
    print(f"[DEBUG] CSRF token received: {csrf_token}")
    print(f"[DEBUG] Request data: {request.data}")
    print(f"[DEBUG] Request META keys: {list(request.META.keys())}")
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Registration endpoint for creating new user accounts
    """
    from django.contrib.auth import authenticate, login
    from django.contrib.auth.models import User
    from django.contrib.auth.hashers import make_password
    
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists'}, status=400)
    
    try:
        # Create the user
        user = User.objects.create(
            username=email,  # Use email as username
            email=email,
            password=make_password(password),
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )
        
        # Authenticate and login the new user
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                }
            })
        else:
            return Response({'error': 'Failed to authenticate new user'}, status=500)
    
    except Exception as e:
        return Response({'error': f'Failed to create user: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """
    Logout endpoint for Django session authentication
    """
    from django.contrib.auth import logout
    logout(request)
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([AllowAny])
def auth_me_view(request):
    """
    Get current authenticated user information
    """
    if request.user.is_authenticated:
        user = request.user
        # [AUTH] backend redirect - let frontend handle locale for dashboard
        redirect_to = '/admin/' if (user.is_staff or user.is_superuser) else 'dashboard'
        
        return Response({
            'authenticated': True,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'redirect_to': redirect_to,
            }
        })
    else:
        return Response({
            'authenticated': False,
            'user': None
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_me(request):
    """
    Get current authenticated user information
    # [AUTH] login redirect payload included for frontend routing
    """
    user = request.user
    # [AUTH] login redirect logic - let frontend handle locale for dashboard  
    redirect_to = '/admin/' if (user.is_staff or user.is_superuser) else 'dashboard'
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'redirect_to': redirect_to,  # [AUTH] login redirect payload
    })


class TenantDashboardTemplateView(generics.RetrieveAPIView):
    """
    Returns the dashboard template configuration for the authenticated tenant.
    For now, this always returns the default tenant dashboard template.
    Later we can select template based on project/plan.
    """
    serializer_class = DashboardTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        from django.shortcuts import get_object_or_404
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"[DASHBOARD] Template requested by user: {self.request.user.username}")
        
        # For now: single default template.
        template = DashboardTemplate.objects.filter(
            is_active=True,
            is_default_for_tenants=True,
        ).prefetch_related("blocks").first()

        if not template:
            logger.warning("[DASHBOARD] No default template found, falling back to any active template")
            # fall back to any active template if no default is set
            template = get_object_or_404(
                DashboardTemplate.objects.prefetch_related("blocks").filter(is_active=True)
            )
        else:
            logger.info(f"[DASHBOARD] Returning template: {template.name} with {template.blocks.count()} blocks")

        return template


# [ADMIN]
class IsStaffUser(permissions.BasePermission):
    """
    Allows access only to staff users.
    """

    def has_permission(self, request, view):
        print(f"[DEBUG IsStaffUser] User: {request.user}")
        print(f"[DEBUG IsStaffUser] Is authenticated: {request.user.is_authenticated}")
        print(f"[DEBUG IsStaffUser] Is staff: {getattr(request.user, 'is_staff', False)}")
        print(f"[DEBUG IsStaffUser] Request origin: {request.META.get('HTTP_ORIGIN', 'None')}")
        print(f"[DEBUG IsStaffUser] Cookies: {dict(request.COOKIES)}")
        
        result = bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
        print(f"[DEBUG IsStaffUser] Permission result: {result}")
        return result


class IsPlatformAdmin(permissions.BasePermission):
    """
    Simple permission: only allow staff/admin users.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(user and (getattr(user, "is_staff", False) or getattr(user, "is_superuser", False)))


# [TEMPLAB] templates list view for user template picker
class UserSiteTemplateListView(generics.ListAPIView):
    """
    List published and active site templates for authenticated users to choose from.
    Only shows templates that are ready for user selection.
    """
    serializer_class = SiteTemplateListSerializer
    # [TEMPLAB] templates list permissions aligned - same as SiteProjectViewSet
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # [TEMPLAB] filter for user-selectable templates
        return SiteTemplate.objects.filter(
            is_active=True,
            is_user_selectable=True,  # [TEMPLAB] templates list view
            status="published"
        ).order_by("type", "category", "usage_count", "name")


# [TEMPLAB] set project template view
class SiteProjectSetTemplateView(generics.UpdateAPIView):
    """
    Assign a template to a user's SiteProject. Only the project owner can do this.
    POST /api/projects/<project_id>/set-template/
    Body: {"template_id": 123}
    """
    serializer_class = SiteProjectTemplateAssignSerializer
    permission_classes = [permissions.IsAuthenticated]
    # [TEMPLAB] templates assign permissions aligned - match other project APIs
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]

    def get_object(self):
        """Get the SiteProject, ensuring the user owns it."""
        from django.shortcuts import get_object_or_404
        from django.http import Http404
        
        project_id = self.kwargs['project_id']
        
        # [TEMPLAB] templates assign permissions aligned - improved error handling
        try:
            project = SiteProject.objects.get(id=project_id)
        except SiteProject.DoesNotExist:
            raise Http404("Project not found")
            
        if project.owner != self.request.user:
            raise Http404("Project not found or not owned by you")
            
        return project

    def update(self, request, *args, **kwargs):
        """Assign the template to the project."""
        project = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get the validated template
        template_id = serializer.validated_data['template_id']
        # [TEMPLAB] templates assign permissions aligned
        template = SiteTemplate.objects.get(
            id=template_id,
            is_active=True,
            is_user_selectable=True,
            status="published"
        )
        
        # Assign template to project
        project.site_template = template
        project.save()
        
        # Return updated project info
        return Response({
            'success': True,
            'message': f'Template "{template.name}" assigned to project "{project.name}"',
            'project': {
                'id': str(project.id),
                'name': project.name,
                'template_key': template.key,
                'template_name': template.name,
            }
        })


# [JCW] Step 0 Builder - Complete site creation from onboarding data
class BuilderStep0View(APIView):
    """
    🧱 Step 0 Builder Endpoint - Create a complete site from onboarding data
    
    This is the main builder endpoint that transforms Step 0 onboarding form data
    into a real, functional website with appropriate template, content, and structure.
    
    POST /api/builder/step0/
    
    Input: Combined auth + onboarding data
    Output: Complete site with real content, not placeholders
    """
    authentication_classes = [JWTAuthentication, authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Create a complete site from Step 0 onboarding data."""
        from .utils import clone_project_structure, ensure_template_skeleton
        from django.core.exceptions import ValidationError
        import logging
        
        logger = logging.getLogger(__name__)
        
        try:
            # Extract and validate input data
            data = request.data
            
            # Step 0 required fields
            required_fields = ['website_name', 'website_topic', 'entry_product', 'primary_audience']
            missing_fields = [field for field in required_fields if not data.get(field)]
            
            if missing_fields:
                return Response({
                    'error': f'Missing required fields: {", ".join(missing_fields)}',
                    'status': 'validation_error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract Step 0 data
            website_name = data['website_name'].strip()
            website_topic = data['website_topic'].strip()
            entry_product = data['entry_product']  # website/printing/pos
            primary_audience = data['primary_audience'].strip()
            
            # Optional fields
            tagline = data.get('tagline', '').strip()
            industry = data.get('industry', '').strip()
            description = data.get('description', '').strip()
            
            # Validate entry_product
            valid_products = ['website', 'printing', 'pos']
            if entry_product not in valid_products:
                return Response({
                    'error': f'Invalid entry_product. Must be one of: {", ".join(valid_products)}',
                    'status': 'validation_error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 🎯 Template Selection Logic
            template_key = self._select_template(entry_product, industry, website_topic)
            
            try:
                template = SiteTemplate.objects.get(
                    key=template_key,
                    is_active=True,
                    is_user_selectable=True,
                    status="published"
                )
            except SiteTemplate.DoesNotExist:
                # Fallback to any available user-selectable template
                template = SiteTemplate.objects.filter(
                    is_active=True,
                    is_user_selectable=True,
                    status="published"
                ).first()
                
                if not template:
                    return Response({
                        'error': 'No suitable template found',
                        'status': 'template_error'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Generate unique slug for the project
            from django.utils.text import slugify
            import time
            base_slug = slugify(website_name)
            unique_slug = f"{base_slug}-{int(time.time())}"
            
            # Create the SiteProject with available fields
            project = SiteProject.objects.create(
                name=website_name,
                slug=unique_slug,
                owner=request.user,
                site_template=template,
                entry_product=entry_product,
                business_name=website_name,  # Store website name in business_name field
                onboarding_notes=f"Step 0 Data - Topic: {website_topic}, Audience: {primary_audience}, Industry: {industry}, Description: {description}"
            )
            
            # 📝 Content Generation - Create basic content structure
            try:
                # Create a simple homepage
                homepage = project.pages.create(
                    title=website_name,
                    slug='home',
                    order=0
                )
                
                # Create a basic hero section using correct field names
                hero_section = homepage.sections.create(
                    identifier='hero-section',
                    internal_name='Hero Section',
                    order=0
                )
                
                # Add hero title field
                hero_section.fields.create(
                    key='title',
                    label='Hero Title',
                    value=tagline or f"Welcome to {website_name}",
                    order=0
                )
                
                # Add hero description field if description provided
                if description:
                    hero_section.fields.create(
                        key='subtitle',
                        label='Hero Subtitle',
                        value=description,
                        order=1
                    )
                
                logger.info(f"✅ Step 0 Builder: Created project '{website_name}' for user {request.user.id}")
                
            except Exception as e:
                # Clean up project if content creation fails
                project.delete()
                error_msg = str(e)
                import traceback
                traceback_msg = traceback.format_exc()
                
                # Print to console for debugging
                print(f"❌ Step 0 Builder: Content creation failed: {error_msg}")
                print(f"Traceback: {traceback_msg}")
                
                logger.error(f"❌ Step 0 Builder: Content creation failed: {error_msg}")
                logger.error(f"Traceback: {traceback_msg}")
                return Response({
                    'error': f'Failed to create site content: {error_msg}',
                    'status': 'content_creation_error'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # 🎉 Success Response - Ready to redirect to editor
            return Response({
                'success': True,
                'message': f'Website "{website_name}" created successfully!',
                'project': {
                    'id': str(project.id),
                    'name': project.name,
                    'template_key': template.key,
                    'template_name': template.name,
                    'business_name': project.business_name,
                    'entry_product': project.entry_product,
                    'created_at': project.created_at.isoformat()
                },
                'redirect_to': f'/websites/{project.id}/edit',
                'status': 'created'
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            logger.warning(f"⚠️  Step 0 Builder: Validation error: {str(e)}")
            return Response({
                'error': str(e),
                'status': 'validation_error'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            error_msg = str(e)
            import traceback
            traceback_msg = traceback.format_exc()
            
            # Print to console for debugging
            print(f"❌ Step 0 Builder: Unexpected error: {error_msg}")
            print(f"Traceback: {traceback_msg}")
            
            logger.error(f"❌ Step 0 Builder: Unexpected error: {error_msg}")
            logger.error(f"Traceback: {traceback_msg}")
            return Response({
                'error': f'Unexpected error: {error_msg}',
                'status': 'server_error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _select_template(self, entry_product, industry, website_topic):
        """
        🎯 Template Selection Logic
        
        Selects the most appropriate template based on:
        1. Entry product (website/printing/pos)
        2. Industry context
        3. Website topic/purpose
        
        Uses only templates that are available and user-selectable.
        """
        
        # Default template for most cases - use one-page-basic as fallback
        default_template = "one-page-basic"
        
        # POS systems get auto garage template (closest to business)
        if entry_product == "pos":
            return "auto-garage-modern"  # Available business-focused template
        
        # Printing services get tire center template (service-based)
        if entry_product == "printing":
            return "tire-center-premium"  # Available service template
        
        # Website product - select based on industry/topic
        if entry_product == "website":
            
            # Restaurant/Food industry - exact match available
            if industry and any(keyword in industry.lower() for keyword in ['restaurant', 'food', 'cafe', 'bar', 'dining']):
                return "restaurant-modern"
            
            # Auto/garage industry - exact match available  
            if industry and any(keyword in industry.lower() for keyword in ['auto', 'garage', 'car', 'automotive', 'repair']):
                return "auto-garage-modern"
            
            # Tire/automotive services
            if industry and any(keyword in industry.lower() for keyword in ['tire', 'tires', 'automotive']):
                return "tire-center-premium"
            
            # E-commerce indicators - use ecommerce-basic
            if website_topic and any(keyword in website_topic.lower() for keyword in ['shop', 'store', 'sell', 'product', 'ecommerce']):
                return "ecommerce-basic"
            
            # Landing page indicators - use landing-conversion
            if website_topic and any(keyword in website_topic.lower() for keyword in ['landing', 'conversion', 'marketing', 'campaign']):
                return "landing-conversion"
        
        return default_template




class AdminSiteTemplateListView(generics.ListAPIView):
    """
    List site templates for the admin panel.
    Optional query params:
      - type=website/email/landing
      - status=draft/published/archived
    """
    serializer_class = AdminSiteTemplateSerializer
    # Temporarily allow any authenticated user to debug
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = SiteTemplate.objects.all()

        template_type = self.request.query_params.get("type")
        if template_type:
            qs = qs.filter(type=template_type)

        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)

        return qs.order_by("type", "category", "key")


# [TEMPLAB] template detail endpoint
class AdminSiteTemplateDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single site template with all details for Template Lab.
    """
    serializer_class = AdminSiteTemplateDetailSerializer
    permission_classes = [permissions.IsAuthenticated]  # Temporarily relaxed
    queryset = SiteTemplate.objects.all()


class AdminSiteTemplateDetailByKeyView(generics.RetrieveAPIView):
    """
    Retrieve a single site template by key for admin template explorer.
    """
    serializer_class = AdminSiteTemplateDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SiteTemplate.objects.all()
    lookup_field = 'key'


# [TEMPLAB] Template sections endpoint for site templates
class AdminSiteTemplateSectionsView(generics.ListAPIView):
    """
    List all TemplateSection instances for a specific SiteTemplate by key.
    Staff-only endpoint for Template Lab management.
    """
    serializer_class = AdminTemplateSectionSerializer
    permission_classes = [IsStaffUser]
    
    def get_queryset(self):
        site_template_key = self.kwargs['key']
        try:
            site_template = SiteTemplate.objects.get(key=site_template_key)
            return TemplateSection.objects.filter(
                site_template=site_template
            ).order_by('group', 'default_order', 'id')
        except SiteTemplate.DoesNotExist:
            return TemplateSection.objects.none()


# [ASSETS] branding endpoint
class AdminTemplateBrandingView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH endpoint for template branding assets (logos, favicon).
    """
    serializer_class = TemplateBrandingSerializer
    permission_classes = [permissions.IsAuthenticated]  # Temporarily relaxed
    queryset = SiteTemplate.objects.all()
    lookup_field = 'pk'


# [TEMPLAB] API to create a template section from an existing section
class TemplateSectionFromSectionView(APIView):
    """
    POST endpoint to create a reusable TemplateSection from an existing Section.
    Clones the section and all its fields into a new TemplateSection.
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request, *args, **kwargs):
        from .services import create_template_section_from_section
        
        section_id = request.data.get("section_id")
        name = request.data.get("name")
        key = request.data.get("key")
        
        if not section_id:
            return Response(
                {"detail": "section_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            section = Section.objects.select_related(
                "page__site__site_template"
            ).get(id=section_id)
        except Section.DoesNotExist:
            return Response(
                {"detail": "Section not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Staff/superuser check
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {"detail": "Forbidden - staff access required"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            template_section = create_template_section_from_section(
                section,
                key=key,
                name=name
            )
            
            data = AdminTemplateSectionSerializer(template_section).data
            return Response(data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"detail": f"Failed to create template section: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OnePageWebsiteOnboardingView(generics.CreateAPIView):
    """
    Create a new user and one-page website project through onboarding flow
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        from .serializers import OnePageWebsiteOnboardingSerializer
        from django.contrib.auth.models import User
        from django.contrib.auth.hashers import make_password
        from django.utils.text import slugify
        import uuid
        
        serializer = OnePageWebsiteOnboardingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            # Create the user
            user = User.objects.create(
                username=data['account_email'],  # Use email as username
                email=data['account_email'],
                password=make_password(data['account_password']),
                first_name=data['owner_name'].split()[0] if data['owner_name'].split() else '',
                last_name=' '.join(data['owner_name'].split()[1:]) if len(data['owner_name'].split()) > 1 else '',
                is_active=False  # Require email confirmation
            )
            
            # Get or create a one-page site template
            site_template, _ = SiteTemplate.objects.get_or_create(
                key='jcw-onepage',
                defaults={
                    'name': 'JCW One-Page Website',
                    'description': 'Single page business website template',
                    'type': 'website',
                    'category': 'One-page',
                    'status': 'published',
                    'is_active': True,
                }
            )
            
            # Create the project
            project_slug = slugify(f"{data['business_name']}-{uuid.uuid4().hex[:8]}")
            project = SiteProject.objects.create(
                owner=user,
                site_template=site_template,
                name=data['business_name'],
                slug=project_slug,
                business_type=data['business_type'],
                primary_goal='show-info',  # Default for one-page sites
                primary_locale='en'
            )
            
            # Store business info in project (we can expand this later)
            # For now, we'll just store basic info in the existing fields
            project.save()
            
            # TODO: Send confirmation email
            # For now, we'll assume the existing Django registration system handles this
            # You can implement email sending here or integrate with existing auth system
            
            return Response({
                'detail': 'Account created. Please confirm your email to continue.',
                'requires_email_confirmation': True
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'detail': f'Error creating account: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Template Builder Admin API Views

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def generate_template_skeleton(request, site_template_id):
    """
    Admin-only endpoint to generate default skeleton for a SiteTemplate.
    
    POST /api/admin/templates/<site_template_id>/generate-skeleton/
    """
    from .models import SiteTemplate
    from .utils import ensure_template_skeleton
    from .serializers import GenerateSkeletonSerializer, CloneProjectResponseSerializer
    
    try:
        site_template = SiteTemplate.objects.get(id=site_template_id)
    except SiteTemplate.DoesNotExist:
        return Response(
            {'detail': 'SiteTemplate not found.'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = GenerateSkeletonSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        master_project = ensure_template_skeleton(site_template)
        
        # Count the generated content
        pages_count = master_project.pages.count()
        sections_count = sum(page.sections.count() for page in master_project.pages.all())
        fields_count = sum(
            section.fields.count() 
            for page in master_project.pages.all() 
            for section in page.sections.all()
        )
        
        response_data = {
            'success': True,
            'message': f'Generated skeleton for template "{site_template.name}"',
            'new_project_id': master_project.id,
            'new_project_name': master_project.name,
            'pages_cloned': pages_count,
            'sections_cloned': sections_count,
            'fields_cloned': fields_count,
        }
        
        response_serializer = CloneProjectResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error generating skeleton: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def clone_project(request, project_id):
    """
    Admin-only endpoint to clone a SiteProject.
    
    POST /api/admin/projects/<project_id>/clone/
    Body: {
        "owner_email": "user@example.com",  // optional
        "name": "New Project Name",         // optional  
        "slug": "new-project-slug",         // optional
        "locales": ["en", "pt"]             // optional
    }
    """
    from .models import SiteProject
    from .utils import clone_project_structure
    from .serializers import CloneProjectSerializer, CloneProjectResponseSerializer
    from django.contrib.auth.models import User
    
    try:
        source_project = SiteProject.objects.get(id=project_id)
    except SiteProject.DoesNotExist:
        return Response(
            {'detail': 'SiteProject not found.'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = CloneProjectSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get validated data
        owner_email = serializer.validated_data.get('owner_email')
        name = serializer.validated_data.get('name')
        slug = serializer.validated_data.get('slug')
        locales = serializer.validated_data.get('locales')
        
        # Get owner if email provided
        owner = None
        if owner_email:
            owner = User.objects.get(email=owner_email)
        
        # Clone the project
        new_project = clone_project_structure(
            source_project,
            owner=owner,
            name=name,
            slug=slug,
            locales=locales
        )
        
        # Count the cloned content
        pages_count = new_project.pages.count()
        sections_count = sum(page.sections.count() for page in new_project.pages.all())
        fields_count = sum(
            section.fields.count() 
            for page in new_project.pages.all() 
            for section in page.sections.all()
        )
        
        response_data = {
            'success': True,
            'message': f'Successfully cloned project "{source_project.name}" to "{new_project.name}"',
            'new_project_id': new_project.id,
            'new_project_name': new_project.name,
            'pages_cloned': pages_count,
            'sections_cloned': sections_count,
            'fields_cloned': fields_count,
        }
        
        response_serializer = CloneProjectResponseSerializer(response_data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Owner email not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error cloning project: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow public access for preview functionality
def switch_current_project(request):
    """
    API to switch the current active project for preview purposes.
    This would typically update a configuration or session.
    
    For now, it just validates the project exists and returns success.
    In a full implementation, this could update environment variables or cache.
    """
    project_id = request.data.get('project_id')
    
    if not project_id:
        return Response({
            'success': False,
            'message': 'project_id is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Validate that the project exists and is active
        project = SiteProject.objects.get(id=project_id, is_active=True)
        
        # In a full implementation, you might:
        # - Update a configuration file
        # - Set a cache key
        # - Update environment variables
        # - Store in session/database
        
        return Response({
            'success': True,
            'message': f'Successfully switched to project: {project.name}',
            'project': {
                'id': project.id,
                'name': project.name,
                'slug': project.slug,
                'primary_locale': project.primary_locale,
            }
        })
        
    except SiteProject.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Project not found or inactive'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error switching project: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# [TEMPLAB] Template Lab admin API views
from rest_framework.views import APIView

class AdminTemplateLabSiteTemplateListView(APIView):
    """
    Read-only list of user-facing templates (SiteTemplate) for Template Lab admin.
    """
    
    # [AUTH] reuse the same auth + permissions as SiteProjectViewSet
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Only staff can access Template Lab admin views
        if not request.user.is_staff:
            raise PermissionDenied("Staff access required")
            
        qs = SiteTemplate.objects.all().order_by("name")
        serializer = SiteTemplateSummarySerializer(qs, many=True)
        return Response(serializer.data)


class AdminTemplateLabInternalTemplateListView(APIView):
    """
    Read-only list of internal JCW templates (Template) for Template Lab admin.
    """
    
    # [AUTH] reuse the same auth + permissions as SiteProjectViewSet  
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Only staff can access Template Lab admin views
        if not request.user.is_staff:
            raise PermissionDenied("Staff access required")
            
        qs = Template.objects.all().order_by("name")
        serializer = TemplateSummarySerializer(qs, many=True)
        return Response(serializer.data)


class AdminDashboardTemplateListView(APIView):
    """
    Read-only list of DashboardTemplates for Django Preview admin page.
    """
    
    # [AUTH] reuse the same auth + permissions as SiteProjectViewSet  
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # Only staff can access Django Preview admin views
        if not request.user.is_staff:
            raise PermissionDenied("Staff access required")
            
        qs = DashboardTemplate.objects.all().prefetch_related("blocks").order_by("name")
        serializer = DashboardTemplateSerializer(qs, many=True)
        return Response(serializer.data)


# [USER] User's Sites for Editing
class UserSitesForEditingView(generics.ListAPIView):
    """
    Returns list of authenticated user's sites with full editing data.
    Used in admin edit-website interface.
    
    - Regular users: Only their own sites
    - Admin/Staff users: All sites in the system
    """
    
    serializer_class = SiteProjectPublicSerializer
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin/staff users can see all sites
        if user.is_staff or user.is_superuser:
            return SiteProject.objects.filter(
                is_active=True
            ).select_related('site_template').prefetch_related(
                'pages__sections__fields'
            ).order_by('-updated_at')
        
        # Regular users see only their own sites
        return SiteProject.objects.filter(
            owner=user
        ).select_related('site_template').prefetch_related(
            'pages__sections__fields'
        ).order_by('-updated_at')


class UserWebsitePreviewView(APIView):
    """
    Returns website content preview for the authenticated user's projects.
    Used in dashboard live preview blocks.
    """
    
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Get user's projects
        projects = SiteProject.objects.filter(owner=user).prefetch_related(
            'pages__sections__fields'
        )
        
        preview_data = []
        
        for project in projects:
            project_data = {
                'id': str(project.id),
                'name': project.name,
                'template_key': project.site_template.key if project.site_template else None,
                'template_name': project.site_template.name if project.site_template else None,
                'pages_count': project.pages.count(),
                'pages': []
            }
            
            # Get up to 3 pages for preview
            for page in project.pages.all()[:3]:
                page_data = {
                    'id': page.id,
                    'title': page.title,
                    'slug': page.slug,
                    'is_published': page.is_published,
                    'sections_count': page.sections.count(),
                    'preview_content': {}
                }
                
                # Get preview content from first few sections
                for section in page.sections.all()[:2]:
                    section_preview = {}
                    
                    # Get key fields for preview (title, subtitle, description, etc.)
                    for field in section.fields.all():
                        if field.key in ['title', 'subtitle', 'heading', 'description', 'content']:
                            section_preview[field.key] = field.value[:100] + ('...' if len(field.value) > 100 else '')
                    
                    if section_preview:
                        page_data['preview_content'][section.identifier] = section_preview
                
                project_data['pages'].append(page_data)
            
            preview_data.append(project_data)
        
        return Response({
            'projects': preview_data,
            'total_projects': len(preview_data),
            'total_pages': sum(p['pages_count'] for p in preview_data)
        })


# [ADMIN] Admin-specific views for tenant showcase
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

@method_decorator(staff_member_required, name='dispatch')
class TenantShowcaseView(generics.GenericAPIView):
    """
    Admin view to showcase tenant websites like Mary's Restaurant
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get Mary's Restaurant specifically for showcase
        try:
            marys_project = SiteProject.objects.get(name="Mary's Restaurant")
            
            # Get all pages with their sections and fields
            pages_data = []
            for page in marys_project.pages.all().order_by('order'):
                sections_data = []
                for section in page.sections.all().order_by('order'):
                    fields_data = []
                    for field in section.fields.all().order_by('order'):
                        fields_data.append({
                            'key': field.key,
                            'label': field.label,
                            'value': field.value
                        })
                    sections_data.append({
                        'identifier': section.identifier,
                        'internal_name': section.internal_name,
                        'fields': fields_data
                    })
                pages_data.append({
                    'slug': page.slug,
                    'title': page.title,
                    'path': page.path,
                    'sections': sections_data
                })
            
            showcase_data = {
                'project': {
                    'id': str(marys_project.id),
                    'name': marys_project.name,
                    'slug': marys_project.slug,
                    'business_type': marys_project.business_type,
                    'template_key': marys_project.site_template.key if marys_project.site_template else None,
                    'template_name': marys_project.site_template.name if marys_project.site_template else None,
                },
                'pages': pages_data,
                'stats': {
                    'total_pages': len(pages_data),
                    'total_sections': sum(len(p['sections']) for p in pages_data),
                    'total_fields': sum(len(s['fields']) for p in pages_data for s in p['sections']),
                }
            }
            
            return Response(showcase_data)
            
        except SiteProject.DoesNotExist:
            return Response({
                'error': 'Mary\'s Restaurant not found. Please run create_marys_restaurant.py first.'
            }, status=404)


@require_http_methods(["GET"])
@staff_member_required
def tenant_showcase_html_view(request):
    """
    HTML view for admin to see tenant websites showcase
    """
    context = {
        'title': 'Tenant Websites Showcase',
        'description': 'Preview of tenant websites like Mary\'s Restaurant'
    }
    return render(request, 'admin/sites/tenant_showcase.html', context)


# [RMOD] Public API for tenant sites
class SiteProjectPublicView(generics.RetrieveAPIView):
    """
    Public read-only API for tenant sites.
    Returns project info, pages, sections, and fields by slug.
    No authentication required.
    """
    serializer_class = SiteProjectPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """
        Only return active projects with their pages, sections, and fields.
        """
        return SiteProject.objects.filter(
            is_active=True
        ).prefetch_related(
            'pages__sections__fields'
        ).select_related('site_template')


# [SEO] Permission class for SEO operations
class IsProjectOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow project owners or staff to update page SEO.
    """
    def has_object_permission(self, request, view, obj):
        # Staff users can access any page
        if request.user.is_staff:
            return True
        # Project owners can access their pages
        return obj.project.owner == request.user


# [SEO] Page SEO Update View
class PageSeoUpdateView(generics.UpdateAPIView):
    """
    Update SEO fields for a page.
    Only project owner or staff can update.
    """
    queryset = Page.objects.all()
    serializer_class = PageSeoUpdateSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerOrStaff]
    
    def get_object(self):
        """Get page and check permissions"""
        page = super().get_object()
        self.check_object_permissions(self.request, page)
        return page


# [CONTENT] Permission class for Section content operations
class IsSectionProjectOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow project owners or staff to update section content.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_staff:
            return True

        page = getattr(obj, "page", None)
        if not page:
            return False

        project = getattr(page, "project", None)
        if not project:
            return False

        return project.owner_id == user.id


# [CONTENT] Section Content Update View
class SectionContentUpdateView(generics.UpdateAPIView):
    """
    Update the content fields of a Section (hero, about, menu, contact, etc.).
    """
    queryset = Section.objects.all()
    serializer_class = SectionContentUpdateSerializer
    permission_classes = [IsAuthenticated, IsSectionProjectOwnerOrStaff]
    http_method_names = ["patch", "options", "head"]

    def get_object(self):
        section = super().get_object()
        self.check_object_permissions(self.request, section)
        return section


# [ADMIN]
class AdminSiteProjectListView(generics.ListAPIView):
    """
    Read-only list of all site projects for staff users.
    """

    queryset = SiteProject.objects.select_related("owner", "template", "site_template").all()
    serializer_class = AdminSiteProjectSerializer
    permission_classes = [IsStaffUser]

    def get_queryset(self):
        qs = super().get_queryset()

        search = self.request.query_params.get("search")
        if search:
            from django.db import models
            qs = qs.filter(
                models.Q(name__icontains=search)
                | models.Q(slug__icontains=search)
                | models.Q(owner__email__icontains=search)
            )

        return qs.order_by("-created_at")


# [ADMIN]
class AdminSiteProjectDetailView(generics.RetrieveAPIView):
    """
    Read-only detail view for a single site project.
    """

    queryset = SiteProject.objects.select_related("owner", "template", "site_template").all()
    serializer_class = AdminSiteProjectSerializer
    permission_classes = [IsStaffUser]


# [GARAGE-FORM] Quote Request API View
class QuoteRequestCreateView(generics.CreateAPIView):
    """
    Public API endpoint to create quote requests for garage services.
    No authentication required - this is for public website forms.
    """
    serializer_class = QuoteRequestSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        """
        Associate the quote request with the correct SiteProject based on slug.
        """
        site_slug = self.kwargs.get('site_slug')
        try:
            site_project = SiteProject.objects.get(slug=site_slug, is_active=True)
        except SiteProject.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound(f"Site '{site_slug}' not found or inactive.")
            
        serializer.save(site_project=site_project)


# [ADMIN] Sites Explorer Views
class AdminSitesListView(generics.ListAPIView):
    """
    Staff-only endpoint to list all SiteProjects for the admin Sites Explorer.
    Returns basic site info with owner and template details.
    """
    serializer_class = AdminSitesListSerializer
    permission_classes = [IsStaffUser]
    
    def get_queryset(self):
        return SiteProject.objects.select_related('owner', 'site_template').order_by('-created_at')


class AdminSitePublicView(generics.RetrieveAPIView):
    """
    Staff-only endpoint to view a specific site's public data.
    Returns the same JSON structure as the public site API for admin inspection.
    """
    serializer_class = SiteProjectPublicSerializer
    permission_classes = [IsStaffUser]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return SiteProject.objects.select_related('owner', 'site_template').prefetch_related(
            Prefetch('pages', queryset=Page.objects.select_related().prefetch_related(
                Prefetch('sections', queryset=Section.objects.select_related().prefetch_related('fields'))
            ))
        )


# CSRF Token View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token_view(request):
    """
    Get CSRF token for frontend
    """
    return Response({
        'success': True,
        'csrfToken': get_token(request)
    })


# [GARAGE-FORM] Admin Quote Request Views for JCW Admin
class AdminQuoteRequestListView(generics.ListAPIView):
    """
    List all quote requests for admin interface.
    Supports filtering by site_slug and locale.
    """
    serializer_class = AdminQuoteRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = QuoteRequest.objects.select_related('site_project').order_by('-created_at')
        
        # Filter by site slug if provided
        site_slug = self.request.query_params.get('site_slug')
        if site_slug:
            queryset = queryset.filter(site_project__slug=site_slug)
            
        # Filter by locale if provided
        locale = self.request.query_params.get('locale')
        if locale and locale != 'all':
            queryset = queryset.filter(locale=locale)
            
        return queryset


class AdminQuoteRequestDetailView(generics.RetrieveAPIView):
    """
    Get detailed view of a single quote request for admin interface.
    """
    serializer_class = AdminQuoteRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return QuoteRequest.objects.select_related('site_project')


# [TEMPLAB] Template Preview - Sample Site Mapping
class AdminTemplateSampleSiteView(APIView):
    """
    Get sample site mapping for template preview.
    Returns the sample SiteProject slug to use for live template preview.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    # Hard-coded template key to sample site slug mappings
    TEMPLATE_SAMPLE_MAPPINGS = {
        'restaurant-modern': 'marys-restaurant',
        'auto-garage-modern': 'oficina-paulo-calibra',
    }
    
    def get(self, request, template_key):
        sample_site_slug = self.TEMPLATE_SAMPLE_MAPPINGS.get(template_key)
        
        if not sample_site_slug:
            return Response(
                {"error": f"No sample site mapping found for template key: {template_key}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify the sample site actually exists
        try:
            SiteProject.objects.get(slug=sample_site_slug)
        except SiteProject.DoesNotExist:
            return Response(
                {"error": f"Sample site not found: {sample_site_slug}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response({
            "template_key": template_key,
            "sample_site_slug": sample_site_slug
        })


# [ONBOARDING] Step 0 Multi-Intent Onboarding API
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def step0_onboarding_view(request):
    """
    Step 0 Multi-Intent Onboarding endpoint.
    Creates or updates SiteProject with user's onboarding data.
    
    POST /api/onboarding/step-0/
    Body: {
        "entry_intent": "website|prints|pos",
        "business_name": "My Business Name",
        "business_type": "Restaurant", 
        "primary_country": "United States",
        "primary_language": "en",
        "brand_primary_color": "#1D4ED8",
        "brand_secondary_color": "#6366F1", 
        "preferred_theme_mode": "dark",
        "primary_goal": "get-leads",
        "onboarding_notes": "Internal notes"
    }
    
    Returns: {
        "success": true,
        "project": { ... project data ... },
        "redirect_url": "/dashboard?active_section=website"
    }
    """
    from .serializers import Step0OnboardingSerializer
    
    # Validate onboarding data
    serializer = Step0OnboardingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {
                "success": false, 
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create or update project
        project = serializer.create_or_update_project(
            serializer.validated_data,
            request.user
        )
        
        # Generate redirect URL based on intent
        entry_intent = serializer.validated_data.get('entry_intent')
        redirect_url = f"/dashboard?active_section={entry_intent}"
        
        # Return project data using existing serializer
        from .serializers import SiteProjectSerializer
        project_serializer = SiteProjectSerializer(project)
        
        return Response({
            "success": True,
            "project": project_serializer.data,
            "redirect_url": redirect_url
        })
        
    except Exception as e:
        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# [AI] Section AI Suggestion View
class SectionAISuggestView(APIView):
    """
    AI suggestion endpoint for section content.
    POST /api/builder/sections/<section_id>/ai-suggest/
    Provides smart content suggestions based on business context.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [
        authentication.SessionAuthentication,
        JWTAuthentication,
    ]

    def post(self, request, section_id):
        from django.conf import settings
        import json
        
        try:
            # Get section and verify ownership
            section = Section.objects.select_related(
                'page__project__owner'
            ).get(id=section_id)
            
            # Verify user owns this section's project
            if section.page.project.owner != request.user:
                return Response(
                    {"error": "You don't have permission to access this section"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Extract request data
            locale = request.data.get('locale', 'en')
            tone = request.data.get('tone', 'friendly and professional')
            extra_instructions = request.data.get('extra_instructions', '')
            
            # Gather business context
            project = section.page.project
            business_name = project.name
            industry = getattr(project, 'business_type', None) or 'local business'
            
            # Get existing field keys for this section
            fields = section.fields.all().values_list('key', 'label')
            field_list = []
            for key, label in fields:
                field_list.append(f'"{key}": {label or key}')
            field_context = ', '.join(field_list)
            
            # Check OpenAI API key
            if not settings.OPENAI_API_KEY:
                return Response(
                    {"error": "AI suggestion service is not configured"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Call OpenAI
            try:
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                
                system_prompt = """You are an assistant that writes website copy for small businesses.
You must return a JSON object with keys that match the section field keys.
Do not include any extra keys or explanations – only the JSON.
Keep content concise and professional."""

                user_prompt = f"""Business name: {business_name}
Industry: {industry}
Language: {locale}
Section type: {section.identifier}

Fields needed: {field_context}
Tone: {tone}
{f"Special instructions: {extra_instructions}" if extra_instructions else ""}

Write short, clear copy for this section. 
Keep it realistic for a small business website.
Return JSON with only the field keys that exist in this section."""

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format={"type": "json_object"},
                )
                
                # Parse AI response
                ai_content = response.choices[0].message.content
                suggested_data = json.loads(ai_content)
                
                # Filter to only include valid field keys
                valid_keys = set(key for key, _ in fields)
                filtered_suggestions = {
                    k: v for k, v in suggested_data.items() 
                    if k in valid_keys
                }
                
                return Response({
                    "suggested": filtered_suggestions
                })
                
            except Exception as ai_error:
                return Response(
                    {"error": f"AI service error: {str(ai_error)}"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
        except Section.DoesNotExist:
            return Response(
                {"error": "Section not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SectionDraftUploadView(APIView):
    """
    POST /api/sections/upload-screenshot/
    
    Upload a screenshot image to generate website sections from.
    Step 1: Just store the image and create a draft - no AI processing yet.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SectionDraftCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if user has access to the project
            project_id = serializer.validated_data.get('project')
            if project_id and not request.user.is_staff:
                try:
                    project = SiteProject.objects.get(id=project_id, owner=request.user)
                except SiteProject.DoesNotExist:
                    return Response(
                        {"error": "Project not found or access denied."},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            # Create the section draft
            section_draft = serializer.save()
            
            # Return the created draft with image URL
            response_serializer = SectionDraftSerializer(section_draft, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SectionDraftProcessView(APIView):
    """
    POST /api/sections/{draft_id}/process/
    
    Process an uploaded screenshot with AI to extract sections and generate content.
    Step 2: AI analysis to convert screenshot → structured section data.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        try:
            # Get the section draft
            section_draft = SectionDraft.objects.get(id=draft_id)
            
            # Check permissions
            if not request.user.is_staff and section_draft.project.owner != request.user:
                return Response(
                    {"error": "Permission denied."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if already processing
            if section_draft.status == 'processing':
                return Response(
                    {"message": "Draft is already being processed."},
                    status=status.HTTP_202_ACCEPTED
                )
            
            # Check OpenAI API key
            if not settings.OPENAI_API_KEY:
                return Response(
                    {"error": "AI processing service is not configured."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Update status to processing
            section_draft.status = 'processing'
            section_draft.save()
            
            try:
                # Process with OpenAI Vision API
                import base64
                from openai import OpenAI
                
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                
                # Read and encode the image
                with section_draft.image.open('rb') as image_file:
                    image_data = base64.b64encode(image_file.read()).decode('utf-8')
                
                # Create the AI prompt
                system_prompt = """You are an expert web designer that analyzes website screenshots and extracts section information.

                Analyze the provided screenshot and identify distinct website sections (header, hero, about, services, contact, etc.).
                
                Return a JSON object with this structure:
                {
                    "sections": [
                        {
                            "type": "hero",
                            "title": "Main heading text",
                            "content": "Body text content",
                            "image_url": "URL if there's an image",
                            "cta_text": "Call to action text if present",
                            "cta_url": "Call to action URL if present"
                        },
                        {
                            "type": "about",
                            "title": "About section heading", 
                            "content": "About section text content"
                        }
                    ],
                    "overall_theme": "modern/classic/minimal/etc",
                    "color_scheme": "blue/green/red/etc",
                    "business_type": "restaurant/services/ecommerce/etc"
                }

                Extract all visible text accurately. Identify section types like: hero, about, services, menu, contact, footer, testimonials, gallery, etc."""

                user_prompt = f"""Analyze this website screenshot and extract all visible sections with their content.
                
                Project context: {section_draft.project.name}
                Locale: {section_draft.locale or 'en'}
                
                Please provide accurate extraction of all text, headings, and identify the section types clearly."""

                response = client.chat.completions.create(
                    model="gpt-4o",  # Use the vision model
                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt
                        },
                        {
                            "role": "user", 
                            "content": [
                                {"type": "text", "text": user_prompt},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{image_data}"
                                    }
                                }
                            ]
                        }
                    ],
                    response_format={"type": "json_object"},
                )
                
                # Parse AI response
                ai_content = response.choices[0].message.content
                ai_data = json.loads(ai_content)
                
                # Store the AI output
                section_draft.ai_output_json = ai_data
                section_draft.status = 'ready'
                section_draft.save()
                
                # Return the processed data
                response_serializer = SectionDraftSerializer(section_draft, context={'request': request})
                return Response(response_serializer.data, status=status.HTTP_200_OK)
                
            except Exception as e:
                # Mark as error and return details
                section_draft.status = 'error'
                section_draft.save()
                
                return Response(
                    {"error": f"AI processing failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except SectionDraft.DoesNotExist:
            return Response(
                {"error": "Section draft not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class SectionDraftCreateSectionView(APIView):
    """
    POST /api/sections/drafts/{draft_id}/create-section/
    
    Convert AI-analyzed section data into actual Page sections.
    Step 3: AI JSON → Section + Field models with page selection.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        try:
            # Get the section draft
            section_draft = SectionDraft.objects.get(id=draft_id)
            
            # Check permissions
            if not request.user.is_staff and section_draft.project.owner != request.user:
                return Response(
                    {"error": "Permission denied."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if AI processing is complete
            if section_draft.status != 'ready' or not section_draft.ai_output_json:
                return Response(
                    {"error": "Section draft is not ready. Please complete AI processing first."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get page_id from request body
            page_id = request.data.get('page_id')
            if not page_id:
                return Response(
                    {"error": "page_id is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get and validate the page
            try:
                page = Page.objects.get(id=page_id, project=section_draft.project)
            except Page.DoesNotExist:
                return Response(
                    {"error": "Page not found or doesn't belong to this project."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Parse AI data
            ai_data = section_draft.ai_output_json
            sections_data = ai_data.get('sections', [])
            
            if not sections_data:
                return Response(
                    {"error": "No sections found in AI data."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            created_sections = []
            
            # Get the current max order for sections in this page
            max_order = page.sections.aggregate(models.Max('order'))['order__max'] or 0
            
            # Create sections from AI data
            for i, section_data in enumerate(sections_data):
                section_type = section_data.get('type', 'content')
                section_title = section_data.get('title', f'AI Section {i + 1}')
                
                # Generate unique identifier
                base_identifier = f"ai-{section_type}-{i + 1}"
                identifier = base_identifier
                counter = 1
                
                # Ensure unique identifier within the page
                while page.sections.filter(identifier=identifier).exists():
                    identifier = f"{base_identifier}-{counter}"
                    counter += 1
                
                # Create the section
                section = Section.objects.create(
                    page=page,
                    identifier=identifier,
                    internal_name=section_title,
                    order=max_order + i + 1
                )
                
                # Create fields from section data
                field_order = 0
                
                # Title field (most sections have this)
                if section_data.get('title'):
                    Field.objects.create(
                        section=section,
                        key='title',
                        label='Title',
                        value=section_data['title'],
                        order=field_order
                    )
                    field_order += 1
                
                # Content field
                if section_data.get('content'):
                    Field.objects.create(
                        section=section,
                        key='content',
                        label='Content',
                        value=section_data['content'],
                        order=field_order
                    )
                    field_order += 1
                
                # Image URL field
                if section_data.get('image_url'):
                    Field.objects.create(
                        section=section,
                        key='image_url',
                        label='Image URL',
                        value=section_data['image_url'],
                        order=field_order
                    )
                    field_order += 1
                
                # CTA text field
                if section_data.get('cta_text'):
                    Field.objects.create(
                        section=section,
                        key='cta_text',
                        label='Call to Action Text',
                        value=section_data['cta_text'],
                        order=field_order
                    )
                    field_order += 1
                
                # CTA URL field
                if section_data.get('cta_url'):
                    Field.objects.create(
                        section=section,
                        key='cta_url',
                        label='Call to Action URL',
                        value=section_data['cta_url'],
                        order=field_order
                    )
                    field_order += 1
                
                # Section type field for frontend rendering
                Field.objects.create(
                    section=section,
                    key='section_type',
                    label='Section Type',
                    value=section_type,
                    order=field_order
                )
                
                created_sections.append({
                    'id': section.id,
                    'identifier': section.identifier,
                    'internal_name': section.internal_name,
                    'fields_count': section.fields.count()
                })
            
            # Store business type and theme as page-level fields if available
            if ai_data.get('business_type') or ai_data.get('overall_theme') or ai_data.get('color_scheme'):
                # Find or create a metadata section for this page
                metadata_section, created = Section.objects.get_or_create(
                    page=page,
                    identifier='ai-metadata',
                    defaults={
                        'internal_name': 'AI Metadata',
                        'order': 0  # Put metadata at the top
                    }
                )
                
                if ai_data.get('business_type'):
                    Field.objects.update_or_create(
                        section=metadata_section,
                        key='business_type',
                        defaults={
                            'label': 'Business Type',
                            'value': ai_data['business_type'],
                            'order': 0
                        }
                    )
                
                if ai_data.get('overall_theme'):
                    Field.objects.update_or_create(
                        section=metadata_section,
                        key='overall_theme',
                        defaults={
                            'label': 'Overall Theme',
                            'value': ai_data['overall_theme'],
                            'order': 1
                        }
                    )
                
                if ai_data.get('color_scheme'):
                    Field.objects.update_or_create(
                        section=metadata_section,
                        key='color_scheme',
                        defaults={
                            'label': 'Color Scheme',
                            'value': ai_data['color_scheme'],
                            'order': 2
                        }
                    )
            
            return Response({
                'success': True,
                'page_id': page.id,
                'page_name': page.title,
                'sections_created': len(created_sections),
                'sections': created_sections
            }, status=status.HTTP_201_CREATED)
            
        except SectionDraft.DoesNotExist:
            return Response(
                {"error": "Section draft not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create sections: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# [SLIDERS] Homepage Slider API Views
class HomepageSliderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing homepage sliders.
    GET: List/retrieve sliders (public)
    POST/PUT/PATCH/DELETE: Admin only
    """
    serializer_class = HomepageSliderSerializer
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HomepageSliderListSerializer
        return HomepageSliderSerializer
    
    def get_queryset(self):
        queryset = HomepageSlider.objects.prefetch_related('slides').order_by('-created_at')
        
        # Filter by project if specified
        project_id = self.request.query_params.get('project_id')
        if project_id:
            try:
                queryset = queryset.filter(site_project_id=project_id)
            except ValueError:
                pass  # Invalid project_id, ignore
        
        # Only show active sliders for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def get_permissions(self):
        """
        Public read access for sliders, admin access for modifications
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        # Only staff can create sliders
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can create sliders.")
        serializer.save()
    
    def perform_update(self, serializer):
        # Only staff can update sliders
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can update sliders.")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only staff can delete sliders
        if not self.request.user.is_staff:
            raise PermissionDenied("Only staff can delete sliders.")
        instance.delete()


class HomepageSlideViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing individual homepage slides.
    Admin-only access for create/update/delete.
    """
    serializer_class = HomepageSlideSerializer
    
    def get_queryset(self):
        queryset = HomepageSlide.objects.select_related('slider').order_by('order', 'id')
        
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
    
    def get_permissions(self):
        """
        Public read access for slides, admin access for modifications
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
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


# [TESTIMONIALS] Testimonial Carousel API Views
class TestimonialCarouselViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing testimonial carousels.
    """
    serializer_class = TestimonialCarouselSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = TestimonialCarousel.objects.prefetch_related('testimonials').order_by('-created_at')
        
        # Filter by project if specified
        project_id = self.request.query_params.get('project_id')
        if project_id:
            try:
                queryset = queryset.filter(site_project_id=project_id)
            except ValueError:
                pass
        
        # Only show active carousels for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]


class TestimonialSlideViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing individual testimonials.
    """
    serializer_class = TestimonialSlideSerializer
    
    def get_queryset(self):
        queryset = TestimonialSlide.objects.select_related('carousel').order_by('order', 'id')
        
        # Filter by carousel if specified  
        carousel_id = self.request.query_params.get('carousel_id')
        if carousel_id:
            try:
                queryset = queryset.filter(carousel_id=carousel_id)
            except ValueError:
                pass
        
        # Only show active testimonials for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True, carousel__is_active=True)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
