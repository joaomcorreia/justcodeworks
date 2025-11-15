# API Testing Guide

## Django Backend Phase 2 - REST API Complete ✅

### API Endpoints Available

#### 1. Templates API (Read-Only)
**List all templates:**
```
GET http://127.0.0.1:8000/api/templates/
```

**Get single template:**
```
GET http://127.0.0.1:8000/api/templates/{template-id}/
```

Response includes:
- id, slug, name
- category, complexity
- short_description, long_description, recommended_for
- sections_summary (array)
- estimated_pages
- has_store, has_blog, has_booking flags

---

#### 2. Site Projects API (Create, List, Retrieve)

**List all projects:**
```
GET http://127.0.0.1:8000/api/projects/
```

**Get single project:**
```
GET http://127.0.0.1:8000/api/projects/{project-id}/
```

**Filter by slug:**
```
GET http://127.0.0.1:8000/api/projects/?slug=my-project-slug
```

**Create new project:**
```
POST http://127.0.0.1:8000/api/projects/
Content-Type: application/json

{
  "name": "Demo JCW Project",
  "slug": "demo-jcw-project",
  "template_id": "<UUID-of-existing-template>",
  "business_type": "Local café",
  "primary_goal": "get-leads",
  "primary_locale": "en",
  "additional_locales": ["pt-pt", "nl"],
  "primary_color": "yellow",
  "notes": "Example project created from the API.",
  "is_active": true
}
```

Response includes:
- All submitted fields
- id, created_at, updated_at
- Full template object (nested)

---

### Testing with Browser

The Django REST Framework provides a browsable API interface.

1. **Visit the API root:**
   http://127.0.0.1:8000/api/

2. **Browse templates:**
   http://127.0.0.1:8000/api/templates/

3. **Browse projects:**
   http://127.0.0.1:8000/api/projects/

---

### Testing with curl (PowerShell)

**List templates:**
```powershell
curl http://127.0.0.1:8000/api/templates/
```

**Create a project:**
```powershell
$body = @{
    name = "Test Project"
    slug = "test-project"
    business_type = "Restaurant"
    primary_goal = "get-leads"
    primary_locale = "en"
    additional_locales = @("nl", "pt-pt")
    primary_color = "blue"
    notes = "Test project from API"
    is_active = $true
} | ConvertTo-Json

curl -X POST http://127.0.0.1:8000/api/projects/ `
  -H "Content-Type: application/json" `
  -d $body
```

---

### Before Testing: Add Templates in Admin

1. Go to http://127.0.0.1:8000/admin/
2. Click "Templates" under SITES
3. Add templates matching your frontend catalog:
   - Business basics (one-page, starter)
   - Shop starter (store, standard)
   - Booking suite (booking, standard)
   - Multi-page professional (multi-page, standard)
   - Portfolio showcase (portfolio, advanced)

---

### API Configuration

**Security:** Currently open (AllowAny) for development
**Authentication:** None (will be added in Phase 3)
**CORS:** Not configured yet (will be needed for frontend)

---

### Next Steps

✅ Backend Phase 1: Models created
✅ Backend Phase 2: REST API created

**Phase 3 (Next):**
- Add CORS headers for frontend
- Wire frontend builder to POST projects
- Wire frontend Templates Lab to GET templates
- Replace localStorage with API calls
