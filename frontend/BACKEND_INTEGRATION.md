# Backend Phase 3 - Frontend Integration Complete ✅

## What Was Implemented

### 1. Environment Configuration
- **File:** `frontend/.env.local`
- **Content:** `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api`
- **Note:** Restart Next.js dev server after creating this file

### 2. API Client
- **File:** `frontend/src/lib/api.ts`
- **Functions:**
  - `fetchTemplatesFromApi()` - GET /api/templates/
  - `slugifyName(name)` - Converts site name to URL-safe slug
  - `createSiteProject(input)` - POST /api/projects/
- **Types:**
  - `ApiTemplate` - Backend template structure
  - `ApiSiteProject` - Backend project structure
  - `CreateSiteProjectInput` - Builder → API mapping

### 3. Builder Integration
- **File:** `frontend/src/app/[locale]/builder/BuilderClient.tsx`
- **Changes:**
  - Added `selectedTemplateId` to store hook usage
  - Added `submitState`, `submitError`, `createdProject` state
  - Implemented `handleConfirm()` async function
  - Updated Confirm button with loading state
  - Added success/error message display

---

## How to Test

### Prerequisites

1. **Django server running:**
   ```cmd
   cd C:\projects\justcodeworks\backend
   .\.venv\Scripts\Activate.ps1
   python manage.py runserver
   ```

2. **Add at least one template in Django admin:**
   - Go to http://127.0.0.1:8000/admin/sites/template/
   - Click "Add Template"
   - Fill in:
     - Name: "Business Basics"
     - Slug: `business-basics` (must match frontend templatesCatalog slug)
     - Category: one-page
     - Complexity: starter
     - Short description: "Perfect for small businesses"
     - Estimated pages: 1
   - Save

3. **Next.js dev server running (after restarting for .env.local):**
   ```cmd
   cd C:\projects\justcodeworks\frontend
   npm run dev
   ```

---

### Test Flow

1. **Go to Templates Lab:**
   - Visit `http://localhost:3000/en/templates-lab` (or whatever port Next.js uses)
   - Browse templates
   - Click "Choose this template" on any template (e.g., "Business basics")

2. **Go to Builder:**
   - Should redirect to `/en/builder?template=business-basics`
   - You'll see "✓ Selected template: Business basics"

3. **Configure step:**
   - Enter Site name: "My Test Café"
   - Enter Business type: "Restaurant"
   - Select Main goal: "Get leads / requests"
   - Main locale is pre-filled: "en"
   - (Optional) Add additional locales: "pt-pt", "nl"
   - (Optional) Primary color: "yellow"
   - (Optional) Extra notes: "Testing the API integration"
   - Click "Next: Review" button

4. **Review step:**
   - Check all details are correct
   - Click "Confirm & create project" button
   - Button text changes to "Creating project…"
   - Wait for response (~1-2 seconds)

5. **Expected Success:**
   - Green success message appears:
     > Project created in backend with ID `<uuid>` and slug `my-test-cafe`.
   - Check Django admin: http://127.0.0.1:8000/admin/sites/siteproject/
   - You should see "My Test Café" in the list
   - Click it to see all fields populated correctly
   - Template field should link to "Business Basics"

6. **Expected Error (if backend down):**
   - Red error message appears:
     > Failed to create project (net::ERR_CONNECTION_REFUSED)
   - Or similar network error

7. **Expected Error (if required fields missing):**
   - Red error message:
     > Please set at least a site name and primary goal.

---

## API Flow Details

### Template Resolution

When you click "Confirm & create project":

1. Frontend calls `createSiteProject()`
2. Function calls `fetchTemplatesFromApi()` to get all templates
3. Searches for template with `slug === selectedTemplateId`
4. If found, extracts UUID (`template.id`)
5. If not found or API fails, continues with `template_id = null`

### Project Creation Payload

Sent to `POST /api/projects/`:
```json
{
  "name": "My Test Café",
  "slug": "my-test-cafe",
  "template_id": "uuid-from-backend-or-null",
  "business_type": "Restaurant",
  "primary_goal": "get-leads",
  "primary_locale": "en",
  "additional_locales": ["pt-pt", "nl"],
  "primary_color": "yellow",
  "notes": "Testing the API integration",
  "is_active": true
}
```

### Response Structure

On success (201 Created):
```json
{
  "id": "uuid",
  "name": "My Test Café",
  "slug": "my-test-cafe",
  "template": {
    "id": "uuid",
    "slug": "business-basics",
    "name": "Business Basics",
    // ... all template fields
  },
  "business_type": "Restaurant",
  "primary_goal": "get-leads",
  "primary_locale": "en",
  "additional_locales": ["pt-pt", "nl"],
  "primary_color": "yellow",
  "notes": "Testing the API integration",
  "is_active": true,
  "created_at": "2025-11-10T14:59:07Z",
  "updated_at": "2025-11-10T14:59:07Z"
}
```

---

## Common Issues & Solutions

### Issue: "Failed to fetch templates (net::ERR_CONNECTION_REFUSED)"
**Cause:** Django server not running  
**Solution:** Start Django server on port 8000

### Issue: Template not resolving (template_id stays null)
**Cause:** Slug mismatch between frontend templatesCatalog and Django Template  
**Solution:** 
- Check frontend: `src/config/templates-catalog.ts` → `id` field
- Check Django: Template → `slug` field
- They must match exactly (e.g., both "business-basics")

### Issue: "Failed to create project (400)"
**Cause:** Missing required fields or validation error  
**Solution:** Check browser console for full error message with field details

### Issue: CORS error in browser console
**Cause:** Django not configured for CORS (Next.js on 3000, Django on 8000)  
**Solution:** Will be added in next phase with django-cors-headers

---

## What's NOT Yet Implemented

- ❌ Loading Templates Lab data from API (still uses static templatesCatalog)
- ❌ Loading page configs from API (still uses localStorage)
- ❌ User authentication / project ownership
- ❌ CORS headers (if needed for production)
- ❌ Update/Delete project operations
- ❌ Creating Pages/Sections/Fields via API

---

## Next Steps

**Phase 4 (Future):**
- Add django-cors-headers for proper CORS support
- Replace frontend templatesCatalog with API data
- Add endpoints for Pages, Sections, Fields
- Replace localStorage page configs with backend data
- Add user authentication and project ownership
- Add update/delete operations for projects
