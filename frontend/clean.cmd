@echo off
echo ========================================
echo Just Code Works - Cache Cleanup
echo ========================================
echo.

cd /d C:\projects\justcodeworks\frontend

echo Cleaning Next.js cache and build artifacts...
echo.

call npm run clean

if %errorlevel% neq 0 (
    echo.
    echo npm run clean failed, trying manual cleanup...
    if exist .next rmdir /s /q .next
    if exist .turbo rmdir /s /q .turbo
    if exist node_modules\.cache rmdir /s /q node_modules\.cache
)

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo To reinstall dependencies and start fresh:
echo   npm install
echo   npm run dev
echo.
pause
