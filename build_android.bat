@echo off
echo =======================================================
echo   GatiConnect Android Play Store Bundle (.aab) Builder
echo =======================================================
echo.
echo Step 1: Checking Node.js and Google Bubblewrap CLI...
where bubblewrap >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Installing Google Bubblewrap CLI...
    npm install -g @bubblewrap/cli
)

echo.
echo Step 2: Initializing TWA Android Project from Manifest...
call bubblewrap init --manifest=http://localhost:8080/static/manifest.json

echo.
echo Step 3: Building Signed Android App Bundle (.aab)...
call bubblewrap build

echo.
echo =======================================================
echo   BUILD COMPLETED!
echo   Your app-release-bundle.aab is ready for Play Store!
echo =======================================================
pause
