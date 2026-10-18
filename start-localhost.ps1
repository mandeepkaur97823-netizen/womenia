# WOMANIA Localhost Server Launcher (PowerShell)
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$env:PATH = "$env:USERPROFILE\.bun\bin;$env:LOCALAPPDATA\Programs\nodejs;C:\Program Files\nodejs;$env:PATH"

Write-Host ""
Write-Host "=================================================" -ForegroundColor DarkYellow
Write-Host "         WOMANIA BOUTIQUE - LOCALHOST SERVER     " -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor DarkYellow
Write-Host ""

$hasBun = Get-Command bun -ErrorAction SilentlyContinue
$hasNode = Get-Command node -ErrorAction SilentlyContinue

if ($hasBun) {
    $runner = "bun"
} elseif ($hasNode) {
    $runner = "node"
} else {
    Write-Host "[ERROR] Neither Bun nor Node.js was found in PATH." -ForegroundColor Red
    Write-Host "Please install Bun (https://bun.sh) or Node.js (https://nodejs.org)." -ForegroundColor Yellow
    Pause
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "[WOMANIA] Installing dependencies..." -ForegroundColor Cyan
    if ($runner -eq "bun") { bun install } else { npm install }
}

Write-Host "[WOMANIA] Launching local server with $runner..." -ForegroundColor Green
Write-Host "[WOMANIA] Press Ctrl+C at any time to stop the server.`n" -ForegroundColor Gray

if ($runner -eq "bun") {
    bun scripts/start-localhost.mjs
} else {
    node scripts/start-localhost.mjs
}
