# 🧱 BUILDER V2 – Edit Fields for Selected Section (Test Guide)

## Test the Builder v2 Implementation

### Prerequisites
✅ Frontend: http://localhost:3005/
✅ Backend: http://127.0.0.1:8000/
✅ User logged in with access to Mary's Restaurant project

### Test Steps

#### 1. Access Builder v2
1. Navigate to: http://localhost:3005/en/dashboard/website
2. Verify three-column layout:
   - **Left**: Structure panel with pages/sections
   - **Middle**: Field editor (empty initially)
   - **Right**: Live preview

#### 2. Test Section Selection
1. In structure panel, click "Home" page to expand
2. Click any section (e.g., "hero", "about")
3. Verify:
   - **Header**: Shows "Editing: Mary's Restaurant • home page • Section #X"
   - **Field Editor**: Shows form with section fields
   - **Preview**: Still shows website

#### 3. Test Field Editing
1. Select a section with content (e.g., hero section)
2. In field editor:
   - Modify text in any field (headline, content, etc.)
   - Click **"Save Changes"** button
3. Verify:
   - **Success message**: Green "Changes saved successfully!" appears
   - **Preview refresh**: Content updates in preview panel
   - **No errors**: Check browser console for API errors

#### 4. Test API Integration
1. Open browser DevTools (F12) → Network tab
2. Edit a field and save
3. Verify network request:
   - **Method**: PATCH
   - **URL**: `/api/sections/{id}/content/`
   - **Headers**: Authorization Bearer token present
   - **Status**: 200 OK
   - **Payload**: Contains `fields` array with updated values

#### 5. Test Persistence
1. After successful save, refresh entire page
2. Verify: Changes are still visible in preview (persisted to database)

### Expected API Behavior

**Endpoint**: `PATCH /api/sections/{section_id}/content/`

**Request Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Payload**:
```json
{
  "fields": [
    { "key": "headline", "value": "Updated headline text" },
    { "key": "subheadline", "value": "Updated subheadline" }
  ]
}
```

**Response**: `200 OK` with updated section data

### Common Issues

#### Authentication Errors (401/403)
- Check if user is logged in
- Verify JWT token in localStorage
- Ensure user owns the site project

#### API Errors (500)
- Check Django server logs
- Verify section ID exists
- Check database field relationships

#### Preview Not Updating
- Check `previewRefreshKey` state changes
- Verify `handleFieldSave` callback
- Check if RestaurantModernPage re-renders

### Success Criteria

✅ **Three-column layout** renders correctly
✅ **Section selection** shows field editor form  
✅ **Field editing** updates preview in real-time
✅ **Save functionality** persists to backend database
✅ **Error handling** shows appropriate messages
✅ **Authentication** enforces user permissions

---

**Builder v2 Testing Complete!** 🧪✅