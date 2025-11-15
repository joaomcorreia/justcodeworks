# JustCodeWorks AI Coding Instructions

## 🏗️ Architecture Overview

This is a **multi-tenant website builder** with Django REST API backend and Next.js i18n frontend.

### Core Components
- **Backend**: Django 5 + DRF at `backend/` - Multi-tenant site/page/section management
- **Frontend**: Next.js 14 App Router + TypeScript at `frontend/` - Customer-facing websites with editing
- **Template System**: SiteTemplate model drives layout switching (`template_key: "jcw-main"`)
- **Multi-tenancy**: Each user gets isolated `SiteProject` → `Page` → `Section` → `Field` hierarchy

## 🔧 Development Workflow (Windows CMD Only)

```cmd
cd C:\projects\justcodeworks\backend
python manage.py runserver 8000

cd C:\projects\justcodeworks\frontend
npm run dev
```

**Port conflicts**: Use `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`
**Cache issues**: Run `npm run clean` before `npm run dev`

## 🎯 Key Patterns & Conventions

### Backend (Django/DRF)
- **API URLs**: All in `sites/api_urls.py` with DRF ViewSets
- **Models**: TimeStampedModel base class, UUID primary keys for user-facing models
- **Testing**: Extensive test coverage in `test_*.py` files - always add tests for new features
- **Auth**: JWT-based, all write endpoints require authentication

### Frontend (Next.js)
- **i18n Structure**: `src/i18n/base-en.ts` → locale-specific files, use `getDictionary(locale)`
- **Server/Client Split**: Server components for initial render, `*Client.tsx` for interactivity
- **Sentinel Comments**: Use `// [AUTH]`, `// [JCW]`, `// [I18N]`, `// [UI]` for code organization
- **No Turbopack**: Stable Next.js config only (`reactStrictMode: true`)

### Template Lab System
- **Template Keys**: `template_key` field determines layout (e.g., "jcw-main", "one-page-basic")
- **Layout Switching**: Frontend reads `template_key` from API to choose components
- **Data Structure**: `SiteTemplate` → `SiteProject.site_template` → API exposes `template_key`

## 📁 Critical File Locations

```
backend/sites/
├── models.py          # Core data models (SiteTemplate, SiteProject, Page, Section)
├── api_urls.py        # All API endpoints
├── views.py           # DRF ViewSets and custom APIs
└── serializers.py     # API response formatting

frontend/src/
├── app/[locale]/      # Next.js App Router with i18n
├── i18n/base-en.ts    # Master translation dictionary
├── components/        # Reusable UI components
└── lib/api.ts         # API client and TypeScript types
```

## 🚨 Critical Rules

1. **Windows CMD Syntax**: Use `cd C:\path` not `cd /path`, no `&&` chaining
2. **Authentication Gates**: All editing UI must check auth state before rendering
3. **i18n First**: All user-facing text goes through translation system
4. **Test Coverage**: Add tests for any new models, APIs, or core functionality
5. **Template Consistency**: Respect `template_key` for layout decisions

## 🔍 Quick Debugging

```cmd
# Find auth-related code
cd C:\projects\justcodeworks\frontend
findstr /s /n /c:"[AUTH]" src\*.tsx

# Find JCW-specific components
findstr /s /n /c:"[JCW]" src\*.tsx

# Check i18n usage
findstr /s /n /c:"[I18N]" src\*.ts src\*.tsx
```

## 🎨 UI Guidelines

- **No Green Accents**: Use blue color scheme throughout
- **Responsive**: Mobile-first design with Tailwind classes
- **Edit Mode**: Editing controls only visible when authenticated
- **Template Awareness**: Components should adapt based on `template_key`

## ⚡ Common Tasks

**Adding new API endpoint**: Update `sites/api_urls.py`, create ViewSet in `views.py`
**New translation key**: Add to `base-en.ts`, update locale files
**Template switching**: Check `template_key` in component logic
**Auth gating**: Wrap editing UI in auth context checks