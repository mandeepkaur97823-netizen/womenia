@echo off
setlocal enabledelayedexpansion
title WOMANIA - Boutique Management ^& Localhost Launcher
cd /d "%~dp0"

:: Ensure runtime paths are accessible
set "PATH=%USERPROFILE%\.bun\bin;%LOCALAPPDATA%\Programs\nodejs;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%PATH%"

:menu
cls
echo =====================================================================
echo           WOMANIA BOUTIQUE - LOCALHOST CONTROL PANEL
echo   Western, Indo-Western ^& Suits Boutique (Sri Ganganagar, RJ)
echo =====================================================================
echo.
echo   [1] Start Localhost Server (Hot-Reload Dev Mode)
echo   [2] Build ^& Preview Production Server (Optimized)
echo   [3] Open WOMANIA in Default Browser (http://localhost:8080)
echo   [4] Open Admin Dashboard (http://localhost:8080/admin)
echo   [5] Run Health Diagnostics ^& Automated Tests
echo   [6] Create / Refresh Desktop Shortcut
echo   [7] View Localhost Guide ^& Documentation
echo   [8] Exit
echo.
echo =====================================================================
set /p choice="Select an option [1-8]: "

if "%choice%"=="1" goto start_dev
if "%choice%"=="2" goto start_prod
if "%choice%"=="3" goto open_browser
if "%choice%"=="4" goto open_admin
if "%choice%"=="5" goto run_tests
if "%choice%"=="6" goto create_shortcut
if "%choice%"=="7" goto view_guide
if "%choice%"=="8" exit /b 0

echo Invalid choice. Please enter a number between 1 and 8.
ping 127.0.0.1 -n 2 >nul
goto menu

:start_dev
cls
echo [WOMANIA] Starting Localhost Development Server...
call "%~dp0start-localhost.bat"
goto menu

:start_prod
cls
echo [WOMANIA] Building optimized production assets...
where bun >nul 2>&1
if %ERRORLEVEL% equ 0 (
    call bun run build
    if %ERRORLEVEL% equ 0 (
        echo.
        echo [WOMANIA] Production build complete. Starting preview server...
        start "" "http://localhost:8080"
        call bun run preview --port 8080
    )
) else (
    call npm run build
    if %ERRORLEVEL% equ 0 (
        echo.
        echo [WOMANIA] Production build complete. Starting preview server...
        start "" "http://localhost:8080"
        call npm run preview --port 8080
    )
)
pause
goto menu

:open_browser
echo [WOMANIA] Opening http://localhost:8080 in default browser...
start "" "http://localhost:8080"
ping 127.0.0.1 -n 2 >nul
goto menu

:open_admin
echo [WOMANIA] Opening Admin Dashboard (http://localhost:8080/admin)...
echo Super Admin Passcode: 123456789 (Full Ownership)
echo Staff Admin Passcode: 12345678  (Staff Portal)
start "" "http://localhost:8080/admin"
ping 127.0.0.1 -n 3 >nul
goto menu

:run_tests
cls
echo [WOMANIA] Running automated tests and route validations...
echo.
where bun >nul 2>&1
if %ERRORLEVEL% equ 0 (
    call bun run test
) else (
    call npm run test
)
echo.
pause
goto menu

:create_shortcut
cls
echo [WOMANIA] Creating Desktop Shortcut...
call "%~dp0create-desktop-shortcut.bat"
goto menu

:view_guide
cls
if exist "%~dp0LOCALHOST-GUIDE.md" (
    type "%~dp0LOCALHOST-GUIDE.md" | more
) else (
    echo Localhost guide is located in README.md.
)
echo.
pause
goto menu
