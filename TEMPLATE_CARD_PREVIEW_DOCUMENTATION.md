# Template Lab – Template Card Previews

## Overview

Template cards in the admin Template Lab now feature auto-scrolling preview functionality. When users hover over or focus on a template card, the preview image automatically scrolls down to show the full landing-page screenshot, creating an engaging preview experience.

## Features

- **Auto-scroll on hover**: Preview smoothly scrolls down over 6 seconds when card is hovered
- **Keyboard accessibility**: Same scroll animation triggers on keyboard focus (Tab navigation)
- **Smooth animations**: Uses `requestAnimationFrame` for smooth 60fps scrolling
- **Reset on leave**: Quickly returns to top when mouse leaves or focus is lost
- **Fallback handling**: Shows placeholder for missing or failed-to-load images
- **Responsive design**: Works across different screen sizes

## Implementation Details

### Backend (Django)

**Model**: `SiteTemplate` in `sites/models.py`
- `preview_image` (ImageField): For uploaded screenshot files
- `preview_image_url` (URLField): For external/hosted screenshot URLs

**API**: `AdminSiteTemplateSerializer` in `sites/serializers.py` 
- Includes `preview_image` field that prioritizes `preview_image_url` over uploaded files
- Returns full absolute URLs for frontend consumption

### Frontend (Next.js)

**Component**: `TemplatePreviewScroller.tsx`
- Handles auto-scroll animation logic
- Manages hover/focus state and smooth transitions
- Provides accessibility features (ARIA labels, keyboard navigation)
- Graceful fallback for missing images

**Usage**: Integrated into template cards in:
- `/admin/templates/website` (locale-based routing)
- `/admin/templates/website` (admin-based routing)

### Animation Details

- **Scroll Duration**: 6 seconds for full preview scroll
- **Reset Duration**: 0.5 seconds to return to top
- **Easing**: Smooth ease-in-out curve for natural motion
- **State Management**: Prevents animation conflicts and memory leaks

## Template Configuration

Templates with preview images configured:

- **Restaurant Modern** (`restaurant-modern`): Real restaurant website screenshot ✅
- **Auto Garage Modern** (`auto-garage-modern`): Real automotive service website screenshot ✅

**Screenshot Location**: `frontend/public/template-previews/`
- `auto-garage-modern-01.jpg` - Full-height screenshot of auto garage template
- `restaurant-modern-01.jpg` - Full-height screenshot of restaurant template

All template cards now **prioritize** these local screenshots over backend `preview_image` field, ensuring consistent real template previews. The system falls back to backend `preview_image` only if the local screenshot fails to load.

## Adding Preview Images

### For Local Screenshots (Primary Method):
Place full-height screenshot files in `frontend/public/template-previews/` using naming pattern:
```
/template-previews/${template.key}-01.jpg
```
**Note**: This path is automatically constructed from the template's `key` field. Local screenshots are now the primary preview source with intelligent backend fallback.

### For External URLs (Demo/Development):
```python
# Using preview_image_url field
template = SiteTemplate.objects.get(key='template-key')
template.preview_image_url = 'https://example.com/tall-screenshot.jpg'
template.save()
```

### For Uploaded Files (Production):
```python
# Using Django admin or programmatically with preview_image field
# Upload actual screenshot files to media/template_previews/
```

## Tuning Parameters

### Animation Timing
- Scroll duration: Modify `duration = 6000` in `startScrollAnimation()`
- Reset speed: Modify `duration = 500` in `resetScroll()`

### Preview Container
- Height: Adjust `className="h-40"` in template card usage
- Aspect ratio: Modify container CSS classes

### Easing Function
- Custom easing: Modify the easing calculation in animation loop
- Linear/other curves: Replace ease-in-out formula

## Browser Support

- **Modern browsers**: Full functionality with `requestAnimationFrame`
- **Older browsers**: Graceful degradation to static images
- **Accessibility**: Full keyboard navigation and screen reader support

## Performance Considerations

- Images are loaded lazily when cards are rendered
- Animations use `requestAnimationFrame` for optimal performance
- Cleanup prevents memory leaks on component unmount
- Scroll calculations are optimized to avoid layout thrashing

## Testing

Verify the implementation:

1. Start backend: `python manage.py runserver 8000`
2. Start frontend: `npm run dev`
3. Navigate to `/admin/templates/website`
4. Hover over template cards with preview images
5. Test keyboard navigation with Tab key
6. Verify smooth scrolling animation and reset behavior

✅ **Implementation Complete**: Template card hover preview is fully functional across all supported templates.