# JCW Backend Setup Instructions

## Created Django Backend

Django project: **jcw_backend**  
App: **sites**  
Database: SQLite (db.sqlite3)

## Virtual Environment

Location: `C:\projects\justcodeworks\backend\.venv`

To activate:
```cmd
cd C:\projects\justcodeworks\backend
.\.venv\Scripts\Activate.ps1
```

## Database Migrations

✅ Migrations created and applied successfully

## Create Superuser

Run this command to create an admin account:

```cmd
python manage.py createsuperuser
```

Follow the prompts to set:
- Username (e.g., admin)
- Email address (optional)
- Password (enter twice)

## Start Development Server

```cmd
python manage.py runserver
```

Then visit: **http://127.0.0.1:8000/admin/**

## Models Created

### 1. Template
- Maps to frontend `templatesCatalog`
- Fields: name, slug, category, complexity, descriptions, sections_summary
- Features: has_store, has_blog, has_booking flags
- Estimated pages count

### 2. SiteProject
- Maps to builder configuration
- Fields: name, slug, business_type, primary_goal
- Locales: primary_locale, additional_locales (JSON)
- Branding: primary_color
- Links to Template via ForeignKey
- Status: is_active flag

### 3. Page
- Belongs to a SiteProject
- Fields: slug, path, title, order
- Status: is_published flag
- Unique: (project, slug)

### 4. Section
- Belongs to a Page
- Fields: identifier (e.g., 'jcw-main-hero01'), internal_name, order
- Unique: (page, identifier)

### 5. Field
- Belongs to a Section
- Fields: key, label, value (TextField)
- Unique: (section, key)

## Admin Features

All models registered with:
- List displays with relevant fields
- Search fields
- Filters
- Inline editing where appropriate
- Prepopulated slug fields

## Next Steps

1. Create a superuser account
2. Visit admin interface
3. Add Templates matching frontend templatesCatalog
4. Test creating SiteProjects with pages/sections/fields
5. Later: Add DRF serializers and viewsets for API access
