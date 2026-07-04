Write-Host "=== The Admin Key - CTF Setup ===" -ForegroundColor Cyan

$nodeCheck = Get-Command "node" -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "[!] Node.js not found. Install it from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "[*] Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "[*] Starting CTF server..." -ForegroundColor Green
Write-Host "[*] Open http://localhost:3000 in your browser" -ForegroundColor Green
npm start
