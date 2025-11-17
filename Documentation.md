# Just Code Works – Documentation (v0.3)

**Project:** Just Code Works (JCW)  
**Stack:** Django 5 + DRF + JWT (backend), Next.js App Router + TypeScript + Tailwind (frontend)  
**Goal:** Multi-tenant website builder + admin platform + printing & extras.

This file is the **single source of truth** for how JCW is structured, how it should evolve, and how AI assistants (ChatGPT / Claude) must operate on the codebase.

---

## 1. High-Level Overview

JCW is:

- A **multi-tenant website builder** where each customer has a `SiteProject`.
- Frontend built with **Next.js App Router** and **locale-based routing**.
- Backend built with **Django + DRF + JWT**.
- Users:
  - **Staff (admin)** → JCW Admin dashboard in Next.js, plus Django admin link.
  - **Normal users** → Tenant dashboard to edit their website.
- Tenant public sites live at `/sites/[slug]` (no locale).

Core entities:

- `SiteProject` – tenant website instance (Mary’s Restaurant, etc.)
- `Page` – logical page of a site (`home`, `menu`, `contact`, …)
- `Section` – content block within a page (hero, about-us, menu list, contact info…)
- `Field` – atomic content (headline, text, images, prices, etc.)
- `Template` – internal JCW templates for structure.
- `SiteTemplate` – user-facing “theme” (e.g. `restaurant-modern`, `jcw-main`).

---

## 2. Project Structure

### 2.1 Backend (Django)

Root: `C:\projects\justcodeworks\backend`

Key apps (names may differ, adjust as needed):

- `core` / `accounts` – auth, users, JWT.
- `sites` – `SiteProject`, `Page`, `Section`, `Field`, `SiteTemplate`, `Template`, `HeroSlide`, etc.
- `api` – DRF viewsets & endpoints.
- `admin` – Django admin registrations.

Important concepts:

- **JWT endpoints**: `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/`.
- **Public site JSON endpoint**:  
  `GET /api/sites/{slug}/public/` → returns `{ id, name, slug, site_template_key, pages: [...] }`.
- **Admin API namespace** for staff-only operations: `/api/admin/...`

#### 2.1.1 Current Admin API Endpoints (✅ Working)

- `GET /api/admin/sites/` - List all site projects (staff only)
  - Returns: Array of AdminSite objects with id, name, slug, template info, owner details
  - Authentication: Session-based with IsStaffUser permission
  - CORS: Enabled for cross-origin frontend requests
  
- `GET /api/admin/sites/{slug}/public/` - Get public site data (staff only)
  - Returns: Detailed site project information
  - Used by admin dashboard for site inspection
  
- `GET /api/csrf/` - Get CSRF token for session authentication
  - Required for admin login flow
  - Returns: `{"csrfToken": "..."}`

### 2.2 Frontend (Next.js)

Root: `C:\projects\justcodeworks\frontend`

Main structure:

- `src/app/[locale]/...` – locale-based routes (platform UI).
  - `/[locale]/` – JCW marketing / home.
  - `/[locale]/login` – login page.
  - `/[locale]/dashboard` – user dashboard.
  - `/[locale]/dashboard/website` – website builder preview + editor.
  - `/[locale]/admin` – JCW admin dashboard.
  - `/[locale]/admin/sites` – admin sites explorer ✅ **WORKING**.
- `src/app/sites/[slug]/...` – public tenant sites (no locale).
- `src/components/...` – shared components, templates, UI pieces.
- `src/components/templates/...` – per-template renderers (e.g. `restaurant-modern`).
- `src/lib/...` – API helpers, auth utilities, config.

Special rules:

- **Locales** apply to JCW platform only: `/en`, `/pt`, `/nl`, etc.
- **Tenant sites** never have locale prefix:  
  `https://domain.com/sites/marys-restaurant`
- Admin & user dashboards stay under `[locale]`.

---

## 3. Auth & Routing Rules

### 3.1 Auth Basics

- **Primary Auth**: JWT-based for general application use
- **Admin Auth**: Session-based for admin dashboard and staff operations
- `/login`:
  - On success: fetch `/me` to get `is_staff`.
  - If `is_staff === true` → redirect to `/[locale]/admin`.
  - Else → redirect to `/[locale]/dashboard`.
- `/me` must always return at least:
  - `id`, `email`, `is_staff`, `is_active`.

#### 3.1.1 Admin Authentication (Session-Based)

- **Admin API Endpoints**: Use session authentication with CORS support
- **Required Credentials**: Staff user with `is_staff=True` and `is_superuser=True`
- **Test Staff User**: `stafftest / staffpass123` (created for development)
- **Session Cookies**: `sessionid`, `csrftoken` handled automatically
- **CORS Configuration**: Enabled for `localhost:3001` → `localhost:8000` requests
- **Permission Class**: `IsStaffUser` validates staff status with debug logging

### 3.2 Staff vs Normal Users

- **Staff:**
  - Can access `/[locale]/admin` and `/api/admin/...`.
  - Can still access `/[locale]/dashboard` if needed.
- **Normal users:**
  - Can **never** access `/[locale]/admin` or `/api/admin/...`.
  - Should be redirected to `/[locale]/dashboard` or 403.

---

## 4. Locale & URL Rules

### 4.1 Platform (JCW) URLs

- All JCW UI routes must start with `[locale]`, except `/sites/...`:
  - `/en`
  - `/en/login`
  - `/en/dashboard`
  - `/en/dashboard/website`
  - `/en/admin`
  - `/en/admin/sites`

### 4.2 Tenant Site URLs

- Always **without** locale prefix:
  - `/sites/[slug]`
  - Example: `/sites/marys-restaurant`.

### 4.3 Locale-Aware API

- Public site API supports `?locale=`:
  - `GET /api/sites/{slug}/public/?locale=en`
  - `GET /api/sites/{slug}/public/?locale=pt`
- If locale has no content, API may:
  - Return empty `pages` list, or
  - Include a simple “no content” flag.

---

## 5. Content Model & Templates

### 5.1 SiteProject

Core fields (simplified):

- `id`
- `name`
- `slug`
- `owner` (user)
- `template` (internal template)
- `site_template` (user-facing theme; e.g. `restaurant-modern`, `jcw-main`)
- `primary_language`
- `is_active`
- `created_at`

### 5.2 Page

- `id`
- `project` (SiteProject)
- `slug` (`home`, `menu`, `contact`, etc.)
- `path` (usually `/home`, `/menu`)
- `title`
- `order`
- `locale`
- `is_published`

### 5.3 Section

- `id`
- `page`
- `identifier` (key like `hero-banner`, `about-us`, `appetizers`, `main-courses`, `contact-info`)
- `internal_name` (for admin; human-readable)
- `order` (display order within page)

### 5.4 Field

- `id`
- `section`
- `key` (e.g. `"headline"`, `"content"`, `"item_1_price"`)
- `label`
- `value`
- `order`

### 5.5 Template Naming (IMPORTANT)

We planned a **descriptive naming scheme** to allow mixing sections between templates:

- Example section ID pattern:

  ```text
  jcw-restaurant-modern-01-hero-01
  jcw-restaurant-modern-02-about-us-05
  jcw-restaurant-modern-03-menu-02
Where:

jcw – platform prefix

restaurant-modern – template key

01/02/03 – section group number

about-us, menu, etc – semantic type

final number – variant index

This lets us:

Mix sections from different templates.

Sort / group sections predictably.

Reuse a section library across templates.

6. Preview & Live Site Rules
Golden rule:

Single source of truth is Django → public JSON → both live site and preview use the same data.

Live site /sites/[slug]:

Calls GET /api/sites/{slug}/public/ (with optional ?locale=).

Uses template renderer to output all sections.

Website Preview in dashboard:

Uses the same JSON endpoint.

Uses the same renderer logic (or a thin wrapper around it).

The only difference is mode:

mode="public" – real site, normal links.

mode="dashboard" – nav clicks call callbacks instead of navigating.

When editing:

User edits content in dashboard.

Frontend calls DRF endpoints (PATCH/PUT) to update fields/sections/pages.

Dashboard preview:

Either re-fetches the JSON, or

Uses updated state from the response.

Live site shows the same content on refresh.

No hardcoded dummy content in the preview, ever.

7. Admin Dashboard Architecture
7.1 Admin Layout
Route:

app/[locale]/admin/layout.tsx – top-level admin layout:

Auth guard: only staff allowed.

Provides admin chrome:

Sidebar

Top bar

Main content area

main should have normal padding only (e.g. px-6 py-6).

No large extra margins on top that cause huge white gaps.

7.2 Admin Home Page
Route:

app/[locale]/admin/page.tsx

Role:

Entry overview for staff.

Basic cards:

Sites & Templates

Issues & Feedback

Link to Django admin.

Known recurring issue: big white space at top.

Root cause: collapsing margin-top on first container or heading.

Fix: remove large top margin (mt-10, mt-12, etc.) from first wrapper around “Admin Dashboard” heading.

### 7.3 Admin Sites Explorer ✅ **IMPLEMENTED**

**Endpoints** (Working):

- `GET /api/admin/sites/` - List all site projects
- `GET /api/admin/sites/{slug}/public/` - Get detailed site data

**Authentication**: Session-based with `IsStaffUser` permission

**Returns**: Complete site project info including:
- `id, name, slug, site_template_key, site_template_name`
- `owner_username, owner_email, primary_locale`
- `is_active, created_at`

**Frontend** (Current Status):

✅ `/[locale]/admin/sites` – **WORKING** table of all SiteProjects
- Displays sites in sortable table format
- Shows template information and owner details
- Includes JSON viewer for detailed site inspection
- Real-time API integration with error handling

🚧 `/[locale]/admin/sites/[id]` – **PLANNED** detail view for individual SiteProject:
- General info (owner, slug, languages)
- Template configuration
- Pages/Sections explorer per site
- Link to Django admin
- Content editing capabilities

**Current Functionality**:
- ✅ Authentication and authorization working
- ✅ API endpoints returning proper data
- ✅ Frontend displaying sites table
- ✅ JSON inspection and debugging tools
- 🚧 Individual site detail pages (next phase)
- 🚧 Content editing interface (future)

8. User Dashboard Architecture
Main entry:

/[locale]/dashboard – user home.

Website builder:

/[locale]/dashboard/website

Left: SEO panel + content editor (per page).

Right: Website Preview (device selector + live preview).

“View live site” button opens /sites/[slug] in a new tab.

Navigation behavior:

Nav inside preview (Home/Menu/Contact) is clickable.

Clicking nav:

Updates selectedPageSlug.

Changes which page’s sections are rendered in preview.

Keeps dropdown in sync.

9. Known Issues & Pitfalls (Bug Log)
9.1 Layout White Space (Admin)
Symptom:
Big white band above “Admin Dashboard” in /[locale]/admin.

Root cause:
Collapsing margin from the first content wrapper (mt-* class) or h1.

Fix pattern:

Remove mt-* / pt-* from the first wrapper around the admin heading.

Ensure admin layout only uses px-6 py-6 or similar, no massive mt- on root children.

9.2 Legacy Locale-Based /[locale]/sites/[slug] Route
Symptom:

404 or build error caused by old app/[locale]/sites/[slug]/page.tsx.

Conflicts with new /sites/[slug] route.

Fix:

Keep /sites/[slug] as single source for tenant sites.

Replace app/[locale]/sites/[slug]/page.tsx with a minimal stub:

tsx
Copy code
// Deprecated route – do not use. Tenant sites live at /sites/[slug].
export default function LocaleTenantSitePage() {
  return null;
}
Do not delete [locale]/sites folder aggressively (to avoid more breakage).

---

## 8. Leads & Quotes ✅ **IMPLEMENTED**

### 8.1 Overview

The Leads & Quotes system manages quote requests submitted through tenant garage/automotive service websites. It provides a complete workflow from public form submission to admin management.

### 8.2 Data Model

**QuoteRequest Model** (`sites/models.py`):

```python
class QuoteRequest(TimeStampedModel):
    site_project = models.ForeignKey(SiteProject, related_name="quote_requests", on_delete=models.CASCADE)
    
    # Contact Information
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    
    # Vehicle Information
    license_plate = models.CharField(max_length=20, blank=True)
    car_make_model = models.CharField(max_length=200, blank=True)
    
    # Service Request Details
    SERVICE_TYPE_CHOICES = (
        ("troca_oleo", "Troca de óleo"),
        ("revisao", "Revisão geral"), 
        ("travoes", "Travões"),
        ("diagnostico", "Diagnóstico"),
        ("outro", "Outro"),
    )
    service_type = models.CharField(max_length=100, choices=SERVICE_TYPE_CHOICES, blank=True)
    message = models.TextField(blank=True)
    
    # Metadata
    source_page_slug = models.CharField(max_length=100, blank=True)
    locale = models.CharField(max_length=10, default="pt")
    consent_marketing = models.BooleanField(default=False)
```

### 8.3 API Endpoints

#### 8.3.1 Public Endpoints (Tenant Forms)

**Submit Quote Request**:
- **URL**: `POST /api/sites/{site_slug}/quote-requests/`
- **Purpose**: Used by tenant websites to submit quote requests
- **Authentication**: None (public)
- **Payload**: Customer name, contact info, vehicle details, service type, message

#### 8.3.2 Admin Endpoints (Staff Only)

**List Quote Requests**:
- **URL**: `GET /api/admin/quote-requests/`
- **Purpose**: List all quote requests from all tenants
- **Authentication**: JWT (staff required)
- **Filters**: 
  - `?site_slug=garage-slug` - Filter by specific site
  - `?locale=pt` - Filter by form locale
- **Response**: Array of AdminQuoteRequest objects with site info

**Quote Request Detail**:
- **URL**: `GET /api/admin/quote-requests/{id}/`
- **Purpose**: Get detailed view of a single quote request
- **Authentication**: JWT (staff required)

### 8.4 Admin Interface

#### 8.4.1 Navigation

**Admin Sidebar**: "Leads & Quotes" link (`/[locale]/admin/leads`) between "Sites" and "Templates"

#### 8.4.2 Leads List Page

**Location**: `frontend/src/app/[locale]/admin/leads/page.tsx`

**Features**:
- Table view with columns: Date/Time, Site, Name, Service Type, Contact, Locale, Source Page
- Filter dropdown for site selection (All Sites + individual sites)
- Filter dropdown for locale (All Languages, PT, EN)
- Click row to open detail modal
- Results count display
- Responsive design

#### 8.4.3 Detail Modal

**Features**:
- Complete quote information display
- Site project name and slug
- Customer contact details (email, phone)
- Vehicle information (license plate, make/model)
- Service type (human-readable display)
- Full message text
- Metadata (source page, locale, marketing consent)
- Formatted timestamps
- Close button

### 8.5 Usage Flow

1. **Customer Submission**: Customer fills out quote form on garage website (e.g., Oficina Paulo Calibra)
2. **API Processing**: Form submits to `POST /api/sites/{slug}/quote-requests/` endpoint
3. **Database Storage**: QuoteRequest record created with site association
4. **Admin Notification**: Quote appears in JCW Admin "Leads & Quotes" page
5. **Admin Review**: Staff can view, filter, and analyze quote requests
6. **Future**: Reply workflow, status tracking, export functionality (planned)

### 8.6 Testing & Verification

**Backend API Test**: `backend/test_admin_quote_requests_api.py`
- Verifies admin endpoints work correctly
- Tests filtering functionality
- Confirms authentication requirements

**Public Form Test**: `backend/test_public_quote_form.py`
- Verifies public form submission works
- Tests data validation
- Confirms database persistence

### 8.7 Django Admin Integration

**QuoteRequestAdmin** (`sites/admin.py`):
- List display: site_project, name, service_type, email, phone, car_make_model, created_at, locale
- Filters: site_project, service_type, locale, consent_marketing, created_at
- Search fields: name, email, phone, license_plate, car_make_model, message
- Fieldsets organized by: Customer Information, Vehicle Information, Service Request, Metadata

### 8.8 Future Enhancements

- **Status Tracking**: New/In Progress/Closed workflow
- **Reply System**: Email responses directly from admin interface
- **Export Functionality**: CSV/Excel export of filtered results
- **Analytics Dashboard**: Quote volume trends, conversion rates
- **Automated Notifications**: Email alerts for new quotes
- **Integration**: Connect with CRM/booking systems

---

## 9. Step 0 Builder - Multi-Intent Onboarding System

### 9.1 Overview

**Purpose**: Complete site creation flow that transforms Step 0 onboarding data into functional websites with appropriate templates and real content.

**Architecture**: 
- **Backend**: Django Builder API endpoint with JWT authentication
- **Frontend**: Modal system combining authentication + onboarding
- **Integration**: Creates actual SiteProject with content, redirects to editor

**Key Features**:
- Smart template selection based on industry and entry product
- Real content generation from onboarding data (not placeholders)
- Combined auth + onboarding flow for new users
- Immediate redirect to website editor after creation

### 9.2 Backend Implementation

#### 9.2.1 Builder API Endpoint

**URL**: `POST /api/builder/step0/`
**Authentication**: JWT Token required
**Purpose**: Create complete website from Step 0 onboarding data

**Request Format**:
```json
{
  "website_name": "Mary's Italian Restaurant",
  "website_topic": "authentic Italian dining experience", 
  "entry_product": "website",
  "primary_audience": "food lovers and families",
  "tagline": "Authentic Italian flavors in the heart of the city",
  "industry": "restaurant", 
  "description": "Family-owned restaurant serving traditional Italian cuisine"
}
```

**Response Format** (Success - 201):
```json
{
  "success": true,
  "message": "Website \"Mary's Italian Restaurant\" created successfully!",
  "project": {
    "id": "60d49ea1-19e5-4237-8bc6-b82c76447515",
    "name": "Mary's Italian Restaurant",
    "template_key": "restaurant-modern",
    "template_name": "Restaurant Modern", 
    "business_name": "Mary's Italian Restaurant",
    "entry_product": "website",
    "created_at": "2025-11-16T20:11:01.416233+00:00"
  },
  "redirect_to": "/websites/60d49ea1-19e5-4237-8bc6-b82c76447515/edit",
  "status": "created"
}
```

**Error Response** (400):
```json
{
  "error": "Missing required fields: website_topic, primary_audience",
  "status": "validation_error"
}
```

#### 9.2.2 Template Selection Logic

**Smart Template Mapping**:
- **Restaurant/Food Industry** → `restaurant-modern`
- **Auto/Garage Industry** → `auto-garage-modern` 
- **E-commerce Keywords** → `ecommerce-basic`
- **Landing Page Keywords** → `landing-conversion`
- **POS Entry Product** → `auto-garage-modern` (business-focused)
- **Printing Entry Product** → `tire-center-premium` (service-based)
- **Default Fallback** → `one-page-basic`

**Implementation**: `BuilderStep0View._select_template()` method analyzes:
1. `entry_product` (website/printing/pos)
2. `industry` field keywords
3. `website_topic` content patterns

#### 9.2.3 Content Generation System

**Real Content Creation**:
- Creates `SiteProject` with proper slug generation
- Generates homepage with `hero-section`
- Adds title field: Uses `tagline` or generates "Welcome to {website_name}"
- Adds subtitle field: Uses `description` if provided
- Stores additional data in `onboarding_notes` field

**Database Structure**:
- **SiteProject**: Main project record with `business_name`, `entry_product`
- **Page**: Homepage with `slug='home'`, `title=website_name`
- **Section**: Hero section with `identifier='hero-section'`
- **Field**: Title and subtitle fields with `key='title'/'subtitle'`

#### 9.2.4 Implementation Details

**Location**: `backend/sites/views.py` - `BuilderStep0View` class
**URL Configuration**: `backend/sites/api_urls.py`
**Authentication**: Uses `JWTAuthentication` and `permissions.IsAuthenticated`
**Error Handling**: Comprehensive validation and rollback on failure

### 9.3 Frontend Implementation

#### 9.3.1 Modal Component

**File**: `frontend/src/components/Step0OnboardingModal.tsx`
**Type**: Combined authentication + onboarding modal
**Integration**: Used in `HeroSection.tsx` and `WebsitesPageClient.tsx`

**Props Interface**:
```typescript
interface Step0OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  intent: 'website' | 'prints' | 'pos'
  locale: string
  onSuccess?: () => void
}
```

#### 9.3.2 Form Structure

**Authentication Section** (new users only):
- First Name, Last Name (required)
- Email Address (required)  
- Password with visibility toggle (required)

**Step 0 Information Section**:
- Website Name* (maps to `website_name`)
- Website Topic* (maps to `website_topic`) 
- Primary Audience* (maps to `primary_audience`)
- Industry (maps to `industry`)
- Tagline (maps to `tagline`)
- Description (maps to `description`)

**Entry Product**: Auto-set based on `intent` prop (`prints` → `printing`)

#### 9.3.3 Authentication Flow

**New User Flow**:
1. User fills auth fields + Step 0 data
2. Submit triggers registration: `POST /api/auth/register/`
3. If successful, get JWT token: `POST /api/jwt/login/`
4. Use JWT for builder call: `POST /api/builder/step0/`
5. Redirect to editor on success

**Existing User Flow**:
1. User fills Step 0 data only (auth section hidden)
2. Direct builder call with existing `accessToken`
3. Redirect to editor on success

#### 9.3.4 Success Handling

**Success State**: Shows checkmark animation with "Website Created Successfully!"
**Redirect**: Automatic redirect to `result.redirect_to` after 2 second delay
**Error Handling**: Displays validation errors and network errors inline

### 9.4 Integration Points

#### 9.4.1 CTA Button Integration

**HeroSection Component**:
- "Get Started" buttons trigger modal with appropriate `intent`
- Buttons for different entry products: Website, Prints, POS

**WebsitesPage Component**:
- "Create New Website" button triggers modal with `intent='website'`

#### 9.4.2 Authentication Context

**Auth Integration**: Uses `useAuth()` hook to:
- Check if user is logged in (`user` state)
- Access current JWT token (`accessToken` state)
- Conditionally show/hide auth form section

### 9.5 Testing & Verification

#### 9.5.1 Backend Tests

**File**: `backend/test_step0_builder.py`
**Coverage**:
- ✅ User registration + JWT authentication
- ✅ Builder endpoint with Step 0 data
- ✅ Template selection logic (restaurant → restaurant-modern)
- ✅ Content creation and database verification
- ✅ Validation error handling
- ✅ Response structure validation

**Test Results**:
```
🧪 Testing Step 0 Builder Endpoint
==================================================
✅ User registered: test_builder_12f59a9a@example.com
✅ JWT token received (length: 232)  
✅ Builder succeeded!
✅ Project exists in database
   Created site: Mary's Italian Restaurant
   Project ID: 60d49ea1-19e5-4237-8bc6-b82c76447515
   Template: Restaurant Modern (restaurant-modern)
🎉 All tests passed! Step 0 Builder is working correctly.
```

#### 9.5.2 Frontend Tests

**Manual Testing**: Modal functionality, form validation, success flow
**Integration Testing**: End-to-end user journey from CTA to editor
**Error Scenarios**: Network errors, validation failures, authentication issues

### 9.6 Template Availability

**Available Templates** (from database):
- ✅ `restaurant-modern` - Restaurant Modern  
- ✅ `auto-garage-modern` - Oficina Auto – Moderno
- ✅ `ecommerce-basic` - E-commerce Basic
- ✅ `landing-conversion` - High-Conversion Landing
- ✅ `one-page-basic` - One Page Basic
- ✅ `tire-center-premium` - Tire Center Premium
- ❌ `jcw-main` - Available but not user-selectable

### 9.7 Future Enhancements

**Template Expansion**:
- Add more industry-specific templates (professional services, portfolio, etc.)
- Template preview system in modal
- User template selection override

**Content Intelligence**:
- AI-powered content generation from Step 0 data
- Industry-specific section recommendations
- Automatic image suggestions

**Analytics & Optimization**:
- Track template selection effectiveness
- A/B test onboarding form variations  
- Conversion funnel analysis

**Advanced Features**:
- Multi-step wizard for complex projects
- Template customization during onboarding
- Bulk site creation for agencies

---

## 9.5 Current Development Setup (Windows) ✅

### 9.5.1 Quick Start Commands

**Start Backend (Django)**:
```cmd
cd C:\projects\justcodeworks\backend
python manage.py runserver localhost:8000
```

**Start Frontend (Next.js)**:
```cmd
cd C:\projects\justcodeworks\frontend
npm run dev -- -p 3001
```

### 9.5.2 Development URLs

- **Django Backend**: `http://localhost:8000`
- **Next.js Frontend**: `http://localhost:3001`
- **Admin Dashboard**: `http://localhost:3001/en/admin`
- **Admin Sites**: `http://localhost:3001/en/admin/sites` ✅ **WORKING**
- **Django Admin**: `http://localhost:8000/admin/`

### 9.5.3 Test Credentials

**Staff User** (for admin access):
- Username: `stafftest`
- Password: `staffpass123`
- Permissions: `is_staff=True`, `is_superuser=True`

### 9.5.4 Development Database Status

- **Site Projects**: 4 projects available (including "Joe's Garage", "Mary's Restaurant")
- **Templates**: Multiple site templates configured
- **Users**: Staff and regular users set up for testing
- **API Endpoints**: All admin endpoints functional and secured

### 9.5.5 Port Management

**If ports are occupied**:
```cmd
# Check what's using the ports
netstat -ano | findstr ":3001\|:8000"

# Kill processes if needed (PowerShell)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Alternative ports**:
- Frontend: Can use 3000, 3001, 3002, etc.
- Backend: Stick to 8000 for CORS configuration

---

## 10. Rules for AI Assistants (ChatGPT / Claude)
This section is critical for future work and especially for any rebuild.

10.1 General Rules
Never use PowerShell or && in commands.

Environment: Windows 11, CMD only.

Commands should look like:

cd C:\projects\justcodeworks\backend

python manage.py runserver 8000

cd C:\projects\justcodeworks\frontend

npm run dev -- -p 3000

Never delete folders or run destructive commands unless explicitly ordered by Captain:

No rmdir /S /Q

No git clean -fdx

No rm -rf

No mass deletes inside src/app, backend, or templates.

Always search before editing.

Use search to locate:

Text constants ("Admin Dashboard", "Mary's Restaurant").

Components (RestaurantModernPage, SitePageClient).

Routes (/sites/[slug], /[locale]/admin).

Never blindly assume file paths.

Do not change middleware or global locale logic unless explicitly requested.

Use minimal, targeted edits.

Prefer small changes in the right file over big refactors.

10.2 When Fixing Layout Bugs
If there is unexplained white space:

Check:

Layout (layout.tsx),

Page component (page.tsx),

The specific child component that renders the heading.

Look for mt-*, pt-*, space-y-*, and accidental empty wrappers.

Never “fix” layout by:

Adding random pt-* to main.

Adding negative margins.

Injecting extra spacers.

The valid fix is usually:

Remove large top margin/padding from the first child inside layout.

10.3 When Editing Routes & Templates
Tenant route rule:

Always use /sites/[slug] (no locale).

Do not recreate /[locale]/sites/[slug] as a real route.

Admin routes:

Always under /[locale]/admin/....

Must be protected by server-side auth check for is_staff.

Templates:

Do not hardcode content into React components that is meant to come from Django.

Use project.pages → sections → fields.

Preview:

Reuse the same JSON + render logic as public site.

Only difference: mode="dashboard" vs mode="public".

11. Rebuild Playbook (Future JCW v2)
This section is for future rebuild from scratch when JCW is ready for a production-grade version.

Phase 1 – Extract the Truth
Freeze this version as Prototype v1.

Use Documentation.md as the reference.

List the final decisions:

Models that stay.

Models to rename/merge/simplify.

Templates we actually use.

Features that are mandatory vs nice-to-have.

Phase 2 – Clean Architecture Design
Define:

Final models (SiteProject, Page, Section, Field, Template, SiteTemplate, HeroSlide, Plan, etc.).

Final API surface (public + admin APIs).

Final routing tree for Next.js (platform vs tenant).

Final template naming and storage strategy.

Final SEO & translation strategy.

Document these in a v2 spec section inside this file.

Phase 3 – Fresh Rebuild (Backend)
Start new backend app or refactor in-place carefully.

Implement:

Clean models.

Clean migrations.

Clean DRF viewsets.

Fully documented endpoints.

Reuse only what’s proven from v1.

Phase 4 – Fresh Rebuild (Frontend)
Create a new Next.js App Router structure:

/[locale]/... for JCW.

/sites/[slug] for tenants.

Rebuild:

Admin dashboard with known requirements from v1.

User dashboard with the final builder UX.

Template renderers with the finalized content model.

Phase 5 – Data Migration
Write migration scripts:

v1 DB → v2 DB.

Confirm:

Each existing SiteProject is usable in v2.

No data loss for pages/sections/fields.

Use staging environment first.

Phase 6 – Launch
Point domain to v2.

Keep v1 around (read-only) for safety.

Monitor:

Errors

Performance

Edge cases

12. Version History (this file)
v0.1 – Initial handbook created

Defined architecture overview.

Described content model and route rules.

Logged known admin layout & route issues.

Added AI assistant rules & rebuild playbook.

v0.2 – Admin Sites 403 Error Resolution & System Updates

Fixed 403 Forbidden error on /en/admin/sites endpoint.

Implemented proper session-based authentication for admin API.

Updated CORS configuration for frontend-backend communication.

Created staff user authentication system.

Integrated legacy documentation into master file.

Verified both Django backend (localhost:8000) and Next.js frontend (localhost:3001) working.

v0.3 – Template Lab Step 2 Complete Implementation

**STEP 2 COMPLETION**: Built comprehensive section libraries for restaurant and garage templates.

**Restaurant Sections (5)**: Hero, About, Menu Highlights, Testimonials, Contact with reservation CTAs.

**Auto Garage Sections (5)**: Hero, Diagnostics, Services, Testimonials, Quote Form with vehicle capture.

**Registry Enhancement**: Added 42 total section identifiers with {template-key}-{area}-{variant} naming convention.

**Component Standards**: All sections use TEMPLAB tagging, field extraction helpers, and Tailwind styling.

**Testing Verified**: Mary's Restaurant and Oficina Paulo Calibra sites rendering properly through TemplateRenderer.

**Backward Compatibility**: Legacy identifiers maintained while new naming convention implemented.

**Foundation Complete**: Template system ready for unlimited business type expansion (portfolio, ecommerce, blog).

📘 Documentation Entry — Admin Sites 403 Error Resolution

Date: 2025-11-15
Category: Authentication / API Security
Status: ✅ RESOLVED
Author: Claude (AI Assistant)

🧩 Issue Summary

The admin sites page at `/en/admin/sites` was showing "Error: Failed to fetch sites: 403" when trying to access the admin sites API endpoint.
This prevented staff users from viewing and managing site projects through the admin dashboard.

🛠️ Root Cause Analysis

1. **Backend API Security**: The `/api/admin/sites/` endpoint was properly secured with `IsStaffUser` permission
2. **Frontend Authentication**: Browser fetch calls were not including proper session credentials
3. **CORS Configuration**: Cross-origin requests between localhost:3001 (frontend) and localhost:8000 (backend) needed proper setup
4. **Staff User Missing**: No staff user existed for testing authentication

🧼 Implementation Details

**Backend Changes (`backend/sites/views.py`)**:
- Implemented `IsStaffUser` permission class with debug logging
- Added `AdminSitesListView` and `AdminSitePublicView` with session authentication
- Configured proper CORS headers for cross-origin requests

**Frontend Changes (`frontend/src/app/[locale]/admin/sites/page.tsx`)**:
- Updated fetch calls to include `credentials: 'include'`
- Added proper CORS headers in API requests
- Implemented error handling and loading states

**Authentication Setup**:
- Created staff user: `stafftest / staffpass123`
- Verified session-based authentication working
- Confirmed API returns 200 with site data for authenticated staff users

**Testing Infrastructure**:
- Created comprehensive test files:
  - `test_final_verification.py` - Backend authentication testing
  - `test-admin-sites-fix.html` - Browser-based API testing
  - `test_complete_flow.py` - End-to-end authentication flow

🎯 Current System Status

✅ **Django Backend**: Running on `http://localhost:8000`
✅ **Next.js Frontend**: Running on `http://localhost:3001`
✅ **Admin Sites API**: `/api/admin/sites/` properly secured and functional
✅ **Session Authentication**: Working correctly with CORS support
✅ **Staff Access**: Admin sites page accessible at `http://localhost:3001/en/admin/sites`
✅ **Database**: Contains 4 site projects ready for display

🔧 Technical Architecture Confirmed

- **Authentication Method**: Session-based (sessionid, csrftoken cookies)
- **API Security**: IsStaffUser permission class for admin endpoints
- **CORS Setup**: Proper cross-origin configuration for localhost development
- **Frontend Integration**: Next.js 14 App Router with TypeScript
- **Backend API**: Django 5 + DRF with proper viewsets and serializers

📘 Documentation Entry — Admin Layout Reset & White Space Fix

Date: 2025-11-15
Category: Layout / Admin Dashboard
Status: Fixed & Verified
Author: Captain, Soldier & Claude

🧩 Issue Summary

On the Next.js admin dashboard (/en/admin), a large white empty space appeared above the header “JustCodeWorks Administration”.
The gap was not caused by the dashboard content, but by a hidden spacer or padding inside the admin layout itself — specifically above the header.

Multiple attempts to remove the space by editing the content wrapper failed.
Adding negative margins only pushed the content into the header, confirming the root cause was higher in the layout.

🛠️ Root Cause

The admin layout (originally imported from a template) contained unintended wrappers and invisible padding/margins above the top bar, causing a persistent vertical gap.

Because this padding lived outside the dashboard content, attempts to shift the content failed.

🧼 Final Fix (Canonical Solution)

We performed a full reset of the admin layout, replacing it with a clean, predictable structure:

✔️ Sidebar on the left
✔️ Top bar at the very top (bell + logout)
✔️ Main content immediately under the top bar
✔️ No hidden spacers
✔️ No mystery wrappers
✔️ No negative margins
📂 File updated:

frontend/src/app/[locale]/admin/layout.tsx

🧩 Key structural change:
<div className="min-h-screen bg-gray-50 flex">
  <AdminSidebar />

  <div className="flex-1 flex flex-col">
    <AdminTopBar />

    <main className="flex-1 px-6 py-6">
      {children}
    </main>
  </div>
</div>

🔍 What we removed:

Random wrapper <div class="h-20">

Unexpected pt-20, mt-24, space-y-32 on parent containers

Legacy padding from imported theme

🚫 What we did not touch:

Locale routing

Authentication logic

Sidebar behavior

Admin components content

User dashboard

📌 Notes for Future Rebuilds (v2 / full clean install)

NEVER reuse the previous admin layout without inspection.
The old template contained hidden browser-default and template padding.

Prefer explicit spacing in the layout:

Header height controls vertical layout

Main content gets padding (px-6 py-6)

No invisible wrappers allowed

When cloning, test /admin early before adding features.

If a white gap ever appears again:

The problem WILL be in the layout, not in page.tsx

Check wrappers above the top bar

Stop adding negative margins — fix the layout

🎯 Result

Admin dashboard now loads with no ghost spacing

Clean structure easier for future maintenance

Future rebuilds will avoid multi-day layout debugging

✔️ Approved and Locked

This is now the canonical admin layout specification for JCW.

---

## 13. Legacy Documentation Archive Reference

The following .md files contain historical implementation details and are preserved for reference:

### 13.1 Authentication & Security
- `AUTH_HARDENING_SUMMARY.md` - Builder route authentication and edit mode restrictions
- `AUTH_HARDENING_VERIFICATION.md` - Security verification tests
- `AUTH_AUDIT_REPORT.md` - Authentication audit findings

### 13.2 Template System
- `TEMPLATE_LAB_V1_SUMMARY.md` - Template Lab v1 implementation
- `DASHBOARD_TEMPLATE_BACKEND_SUMMARY.md` - Dashboard template backend integration
- `DASHBOARD_TEMPLATE_FRONTEND_SUMMARY.md` - Frontend template implementation

### 13.3 Integration Guides  
- `BACKEND_INTEGRATION.md` - Phase 3 backend-frontend integration
- `EDITING_SYSTEM_COMPLETE.md` - Content editing system implementation
- `NAVIGATION_COMPONENT_READY.md` - Navigation system completion
- `HELP_UTILITIES_CONTACT_COMPLETE.md` - Help and utility components

### 13.4 Technical Reports
- `JCW_CODEBASE_AUDIT_REPORT.md` - Comprehensive codebase audit
- `LOCALE_FALLBACK_IMPLEMENTATION.md` - Internationalization system
- `NAVIGATION_ISSUES.md` - Navigation system debugging

### 13.5 Setup Guides
- `backend/SETUP.md` - Django backend setup instructions  
- `backend/API_TESTING.md` - API testing procedures
- `frontend/README.md` - Next.js frontend documentation
- `frontend/QUICKSTART.md` - Quick development setup

**Note**: These legacy files provide detailed implementation history but may contain outdated information. Always refer to this master Documentation.md for current system status.

---

## 14. Template Lab Architecture ✅ **NEW**

**Implemented**: November 15, 2025  
**Status**: Template Lab Step 1 Complete

### 14.1 Template System Overview

JCW now uses a **modern, reusable template architecture** that dynamically renders sections based on JSON data from the Django backend. This replaces the old hardcoded template system with a flexible, component-based approach.

#### 14.1.1 Architecture Flow

```
Django Backend → API JSON → TemplateRenderer → Section Components → Rendered Site
```

1. **Django** sends sections data via `/api/sites/{slug}/public/`
2. **TemplateRenderer** receives sections array and sorts by order
3. **Registry** maps section identifiers to React components
4. **Components** render with section fields as props
5. **Fallback** shows placeholder for missing components

#### 14.1.2 Folder Structure

```
frontend/src/templates/
├── core/
│   ├── TemplateRenderer.tsx    # Main renderer component
│   └── registry.ts             # Section component registry
├── restaurant/
│   └── components/
│       ├── RestaurantHero.tsx   # Restaurant hero section
│       └── RestaurantAbout.tsx  # Restaurant about section
├── garage/                     # Future garage template components
├── portfolio/                  # Future portfolio template components
├── common/                     # Shared/reusable components
└── index.ts                    # Central exports
```

### 14.2 Registry System

**File**: `frontend/src/templates/core/registry.ts`

The registry maps **section identifiers** from the backend to **React components**:

```typescript
export const sectionRegistry: Record<string, SectionComponent> = {
  // New naming convention
  'restaurant-hero': RestaurantHero,
  'restaurant-about': RestaurantAbout,
  
  // Legacy backwards compatibility
  'hero-banner': RestaurantHero,
  'about-section': RestaurantAbout,
};
```

#### 14.2.1 Adding New Templates

1. Create component in appropriate template folder
2. Add to registry with identifier mapping
3. Component automatically renders when API returns matching identifier

### 14.3 Section Components

#### 14.3.1 Component Interface

All section components receive standardized props:

```typescript
interface SectionProps {
  section: {
    id: string | number;
    identifier: string;
    internal_name: string;
    order: number;
    fields: Array<{
      key: string;
      label: string;
      value: string;
      order: number;
    }>;
  };
  mode?: 'public' | 'dashboard';
}
```

#### 14.3.2 Field Access Pattern

Components use helper function to extract field values:

```typescript
function getFieldValue(fields: Field[], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

// Usage in component
const title = getFieldValue(fields, 'title') || 'Default Title';
```

### 14.4 Integration Points

#### 14.4.1 Site Rendering

**File**: `frontend/src/app/sites/[slug]/SitePageClient.tsx`

The system automatically detects if a site has sections data:

- **New System**: Sites with sections → uses `TemplateRenderer`
- **Legacy System**: Sites without sections → uses old template components
- **Fallback**: Unknown templates → shows JSON debug view

#### 14.4.2 Development Features

- **Placeholders**: Missing components show helpful error messages
- **Debug Info**: Development mode shows section details and registry status
- **Hot Reload**: Components update instantly during development

### 14.5 Section Naming Convention

**Pattern**: `template-section-variant`

Examples:
- `restaurant-hero-01` → RestaurantHero component
- `garage-services-basic` → GarageServices component  
- `portfolio-gallery-grid` → PortfolioGallery component

### 14.6 Current Implementation Status

- ✅ **Core System**: TemplateRenderer and registry complete
- ✅ **Restaurant Components**: RestaurantHero, RestaurantAbout implemented
- ✅ **Legacy Compatibility**: Backwards compatibility with existing identifiers
- ✅ **Integration**: Connected to main site rendering system
- ✅ **Development Tools**: Debug info and placeholders working
- 🚧 **Future Templates**: Garage, Portfolio, Common components planned

### 14.7 Benefits

- **Scalable**: Easy to add new templates and sections
- **Maintainable**: Single source of truth for section mapping
- **Flexible**: Same component can handle multiple identifiers
- **Developer-Friendly**: Clear error messages and debug information
- **Backwards Compatible**: Existing sites continue working

---

## 15. Current System Health Check ✅

**Last Updated**: November 15, 2025

### 14.1 Operational Status
- ✅ **Django Backend**: Fully operational on localhost:8000
- ✅ **Next.js Frontend**: Fully operational on localhost:3001  
- ✅ **Admin Dashboard**: Complete and accessible
- ✅ **Admin Sites API**: Working with proper authentication
- ✅ **Database**: Populated with test data (4 site projects)
- ✅ **Authentication**: Both JWT and session-based auth working
- ✅ **CORS Configuration**: Cross-origin requests properly configured

### 14.2 Key Accomplishments (v0.2)
- 🎯 **Major Issue Resolved**: 403 error on admin sites page completely fixed
- 🔐 **Authentication Hardening**: Secure admin API with staff-only access
- 📊 **Admin Sites Explorer**: Fully functional sites management interface
- 🌐 **CORS Integration**: Seamless frontend-backend communication
- 🧪 **Testing Framework**: Comprehensive test suite for authentication flow

### 14.3 Ready for Development
The Just Code Works platform is now in a stable state for continued development with:
- Proper authentication and authorization systems
- Working admin dashboard with sites management
- Secure API endpoints with appropriate permissions
- Clean development environment setup
- Comprehensive documentation and troubleshooting guides

---

## 15. Template Lab Architecture ✅ **NEW**

**Date Implemented**: November 15, 2025

Template Lab is a modern, reusable section-based template architecture that allows any tenant website to be built from modular components, regardless of business type (restaurant, garage, portfolio, etc.).

### 15.1 Architecture Overview

**Core Concept**: 
- Backend sends sections with `identifier` field
- Frontend dynamically renders sections using registry lookup
- No hardcoded templates - fully data-driven rendering

**Flow**:
1. Django API returns sections array with identifiers
2. `TemplateRenderer` sorts sections by order
3. Registry maps identifier → React component
4. Components render with section fields as props
5. Missing components show placeholder with identifier name

### 15.2 File Structure

```
frontend/src/templates/
├── core/
│   ├── TemplateRenderer.tsx     # Main renderer component
│   └── registry.ts              # Identifier → component mapping
├── restaurant/
│   └── components/
│       ├── RestaurantHero.tsx   # Hero section for restaurants
│       └── RestaurantAbout.tsx  # About section for restaurants
├── garage/                      # Future: auto garage sections
├── portfolio/                   # Future: portfolio sections
└── common/                      # Future: shared sections (footer, contact)
```

### 15.3 Section Component Standards

**Props Interface**:
```typescript
interface SectionProps {
  section: {
    id: string | number;
    identifier: string;           // e.g., "restaurant-hero"
    internal_name: string;        // Human-readable name
    order: number;               // Display order
    fields: Array<{
      key: string;               // e.g., "title", "content", "image"
      label: string;
      value: string;
      order: number;
    }>;
  };
  mode?: 'public' | 'dashboard';  // Rendering context
}
```

**Component Requirements**:
- ✅ Accept all content from `section.fields` props
- ✅ NO hardcoded text (all from backend)
- ✅ Tailwind CSS for styling
- ✅ Multi-language support (content from API)
- ✅ Responsive design
- ✅ Graceful fallbacks for missing images/content

### 15.4 Registry System

**Location**: `frontend/src/templates/core/registry.ts`

**Current Mappings**:
```typescript
export const sectionRegistry = {
  'restaurant-hero': RestaurantHero,
  'restaurant-hero-01': RestaurantHero,
  'restaurant-about': RestaurantAbout,
  'restaurant-about-01': RestaurantAbout,
  // Future sections added here
};
```

### 15.5 Integration with Sites System

**Integration Point**: `frontend/src/app/sites/[slug]/SitePageClient.tsx`

**Logic**:
1. Check if site has valid sections data
2. If yes: Use new `TemplateRenderer` system
3. If no: Fallback to legacy template system

**Benefits**:
- ✅ Backward compatibility maintained
- ✅ Gradual migration possible
- ✅ No breaking changes to existing sites

### 15.6 Section Naming Convention

**Format**: `{template}-{section}-{variant}`

**Examples**:
- `restaurant-hero-01` → RestaurantHero component
- `garage-services-basic` → GarageServices component  
- `portfolio-gallery-grid` → PortfolioGallery component
- `common-contact-form` → CommonContact component

### 15.7 Development Workflow

**Adding New Section Type**:
1. Create component in appropriate template folder
2. Add to registry in `core/registry.ts`
3. Backend creates sections with matching identifier
4. Component automatically renders

**Testing**:
- Development mode shows component identifier overlay
- Missing components show clear placeholder with identifier
- Debug panel shows all sections and their status

### 15.8 Future Expansion

**Planned Template Categories**:
- `garage/` - Auto repair, services, inventory
- `portfolio/` - Creative professionals, agencies
- `common/` - Universal sections (contact, footer, testimonials)

**Advanced Features** (Future):
- Section-level SEO metadata
- A/B testing for section variants
- Visual section editor integration
- Section performance analytics

### 15.9 Technical Benefits

- 🚀 **Performance**: Only loads needed components
- 🧩 **Modularity**: Mix sections across templates
- 📱 **Responsive**: Built-in mobile optimization
- 🌐 **i18n Ready**: All content from backend
- 🛠 **Developer Friendly**: Clear error messages and debug info
- 📈 **Scalable**: Easy to add new business types

---

## 16. Template Lab Step 2 Implementation ✅ **COMPLETE**

**Date Implemented**: November 15, 2025  
**Status**: Template Lab Step 2 Complete - Full Section Libraries Ready

### 16.1 Step 2 Achievements

Template Lab Step 2 created comprehensive section libraries for both restaurant and garage templates, implementing the complete {template-key}-{area}-{variant} naming convention.

**✅ Completed Deliverables**:
1. **Restaurant Template Sections (5)**: Hero, About, Menu, Testimonials, Contact
2. **Auto Garage Template Sections (5)**: Hero, Diagnostics, Services, Testimonials, Quote Form  
3. **Registry Integration**: All 10 sections mapped with proper identifiers
4. **Naming Convention**: Implemented {template-key}-{area}-{variant} standard
5. **Testing Verification**: Both Mary's Restaurant and Oficina Paulo Calibra sites rendering

### 16.2 New Section Naming Convention

**Standard Format**: `{template-key}-{area}-{variant}`

**Examples**:
- `restaurant-modern-hero-01` → RestaurantHero component
- `auto-garage-modern-services-01` → AutoGarageServicesSection component
- `restaurant-modern-testimonials-01` → RestaurantTestimonialsSection component

**Backward Compatibility**: Legacy identifiers maintained for existing sites
- `hero-banner` → RestaurantHero (legacy)
- `jcw-auto-garage-modern-01-hero-01` → AutoGarageHeroSection (legacy)

### 16.3 Restaurant Template Sections

**Template Key**: `restaurant-modern`

| Section | Component | Identifiers | Purpose |
|---------|-----------|-------------|---------|
| Hero | RestaurantHero | `restaurant-modern-hero-01`, `restaurant-hero` | Main landing section with CTA |
| About | RestaurantAbout | `restaurant-modern-about-01`, `restaurant-about` | Restaurant story and values |
| Menu | RestaurantMenuHighlightSection | `restaurant-modern-menu-01`, `restaurant-menu` | Featured dishes with pricing |
| Testimonials | RestaurantTestimonialsSection | `restaurant-modern-testimonials-01` | Customer reviews and ratings |
| Contact | RestaurantContactSection | `restaurant-modern-contact-01`, `restaurant-contact` | Location, hours, contact form |

### 16.4 Auto Garage Template Sections

**Template Key**: `auto-garage-modern`

| Section | Component | Identifiers | Purpose |
|---------|-----------|-------------|---------|
| Hero | AutoGarageHeroSection | `auto-garage-modern-hero-01`, `garage-hero` | Service overview with emergency info |
| Diagnostics | AutoGarageDiagnosticsSection | `auto-garage-modern-diagnostics-01` | Diagnostic equipment and process |
| Services | AutoGarageServicesSection | `auto-garage-modern-services-01`, `garage-services` | Service catalog with pricing |
| Testimonials | AutoGarageTestimonialsSection | `auto-garage-modern-testimonials-01` | Customer reviews with service types |
| Quote Form | AutoGarageQuoteFormSection | `auto-garage-modern-quote-01`, `garage-quote` | Vehicle info and service request |

### 16.5 Enhanced Component Features

**Common Features Across All Sections**:
- ✅ **TEMPLAB Tags**: All components tagged for easy identification
- ✅ **Field Extraction**: Robust helper functions for backend data  
- ✅ **Tailwind Styling**: Modern, responsive design system
- ✅ **Fallback Handling**: Graceful degradation for missing content
- ✅ **Development Mode**: Visual identifiers and debug information
- ✅ **Multi-Language Ready**: All text from backend API fields

**Restaurant-Specific Features**:
- Menu grid with dish names, descriptions, and pricing
- Star ratings for testimonials
- Location and hours display with map placeholder
- Reservation CTA buttons

**Garage-Specific Features**:
- Service icons with automotive focus
- Emergency service badges and 24/7 availability
- Vehicle information capture forms
- Diagnostic process workflows
- ASE certification and warranty displays

### 16.6 Updated Registry Architecture

**Location**: `frontend/src/templates/core/registry.ts`

**Complete Mappings** (42 total identifiers):
```typescript
export const sectionRegistry = {
  // RESTAURANT SECTIONS (restaurant-modern)
  'restaurant-modern-hero-01': RestaurantHero,
  'restaurant-modern-about-01': RestaurantAbout,
  'restaurant-modern-menu-01': RestaurantMenuHighlightSection,
  'restaurant-modern-testimonials-01': RestaurantTestimonialsSection,
  'restaurant-modern-contact-01': RestaurantContactSection,
  
  // AUTO GARAGE SECTIONS (auto-garage-modern)  
  'auto-garage-modern-hero-01': AutoGarageHeroSection,
  'auto-garage-modern-diagnostics-01': AutoGarageDiagnosticsSection,
  'auto-garage-modern-services-01': AutoGarageServicesSection,
  'auto-garage-modern-testimonials-01': AutoGarageTestimonialsSection,
  'auto-garage-modern-quote-01': AutoGarageQuoteFormSection,
  
  // SHORT IDENTIFIERS + LEGACY SUPPORT
  // (Additional 32 backward-compatible mappings)
};
```

### 16.7 File Structure Updates

```
frontend/src/templates/
├── core/
│   ├── TemplateRenderer.tsx         # Main renderer (Step 1)
│   └── registry.ts                  # ✅ Updated with 42 mappings
├── restaurant/
│   └── components/
│       ├── RestaurantHero.tsx       # Enhanced hero section
│       ├── RestaurantAbout.tsx      # Enhanced about section  
│       ├── RestaurantMenuHighlightSection.tsx  # ✅ NEW
│       ├── RestaurantTestimonialsSection.tsx   # ✅ NEW
│       └── RestaurantContactSection.tsx        # ✅ NEW
└── garage/
    └── components/
        ├── AutoGarageHeroSection.tsx          # ✅ NEW
        ├── AutoGarageDiagnosticsSection.tsx   # ✅ NEW
        ├── AutoGarageServicesSection.tsx      # ✅ NEW
        ├── AutoGarageTestimonialsSection.tsx  # ✅ NEW
        └── AutoGarageQuoteFormSection.tsx     # ✅ NEW
```

### 16.8 Testing Results

**Site Configuration Verification**:
- ✅ Mary's Restaurant: restaurant-modern template, 5 sections mapped
- ✅ Oficina Paulo Calibra: auto-garage-modern template, 8 sections mapped
- ✅ Both servers running: Django (8000), Next.js (3001)
- ✅ Sites accessible and rendering via TemplateRenderer

**Registry Validation**:
- ✅ All 10 new sections successfully mapped
- ✅ Legacy identifiers maintained for backward compatibility  
- ✅ New naming convention fully implemented
- ✅ TypeScript compilation error-free

### 16.9 Development Impact

**Immediate Benefits**:
- 🎨 **Design System**: Consistent Tailwind-based styling across templates
- 🧩 **Component Library**: Reusable sections for rapid site building
- 📊 **Business Ready**: Two complete template categories operational  
- 🔧 **Developer Experience**: Clear naming conventions and documentation

**Future Expansion Ready**:
- Template system proven scalable for additional business types
- Section component pattern established for portfolio, ecommerce, etc.
- Registry architecture handles unlimited template expansion
- Naming convention supports infinite template variants

### 16.10 Next Steps (Future Development)

**Potential Template Lab Step 3**:
1. **Portfolio Template**: Creative professionals, agencies, photographers
2. **E-commerce Template**: Product catalogs, shopping carts, checkout
3. **Blog Template**: Article listings, post details, author profiles
4. **Landing Page Template**: High-conversion marketing pages

**Advanced Features**:
- Visual section editor integration
- A/B testing for section variants  
- Section-level SEO optimization
- Performance analytics per section type

---

## 17. Template Lab – Template Preview & Sections Explorer ✅ **IMPLEMENTED**

### 17.1 Overview

The Template Preview & Sections Explorer provides JCW staff with detailed template inspection capabilities, allowing them to preview templates using real sample sites and explore the section composition of each template.

### 17.2 Backend Components

#### 17.2.1 Sample Site Mapping API

**Endpoint**: `GET /api/admin/templates/{template_key}/sample-site/`

**Purpose**: Maps template keys to sample SiteProject slugs for live preview

**Authentication**: Staff-only (JWT required)

**Hard-coded Mappings**:
- `restaurant-modern` → `marys-restaurant`
- `auto-garage-modern` → `oficina-paulo-calibra`

**Response Format**:
```json
{
  "template_key": "restaurant-modern",
  "sample_site_slug": "marys-restaurant"
}
```

**Error Handling**:
- 404 if no mapping exists for template key
- 404 if sample site doesn't exist in database

### 17.3 Frontend Components

#### 17.3.1 Template Preview Page

**Route**: `/[locale]/admin/templates/{templateKey}`

**Features**:
- **Breadcrumb Navigation**: Templates > Template Name
- **2-Column Layout**: Preview + metadata (left) | Info + sections (right)
- **Template Metadata Display**: Name, category, status, usage count
- **Screenshot Preview**: Uses `/template-previews/${templateKey}-01.jpg`
- **Sample Site Link**: "Open Sample Site in new tab" button

#### 17.3.2 Sections Explorer

**Purpose**: Read-only exploration of template section composition

**Data Source**: Sample site's `/api/sites/{slug}/public/` JSON (home page)

**Section Information Displayed**:
- **Order**: Numerical sequence (1, 2, 3...)
- **Identifier**: Section identifier (e.g., "hero-banner", "garage-quote-form")
- **Internal Name**: Human-readable section name (if available)
- **Type Tag**: Auto-derived category with color coding:
  - `hero` (purple) - Hero sections, banners, headers
  - `form` (green) - Interactive forms, quote requests
  - `services` (blue) - Service grids, product cards
  - `testimonials` (yellow) - Reviews, customer feedback
  - `contact` (red) - Contact info, address details
  - `generic` (gray) - Other content sections

**Section Description**: Auto-generated from identifier (e.g., "hero-banner" → "main top hero with headline & CTA")

### 17.4 Navigation Integration

#### 17.4.1 Template Library Integration

**Template Library Page**: `/[locale]/admin/templates`

**Preview Button**: Now navigates to template preview page instead of generic preview
- Clicking "Preview" on any template card → `/{locale}/admin/templates/{template.key}`
- "Edit Template" button maintains existing behavior

### 17.5 Graceful Fallbacks

#### 17.5.1 No Sample Site Mapping
**Message**: "No sample site is linked to this template yet. Once a demo site is created for this template, its sections will appear here."

#### 17.5.2 Sample Site Data Loading Error
**Message**: "Could not load sample site data (slug: X). Please verify the site exists and is published."

#### 17.5.3 Missing Preview Image
**Fallback**: Standard placeholder with template name and "Preview image coming soon"

### 17.6 Technical Implementation

#### 17.6.1 API Functions Added

**Frontend (`lib/api.ts`)**:
- `fetchTemplateSampleSite(templateKey)` - Get sample site mapping
- `fetchAdminSiteTemplateDetailByKey(templateKey)` - Get template by key
- `fetchSitePublic(siteSlug, locale)` - Get public site data

#### 17.6.2 Component Architecture

**Template Preview Page** (`/[locale]/admin/templates/[templateKey]/page.tsx`):
- Loads template metadata via admin API
- Fetches sample site mapping
- Loads public site JSON for sections analysis
- Renders responsive 2-column layout with sections explorer

### 17.7 Section Type Detection Algorithm

**Type Detection Logic**:
```typescript
function getSectionType(identifier: string): string {
  const id = identifier.toLowerCase();
  
  if (id.includes('hero') || id.includes('header') || id.includes('banner')) return 'hero';
  if (id.includes('form') || id.includes('quote') || id.includes('contact-form')) return 'form';
  if (id.includes('service') || id.includes('card') || id.includes('grid')) return 'services';
  if (id.includes('testimonial') || id.includes('review')) return 'testimonials';
  if (id.includes('contact') || id.includes('address') || id.includes('info')) return 'contact';
  
  return 'generic';
}
```

### 17.8 Usage Examples

#### 17.8.1 Restaurant Template Preview
- **URL**: `/en/admin/templates/restaurant-modern`
- **Sample Site**: Mary's Restaurant (`marys-restaurant`)
- **Sections Shown**: hero-banner, menu-showcase, testimonials-grid, contact-info
- **Sample Site Link**: Opens `/sites/marys-restaurant` in new tab

#### 17.8.2 Garage Template Preview
- **URL**: `/en/admin/templates/auto-garage-modern`
- **Sample Site**: Oficina Paulo Calibra (`oficina-paulo-calibra`)
- **Sections Shown**: hero-banner, garage-quote-form, services-cards, contact-info
- **Sample Site Link**: Opens `/sites/oficina-paulo-calibra` in new tab

### 17.9 Benefits

1. **Template Understanding**: Staff can see exactly how templates are structured
2. **Section Inventory**: Clear visibility into section types and order
3. **Live Preview**: Direct access to sample sites for full template experience
4. **Template Analysis**: Understand section composition for template planning
5. **Quality Assurance**: Verify template implementation matches expectations

### 17.10 Future Enhancements

- **Section Editing**: Click sections to edit directly from explorer
- **Template Comparison**: Side-by-side section comparison between templates
- **Section Performance**: Analytics on section engagement and conversion
- **Template Variants**: Support for multiple sample sites per template
- **Visual Section Map**: Graphical representation of section flow

---

## 18. Website Builder v2 – Section Field Editing

### 18.1 Overview

Website Builder v2 extends the read-only Builder v1 structure panel with full content editing capabilities. Users can now select sections and edit their field content directly in the dashboard, with changes immediately saved to the backend and reflected in the live preview.

### 18.2 Route & Access

**Route:**
- User dashboard: `/[locale]/dashboard/website`

**Access Requirements:**
- JWT authentication required
- User must own the SiteProject being edited
- Active project with published pages

### 18.3 Three-Column Layout

Builder v2 features a comprehensive three-panel interface:

**Left Panel (Structure):**
- Lists all pages and sections for the current SiteProject
- Expandable hierarchy with selection states
- Visual indicators for selected pages/sections
- Statistics footer showing page/section counts

**Middle Panel (Field Editor):**
- Form interface for editing selected section fields
- Dynamic input types (text/textarea) based on content length
- Save/Reset buttons with loading states
- Success/error messaging system

**Right Panel (Preview):**
- Live website preview with device simulation
- Real-time updates after successful saves
- Preview refresh system using key-based re-rendering
- Device mode switching (desktop/tablet/mobile)

### 18.4 Field Editing Behavior

**Section Selection:**
- Click any section in the structure panel
- Field editor populates with section's current field values
- Header updates to show: "Editing: [Site] • [Page] • [Section]"

**Field Types:**
- **Short text** (≤80 chars): `<input type="text">`
- **Long text** (>80 chars or contains "content"/"description"): `<textarea>`
- Character count display for longer fields
- Automatic field ordering by `field.order`

**Save Process:**
1. User modifies field values in editor
2. Click "Save Changes" button
3. API call to `PATCH /api/sections/{section_id}/content/`
4. Success: Green message + preview refresh
5. Error: Red message with error details

### 18.5 API Integration

**Endpoint:**
```
PATCH /api/sections/{section_id}/content/
```

**Authentication:**
- JWT Bearer token required
- Uses existing `IsAuthenticated` + `IsSectionProjectOwnerOrStaff` permissions

**Request Payload:**
```json
{
  "fields": [
    { "key": "headline", "value": "Updated headline text" },
    { "key": "subheadline", "value": "Updated subheadline content" },
    { "key": "cta_text", "value": "New button text" }
  ]
}
```

**Response:**
- `200 OK`: Successful update
- `401 Unauthorized`: Missing/invalid JWT token
- `403 Forbidden`: User doesn't own the SiteProject
- `404 Not Found`: Section doesn't exist

**Backend Logic:**
- Uses existing `SectionContentUpdateView` and `SectionContentUpdateSerializer`
- Finds each field by `key` within the section
- Updates `Field.value` for matching fields
- Automatically saves all changes in single transaction

### 18.6 Preview Refresh System

**Refresh Mechanism:**
- `previewRefreshKey` state triggers React key-based re-rendering
- Increments after successful field saves
- Forces `RestaurantModernPage` component to reload with new data

**Data Synchronization:**
- Preview uses existing `/api/sites/{slug}/public/` endpoint
- Template component (`RestaurantModernPage`) renders updated field values
- No additional API calls needed for preview updates

### 18.7 Error Handling

**Authentication Errors:**
- Missing token: "Authentication required"
- Invalid token: Automatic redirect to login
- Permission denied: "You don't have permission to edit this section"

**API Errors:**
- Network failures: "Failed to save changes"
- Server errors: Error message from API response
- Validation errors: Field-specific error display

**User Experience:**
- Save button disabled during API calls
- Loading spinner during save operations
- Auto-clear success messages after 3 seconds
- Reset button to restore original field values

### 18.8 State Management

**Core States:**
```typescript
const [currentPageSlug, setCurrentPageSlug] = useState("home");
const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState<string | null>(null);
const [saveSuccess, setSaveSuccess] = useState(false);
```

**Data Flow:**
1. Site data loaded via `/api/sites/{slug}/public/`
2. Structure panel populated with pages/sections
3. Section selection triggers field editor population
4. Field changes update local state
5. Save action sends changes to API
6. Success triggers preview refresh and data refetch

### 18.9 Component Architecture

**Main Components:**
- `WebsiteStructurePanel`: Left sidebar with page/section hierarchy
- `SectionFieldEditor`: Middle panel field editing form
- `RestaurantModernPage`: Right panel website preview

**Integration Pattern:**
```tsx
<WebsiteStructurePanel
  project={siteData}
  currentPageSlug={currentPageSlug}
  selectedSectionId={selectedSectionId}
  onPageSelect={setCurrentPageSlug}
  onSectionSelect={setSelectedSectionId}
/>

<SectionFieldEditor 
  section={selectedSection} 
  onSave={handleFieldSave}
/>

<RestaurantModernPage
  key={previewRefreshKey}
  project={siteData}
  mode="dashboard"
  currentPageSlug={currentPageSlug}
  onNavigatePage={handleNavigatePage}
/>
```

### 18.10 Testing & Validation

**Test Coverage:**
- Section selection and field population
- Field editing and local state management
- API integration with proper authentication
- Error handling for various failure scenarios
- Preview refresh after successful saves
- Cross-browser compatibility and responsive design

**Success Criteria:**
- ✅ Three-column layout renders correctly
- ✅ Section selection populates field editor
- ✅ Field editing saves to backend database
- ✅ Preview updates reflect changes immediately
- ✅ Error handling provides clear feedback
- ✅ Authentication enforces proper permissions

### 18.11 Future Enhancements

**Planned Improvements:**
- **Drag & Drop Reordering**: Rearrange sections within pages
- **Section Creation**: Add new sections to existing pages
- **Bulk Field Operations**: Edit multiple sections simultaneously
- **Field Validation**: Client-side validation for field formats
- **Auto-save**: Periodic background saves while editing
- **Version History**: Track and restore previous field values
- **Media Management**: Upload and manage images directly in editor
- **Advanced Fields**: Support for rich text, color pickers, etc.

### 18.12 Builder Save Endpoints - Current Status

**FIXED:** Authentication and CSRF issues resolved for section content and SEO updates.

#### Section Content Editor:
- **Frontend API:** `updateSectionContent()` in `lib/api/sections.ts`
- **Endpoint:** `PATCH /api/sections/{section_id}/content/`
- **Authentication:** Session-based (Django sessions with CSRF)
- **Payload Format:**
  ```json
  {
    "fields": [
      { "key": "headline", "value": "New headline text" },
      { "key": "subheadline", "value": "Updated content..." }
    ]
  }
  ```
- **CSRF Handling:** Auto-fetches fresh CSRF token before each request
- **Headers:** `X-CSRFToken` header with `credentials: "include"`
- **Permissions:** Only SiteProject owner or staff can update sections

#### Page SEO Editor:
- **Frontend API:** `updatePageSeo()` in `lib/api/pages.ts`  
- **Endpoint:** `PATCH /api/pages/{page_id}/seo/`
- **Authentication:** Session-based (same as content editor)
- **Payload Format:**
  ```json
  {
    "meta_title": "New page title",
    "meta_description": "Updated description...",
    "meta_slug": "new-slug",
    "indexable": true
  }
  ```
- **Same CSRF/session pattern as section updates**

#### Technical Notes:
- **Authentication System:** Uses Django sessions (not JWT) for builder operations
- **CSRF Token Management:** Fresh token fetched via `GET /api/csrf/` before each write request
- **API Base URLs:** Updated to use `127.0.0.1:8000` for consistency
- **Error Handling:** Proper error messages displayed in UI for auth/permission failures
- **Import Fixes:** Removed non-existent `authFetch` dependency, uses direct fetch with session cookies

#### Validation Status:
- ✅ Section field saves work without authentication errors
- ✅ CSRF token properly included in request headers
- ✅ Session-based auth correctly validated by backend
- ✅ Permission checks enforce owner-only access
- ✅ API responses return proper JSON (not HTML error pages)
- ✅ Frontend error handling shows clear messages to users

---

## 19. Printing Builder v1 – Dashboard Route & Skeleton

### 19.1 Overview

Printing Builder v1 establishes the foundation for print material creation within the JCW dashboard. It provides a structured interface for users to create business cards, flyers, and other marketing materials using their existing website data and branding.

### 19.2 Route & Access

**Route:**
- User dashboard: `/[locale]/dashboard/printing`

**Access Requirements:**
- Session authentication required (same as Website Builder)
- User must have a valid SiteProject
- Navigation available from main dashboard sidebar

### 19.3 Data Integration

**Site Data Reuse:**
- Uses identical data fetching pattern as Website Builder
- Fetches from `/api/sites/{projectSlug}/public/` endpoint
- Reuses existing `SiteProjectPublic` and `ThemeJson` types
- Currently hardcoded to "marys-restaurant" slug (matches Website Builder)

**Theme Integration:**
- Automatically extracts brand colors from site theme
- Displays theme preview with primary, secondary, and accent colors
- Uses site name and template information for consistency

### 19.4 User Interface

**Top Summary Card:**
- Business name and website link display
- Direct link to live site at `/sites/{slug}`
- Visual theme color palette preview
- Template key identification

**Product Categories Grid:**
- Responsive 3-column layout (1 col mobile, 2 col tablet, 3 col desktop)
- Six product categories with different statuses:
  - **Business Cards** (Available) - Full preview and functionality
  - **Flyers & Brochures** (Coming Soon) - Bizay integration planned
  - **Posters & Banners** (Coming Soon) - Bizay integration planned  
  - **Stickers & Labels** (Coming Soon) - Bizay integration planned
  - **Clothing & Merch** (Future) - Printful integration planned
  - **POS Materials** (Future) - Custom integration planned

### 19.5 Business Card Preview System

**Live Preview Features:**
- Front card mockup using site's primary color as background
- Site name prominently displayed with theme-appropriate styling
- Back card mockup with contact information placeholders
- Responsive aspect ratio (1.7:1 business card proportions)
- Gradient overlay effects for visual appeal

**Data Sources:**
- Site name from `siteData.name`
- Colors from `siteData.theme.primary_color`, `secondary_color`, etc.
- Contact information placeholders (TODO: extract from site data when available)

### 19.6 Status System

**Product Availability:**
- **Available**: Green badge, functional buttons, preview enabled
- **Coming Soon**: Amber badge, disabled buttons, future integration notes
- **Future**: Gray badge, placeholder text, long-term planning

**Button Behavior:**
- Available products: "Open [Product] Builder (coming next)"
- Coming soon: "Not available yet" (disabled)
- Future: "Planned for later" (disabled)

### 19.7 Navigation Flow

**Entry Points:**
- Main dashboard sidebar "Printing" tab
- Website Builder "Continue to Print Studio" button (after preview)

**Website Builder Integration:**
- Added CTA button below website preview
- Uses existing router and locale handling
- Smooth transition: Builder → Preview → Printing Builder

### 19.8 Technical Architecture

**Component Structure:**
```typescript
PrintingPage (main page component)
├── BusinessCardPreview (live card mockup)
├── ProductCategoryCard (reusable product display)
└── PRINT_PRODUCTS (product configuration array)
```

**State Management:**
- `siteData`: Site project information and theme
- `siteLoading`: Loading state for data fetching  
- `siteError`: Error handling for API failures

**API Integration:**
- Reuses existing public site API endpoint
- No new backend endpoints required
- Session-based authentication (consistent with platform)

### 19.9 Future Integration Points

**Bizay Integration (Coming Soon):**
- Business Cards (priority 1)
- Flyers & Brochures
- Posters & Banners  
- Stickers & Labels

**Printful Integration (Future):**
- Clothing & Merch category
- T-shirts, hoodies, mugs, promotional items

**POS Materials (Future):**
- Table tents, receipts, point-of-sale items
- Custom integration for restaurant/retail specific needs

### 19.10 Code Locations

**Frontend Files:**
- `src/app/[locale]/dashboard/printing/page.tsx` - Main printing dashboard
- `src/app/[locale]/dashboard/website/page.tsx` - Updated with CTA button
- `src/components/jcw/dashboard/DashboardShellRightSidebar.tsx` - Navigation already included

**Key Dependencies:**
- `@/lib/types/sitePublic` - Site and theme type definitions
- `@/contexts/auth-context` - Authentication handling
- Existing site data API endpoints

### 19.11 Testing Status

**Verified Functionality:**
- ✅ Route accessible via dashboard navigation
- ✅ Site data fetching and display
- ✅ Theme color extraction and preview
- ✅ Business card mockup rendering
- ✅ Product status system working
- ✅ Navigation flow from Website Builder
- ✅ Responsive design across device sizes

### 19.12 Next Steps

**Immediate (v2):**
- Business Card Builder implementation
- Contact information extraction from site data
- Custom card template system

**Medium Term (v3):**
- Bizay API integration for actual ordering
- Advanced design customization tools
- Order management and tracking

**Long Term (v4+):**
- Printful API integration for merchandise
- POS materials custom builder
- Advanced branding tools and asset management

---

## 20. Website Builder – AI Section Suggestions (v1)

### 20.1 Overview

The AI Section Suggestions feature provides intelligent content generation for website sections within the builder. Users can click a "Smart suggestion" button to automatically populate section fields with AI-generated content based on their business context.

### 20.2 Route & Access

**Route:**
- Website builder: `/[locale]/dashboard/website`
- Available in section field editor when editing any section

**Access Requirements:**
- Session authentication required (same as other builder features)
- User must own the SiteProject containing the section
- OpenAI API key must be configured in backend environment

### 20.3 Backend Implementation

**API Endpoint:**
- `POST /api/builder/sections/<section_id>/ai-suggest/`
- Authentication: Session + CSRF token (consistent with other builder APIs)
- Permissions: `IsAuthenticated` with section ownership validation

**Request Payload:**
```json
{
  "locale": "en",
  "tone": "friendly and professional",
  "extra_instructions": "Highlight family atmosphere and home-made food."
}
```

**Response Format:**
```json
{
  "suggested": {
    "headline": "Welcome to Mary's Restaurant",
    "subheadline": "Authentic Italian cuisine in the heart of the city",
    "content": "Mary's Restaurant has been serving delicious..."
  }
}
```

**Context Generation:**
- Business name from `SiteProject.name`
- Industry from `SiteProject.business_type` 
- Section type from `Section.identifier`
- Available field keys from related `Field` objects
- User-provided tone and locale preferences

### 20.4 OpenAI Integration

**Model Used:** `gpt-4o-mini` (cost-effective for content generation)
**Response Format:** Structured JSON matching section field keys
**Configuration:** Environment variable `OPENAI_API_KEY` in `.env`

**Prompt Strategy:**
- System prompt enforces JSON-only responses with no extra keys
- User prompt provides business context, section type, and field requirements
- Response filtering ensures only valid field keys are returned
- Graceful error handling for API failures or missing configuration

### 20.5 Frontend Implementation

**Component:** `SectionFieldEditor.tsx`
**Location:** `/src/components/jcw/builder/SectionFieldEditor.tsx`

**New UI Elements:**
- "Smart suggestion" button (subtle gray styling, no "AI" branding)
- Loading state with spinner during generation
- Error display for suggestion failures
- Success integration into existing form fields

**State Management:**
```typescript
const [suggesting, setSuggesting] = useState(false);
const [suggestError, setSuggestError] = useState<string | null>(null);
```

**API Integration:**
- Uses same CSRF token pattern as other builder APIs
- Session-based authentication for consistency
- Merges suggestions into existing `fieldValues` state
- No auto-save - user maintains control over final content

### 20.6 User Experience

**Button Placement:**
- Located before the "Save Changes" button in section editor
- Disabled during suggestion generation or saving operations
- Small, secondary styling to keep focus on main actions

**Content Flow:**
1. User selects a section to edit
2. Clicks "Smart suggestion" button
3. AI generates content based on business context
4. Fields populate with suggested text
5. User can edit suggestions before saving
6. Standard save process applies

**Error Handling:**
- Missing OpenAI key: "AI suggestion service is not configured"
- API failures: "Failed to get suggestion" with retry option
- Network issues: Standard error messaging
- No automatic fallbacks - clear error states

### 20.7 Security & Privacy

**Data Protection:**
- Only section owner can request suggestions for their content
- No persistent storage of AI-generated content until user saves
- API key stored securely in environment variables
- Standard Django CSRF and session protection

**Rate Limiting:**
- Inherits from Django's standard rate limiting
- Frontend prevents multiple concurrent requests
- Backend validates section ownership on every request

### 20.8 Configuration

**Backend Environment:**
```env
OPENAI_API_KEY=your_openai_key_here
```

**Backend Dependencies:**
- `openai==2.8.0` (official Python client)
- `python-dotenv==1.2.1` (environment loading)

**Frontend Dependencies:**
- No additional packages required
- Uses existing fetch API and error handling patterns

### 20.9 Testing Status

**Backend Verification:**
- ✅ Endpoint created and routed correctly
- ✅ Authentication and ownership validation
- ✅ OpenAI integration with error handling
- ✅ Response filtering and JSON validation

**Frontend Verification:**
- ✅ Smart suggestion button added to section editor
- ✅ Loading states and error handling implemented
- ✅ Field population and state management working
- ✅ No UI disruption to existing save workflow

**Integration Testing:**
- ✅ API endpoint accessible from frontend
- ✅ CSRF token handling consistent with other APIs
- ⚠️  Requires valid OpenAI API key for full functionality testing

### 20.10 Future Enhancements

**Immediate Improvements:**
- Context enhancement with location data and specific business details
- Tone customization options in UI (professional, casual, fun)
- Content length preferences (short, medium, detailed)

**Medium Term:**
- Section-specific prompting for better hero vs about vs services content
- Industry-specific templates and suggestions
- Multi-language support with locale-aware generation

**Long Term:**
- Integration with existing site content for consistency
- A/B testing of different AI-generated variations  
- Brand voice learning from existing content
- Custom instruction templates per business type

### 20.11 Code Locations

**Backend Files:**
- `sites/views.py` - `SectionAISuggestView` class
- `sites/api_urls.py` - URL routing for AI endpoint
- `jcw_backend/settings.py` - OpenAI configuration
- `requirements.txt` - OpenAI dependencies

**Frontend Files:**  
- `src/components/jcw/builder/SectionFieldEditor.tsx` - Main implementation
- Uses existing `lib/api/sections.ts` patterns for API calls

### 20.12 Dependencies

**Production Requirements:**
- Valid OpenAI API account and key
- Existing session authentication system
- Django CSRF middleware enabled
- Frontend build with no additional packages

**Development Setup:**
- `.env` file with `OPENAI_API_KEY`
- Local Django server on port 8000
- Next.js frontend on port 3000+ 
- Existing test data with sections and fields

---

**End of Documentation v0.3** - AI Section Suggestions v1 Complete