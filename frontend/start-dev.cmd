@echo off
echo ========================================
echo Just Code Works - Starting Dev Server
echo ========================================
echo.

cd /d C:\projects\justcodeworks\frontend

echo Checking if port 3000 is available...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo.
    echo WARNING: Port 3000 is already in use!
    echo.
    echo To kill the process using port 3000:
    echo   1. Find the PID: netstat -ano ^| findstr :3000
    echo   2. Kill it: taskkill /PID ^<pid^> /F
    echo.
    echo Or run on a different port: npm run dev -- -p 3001
    echo.
    pause
    exit /b 1
)

echo Port 3000 is available.
echo.
echo Starting development server...
echo.
echo The app will be available at:
echo   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

pause
