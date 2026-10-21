@echo off
setlocal enabledelayedexpansion
title WOMANIA - Localhost Server
cd /d "%~dp0"

echo.
echo ===================================================
echo          WOMANIA BOUTIQUE - LOCALHOST LAUNCHER
echo ===================================================
echo.

:: Add Bun, Node.js and standard Windows system paths
set "PATH=%USERPROFILE%\.bun\bin;%LOCALAPPDATA%\Programs\nodejs;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%PATH%"

:: 1. Check for Node.js first (starts Vite dev server in ~1.4s on Windows)
where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "RUNNER=node"
    goto check_dependencies
)

:: 2. Check for Bun
where bun >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "RUNNER=bun"
    goto check_dependencies
)

echo [ERROR] Neither Bun nor Node.js was found on your computer.
echo.
echo Please install one of the following to run WOMANIA locally:
echo   - Bun (Recommended, fast): https://bun.sh
echo   - Node.js (v18+):          https://nodejs.org
echo.
pause
exit /b 1

:check_dependencies
if not exist "node_modules\" (
    echo [WOMANIA] Project packages not detected. Installing dependencies...
    if "%RUNNER%"=="bun" (
        bun install
    ) else (
        npm install
    )
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
)

echo [WOMANIA] Starting local server using %RUNNER%...
echo [WOMANIA] NOTE: Keep this window open while using the website.
echo [WOMANIA] Press Ctrl+C in this window at any time to stop the server.
echo.

if "%RUNNER%"=="bun" (
    bun scripts/start-localhost.mjs
) else (
    node scripts/start-localhost.mjs
)

pause

