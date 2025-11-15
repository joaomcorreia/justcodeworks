@echo off
REM Test Website Type Pages with Editors
REM This script provides URLs to test all newly editable website type pages

echo ========================================
echo Testing Website Type Pages with Editors
echo ========================================
echo.
echo All pages now have editable content via the sidebar editor.
echo Click the "View mode" button in the header to toggle edit mode.
echo.
echo Page URLs (assuming dev server on http://localhost:3000):
echo.
echo 1. Multi-page Websites:
echo    http://localhost:3000/en/websites/multi-page-websites
echo.
echo 2. Online Shops:
echo    http://localhost:3000/en/websites/online-shops
echo.
echo 3. Custom Websites:
echo    http://localhost:3000/en/websites/custom-websites
echo.
echo Previously completed editable pages:
echo.
echo 4. Homepage (9 sections + particles):
echo    http://localhost:3000/en
echo.
echo 5. Websites Overview (4 sections):
echo    http://localhost:3000/en/websites
echo.
echo 6. One Page Websites (4 sections):
echo    http://localhost:3000/en/websites/one-page-websites
echo.
echo ========================================
echo LocalStorage Keys Used:
echo ========================================
echo - jcw_homepage_config_v1
echo - jcw_websites_page_config_v1
echo - jcw_onepage_website_config_v1
echo - jcw_multipage_website_config_v1
echo - jcw_store_page_config_v1
echo - jcw_custom_website_page_config_v1
echo - jcw_homepage_edit_mode
echo.
echo ========================================
echo How to Test:
echo ========================================
echo 1. Start dev server: cd /d C:\projects\justcodeworks\frontend
echo    Then run: npm run dev
echo.
echo 2. Visit any URL above
echo 3. Click "View mode" in header to enable editing
echo 4. Editor sidebar appears on right with section selector
echo 5. Edit any field and see changes live
echo 6. Refresh page - changes persist (localStorage)
echo 7. Click "Reset to defaults" to restore original content
echo.
pause
