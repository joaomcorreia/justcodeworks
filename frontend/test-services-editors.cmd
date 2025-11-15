@echo off
REM Test Services Pages with Editors
REM This script provides URLs to test all newly editable services pages

echo ========================================
echo Testing Services Pages with Editors
echo ========================================
echo.
echo All services pages now have editable content via the sidebar editor.
echo Click the "View mode" button in the header to toggle edit mode.
echo.
echo Page URLs (assuming dev server on http://localhost:3000):
echo.
echo 1. Services Overview:
echo    http://localhost:3000/en/services
echo.
echo 2. Search Engine Optimization (SEO):
echo    http://localhost:3000/en/services/search-engine-optimization
echo.
echo 3. Social Media:
echo    http://localhost:3000/en/services/social-media
echo.
echo 4. Website Upgrades:
echo    http://localhost:3000/en/services/website-upgrades
echo.
echo ========================================
echo LocalStorage Keys Used:
echo ========================================
echo - jcw_services_page_config_v1
echo - jcw_seo_service_config_v1
echo - jcw_social_service_config_v1
echo - jcw_upgrades_service_config_v1
echo.
echo ========================================
echo Complete Editable Site Coverage:
echo ========================================
echo.
echo Homepage (9 sections + particles)
echo   http://localhost:3000/en
echo.
echo Websites Section (5 pages, 20 sections total):
echo   - Overview: http://localhost:3000/en/websites
echo   - One Page: http://localhost:3000/en/websites/one-page-websites
echo   - Multi-page: http://localhost:3000/en/websites/multi-page-websites
echo   - Online Shops: http://localhost:3000/en/websites/online-shops
echo   - Custom: http://localhost:3000/en/websites/custom-websites
echo.
echo Services Section (4 pages, 14 sections total):
echo   - Overview: http://localhost:3000/en/services
echo   - SEO: http://localhost:3000/en/services/search-engine-optimization
echo   - Social: http://localhost:3000/en/services/social-media
echo   - Upgrades: http://localhost:3000/en/services/website-upgrades
echo.
echo Total: 10 editable pages with 43 sections!
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
echo 7. Click "Reset" to restore original content
echo.
pause
