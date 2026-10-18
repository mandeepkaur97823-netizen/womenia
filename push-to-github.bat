@echo off
setlocal
title Push WOMANIA to GitHub
cd /d "%~dp0"

:: Ensure Git is in PATH
set "PATH=C:\Users\DELL\.mingit\cmd;%PATH%"

echo.
echo ===================================================
echo       WOMANIA BOUTIQUE - PUSH TO GITHUB
echo ===================================================
echo Remote: git@github.com:mandeepkaur97823-netizen/womenia.git
echo Branch: main
echo.

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git was not found in PATH.
    pause
    exit /b 1
)

echo Pushing code to GitHub via SSH...
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo  URL: https://github.com/mandeepkaur97823-netizen/womenia
    echo ===================================================
) else (
    echo ===================================================
    echo  [SSH KEY CHECK]
    echo  If this is your first time, make sure you have added your
    echo  SSH public key to your GitHub account:
    echo    https://github.com/settings/ssh/new
    echo ===================================================
)
echo.
pause
