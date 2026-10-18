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
echo Remote: https://github.com/mandeepkaur97823-netizen/womenia
echo Branch: main
echo.

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git was not found in PATH.
    pause
    exit /b 1
)

echo ---------------------------------------------------
echo  [IMPORTANT GITHUB AUTHENTICATION NOTE]
echo  When prompted by Git:
echo    - Username: mandeepkaur97823-netizen
echo    - Password: Paste your GitHub Personal Access Token (PAT)
echo                (Note: characters won't show while pasting)
echo.
echo  If you need a token, create one with 'repo' scope at:
echo  https://github.com/settings/tokens
echo ---------------------------------------------------
echo.
echo Contacting GitHub...

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo  URL: https://github.com/mandeepkaur97823-netizen/womenia
    echo ===================================================
) else (
    echo ===================================================
    echo  [AUTHENTICATION REQUIRED]
    echo  GitHub requires authentication to push to this repository.
    echo.
    echo  Option A: Create a Personal Access Token (PAT) at:
    echo            https://github.com/settings/tokens
    echo            (Scope: repo / contents:write)
    echo            Then paste the token when prompted for Password.
    echo.
    echo  Option B: Run in PowerShell:
    echo            git push https://<YOUR_TOKEN>@github.com/mandeepkaur97823-netizen/womenia.git main
    echo ===================================================
)
echo.
pause
