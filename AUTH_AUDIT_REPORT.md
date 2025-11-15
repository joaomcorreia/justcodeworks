# Just Code Works - Authentication Audit Report

**Date:** November 12, 2025  
**Auditor:** GitHub Copilot  
**Objective:** Verify that editing/building functionality is visible only to logged-in users

---

## Executive Summary

**❌ CRITICAL SECURITY ISSUE FOUND:** Edit mode functionality is accessible to unauthenticated users with NO authentication guards in place.

---

## 1) Frontend Route Protection — Findings

### Dashboard Routes (Protected ✅)
- **`frontend\src\app\(app)\dashboard\**`** → **YES** - Protected
  - `layout.tsx` calls `getCurrentUser()` and redirects to `/login` if no user
  - All dashboard routes require authentication

### Builder Routes (NOT Protected ❌)
- **`frontend\src\app\[locale]\builder\**`** → **NO** - Not Protected
  - `page.tsx` has NO authentication checks
  - `BuilderClient.tsx` loads without any auth guards
  - Public access to full website builder functionality

### Edit Mode on Public Pages (NOT Protected ❌)
- **Edit Mode Toggle** → **NO** - Not Protected
  - `edit-mode-provider.tsx` enables edit mode via URL params (`?edit=1`) or localStorage
  - `edit-mode-toggle.tsx` shows "always visible in dev; later we can hide in production" comment
  - Edit overlays render on homepage without auth checks

---

## 2) Edit Buttons/Links — Visibility Table

| File | Button/Link Text | Guest Visible? | Fix Required |
|------|-----------------|----------------|--------------|
| `frontend\src\components\edit-mode-toggle.tsx` | "Editing homepage" / "View mode" | **YES** | Wrap in auth check |
| `frontend\src\app\[locale]\layout.tsx` | EditModeToggle component | **YES** | Conditional render based on auth |
| `frontend\src\app\[locale]\page.tsx` | Edit overlays ("Editing: Hero", etc.) | **YES** | Wrap editMode checks with auth |
| `frontend\src\components\jcw\dashboard\DashboardBlocksRenderer.tsx` | "Open builder" | NO | Only in authenticated dashboard |
| `frontend\src\app\[locale]\templates\page.tsx` | "Continue to builder" links | **YES** | Add auth guards before builder access |

---

## 3) Backend Permissions — Matrix

| File | View Class | permission_classes | Methods | Verdict |
|------|------------|-------------------|---------|---------|
| `sites\views.py` | `TemplateViewSet` | `[AllowAny]` | All | **OK** - Templates are public |
| `sites\views.py` | `SiteProjectViewSet` | `[IsAuthenticatedOrReadOnly]` | Read: Public, Write: Auth | **OK** |
| `sites\views.py` | `PageViewSet` | `[AllowAny]` | All with owner checks | **RISKY** - Should be `IsAuthenticatedOrReadOnly` |
| `sites\views.py` | `SectionViewSet` | `[AllowAny]` | All with owner checks | **RISKY** - Should be `IsAuthenticatedOrReadOnly` |
| `sites\views.py` | `FieldViewSet` | `[AllowAny]` | All with owner checks | **RISKY** - Should be `IsAuthenticatedOrReadOnly` |
| `sites\views.py` | `TenantDashboardTemplateView` | `[IsAuthenticated]` | GET | **OK** |
| `sites\views.py` | `TenantPagesView` | `[IsAuthenticated]` | GET | **OK** |

### Backend Issues
- **Pages, Sections, Fields ViewSets** use `permission_classes = [AllowAny]` but have manual auth checks
- This allows unauthenticated requests to reach the view logic
- Should use `[IsAuthenticatedOrReadOnly]` for cleaner permission handling

---

## 4) Middleware & Auth Helpers — Status

### Middleware Analysis ❌
- **`frontend\middleware.ts`** - Only handles locale routing, NO authentication
- Missing auth middleware for protected routes
- Routes like `/(app)/dashboard` and `/[locale]/builder` should be intercepted

### Auth Helpers ✅
- **`frontend\src\lib\server-auth.ts`** - Proper JWT token handling
  - `getCurrentUser()` function works correctly
  - Token retrieved from cookies, proper API calls
  - Used correctly in dashboard layout

### Route-Level Guards
- **Dashboard:** ✅ Protected via `getCurrentUser()` in layout
- **Builder:** ❌ No protection whatsoever
- **Edit Mode:** ❌ No auth checks in edit providers

---

## 5) Quick Fix Plan (Surgical)

### Immediate Priority Fixes

1. **Add Builder Route Protection**
   ```typescript
   // frontend/src/app/[locale]/builder/page.tsx
   // Add at top of component:
   const user = await getCurrentUser();
   if (!user) {
     redirect("/login");
   }
   ```

2. **Guard Edit Mode Toggle**
   ```typescript
   // frontend/src/components/edit-mode-toggle.tsx
   // Import getCurrentUser and only render if authenticated
   ```

3. **Conditional Edit Mode Provider**
   ```typescript
   // frontend/src/app/[locale]/layout.tsx
   // Wrap EditModeProvider with auth check
   ```

4. **Update Backend ViewSets**
   ```python
   # backend/sites/views.py
   # Change PageViewSet, SectionViewSet, FieldViewSet:
   permission_classes = [IsAuthenticatedOrReadOnly]
   ```

5. **Add Auth Middleware**
   ```typescript
   // frontend/middleware.ts
   // Add authentication checks for protected routes
   if (pathname.includes('/builder')) {
     // Check auth and redirect to login
   }
   ```

6. **Secure Template Page Links**
   ```typescript
   // frontend/src/app/[locale]/templates/page.tsx
   // Add auth checks before showing "Continue to builder" links
   ```

7. **Hide Edit UI Elements**
   ```typescript
   // frontend/src/app/[locale]/page.tsx
   // Wrap all editMode rendering with: {user && editMode && (...)}
   ```

8. **Environment-Based Edit Toggle**
   ```typescript
   // frontend/src/components/edit-mode-toggle.tsx
   // Remove dev comment, add proper auth + environment checks
   ```

---

## Critical Security Gaps Summary

### What's Missing vs. Requested "Make It Private"

**MISSING:**
- ❌ Builder route authentication
- ❌ Edit mode authentication guards  
- ❌ Auth middleware for protected routes
- ❌ Conditional UI rendering based on auth state

**PARTIALLY IMPLEMENTED:**
- ⚠️ Backend has manual auth checks but wrong permission classes
- ⚠️ Dashboard protected but builder is wide open

**CORRECTLY IMPLEMENTED:**
- ✅ Dashboard layout authentication
- ✅ Server-side auth helpers
- ✅ JWT token handling

### Risk Assessment
**HIGH RISK:** Unauthenticated users can access the full website builder and edit mode functionality, potentially allowing:
- Unauthorized website building
- Edit mode activation on public pages
- Access to builder UI and tools

### Recommendation
Implement all 8 fixes immediately. The builder route should be treated with the same security level as the dashboard.