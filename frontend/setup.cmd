@echo off
echo ========================================
echo Just Code Works - Frontend Setup
echo ========================================
echo.

cd /d C:\projects\justcodeworks\frontend

echo Step 1: Installing dependencies...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the development server, run:
echo   start-dev.cmd
echo.
echo Or manually:
echo   cd /d C:\projects\justcodeworks\frontend
echo   npm run dev
echo.
pause
