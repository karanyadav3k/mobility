@echo off
title GatiConnect GitHub Sync
color 0A
echo ========================================================
echo   Pushing GatiConnect Mobility Platform to GitHub...
echo ========================================================
echo.

cd /d "C:\Users\Hp\Desktop\mobility_app"

echo [1/3] Checking Git Status...
git add .
git commit -m "Complete commercial update with all features and admin dashboard"

echo.
echo [2/3] Setting Remote Repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/karanyadav3k/mobility.git

echo.
echo [3/3] Uploading files to GitHub (Branch: main)...
echo.
echo NOTE: If a GitHub login window pops up, please click 'Sign in with your browser'.
echo.
git push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo   SUCCESS! All files uploaded to https://github.com/karanyadav3k/mobility
) else (
    echo   Please check your internet or GitHub sign-in above.
)
echo ========================================================
echo.
pause
