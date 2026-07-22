# SmartPOS Live Concurrent launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "          SMARTPOS LAUNCHER CONCURRENT CHANNELS           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$root = Get-Location

# Start NestJS backend api in a new terminal window
Write-Host "Launching NestJS backend API [Port 5000] in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run start:dev"

# Start Next.js frontend client in a new terminal window
Write-Host "Launching Next.js Bootstrap frontend UI [Port 3000] in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "                  SERVERS ENGAGED IN PORTAL!              " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "NestJS Server Status:     http://192.168.200.101:5000" -ForegroundColor Cyan
Write-Host "Next.js Frontend Status:  http://192.168.200.101:3000" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
