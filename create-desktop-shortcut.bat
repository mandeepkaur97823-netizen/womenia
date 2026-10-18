@echo off
setlocal
title Create WOMANIA Desktop Shortcut
cd /d "%~dp0"

echo.
echo ===================================================
echo     WOMANIA - CREATE DESKTOP SHORTCUT
echo ===================================================
echo.

set "TARGET_BAT=%~dp0start-localhost.bat"
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\WOMANIA Localhost.lnk"
set "ICON_PATH=%~dp0public\favicon.ico"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = '%TARGET_BAT%'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Launch WOMANIA Localhost Server'; if (Test-Path '%ICON_PATH%') { $s.IconLocation = '%ICON_PATH%' }; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo [SUCCESS] Shortcut created on your Desktop:
    echo   "%SHORTCUT_PATH%"
    echo.
    echo You can now double-click "WOMANIA Localhost" on your Desktop anytime!
) else (
    echo [ERROR] Could not create desktop shortcut. You can directly run start-localhost.bat.
)

echo.
pause
