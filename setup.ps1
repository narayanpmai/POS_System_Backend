# SmartPOS Master Orchestration Setup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         SMARTPOS AUTOMATIC SYSTEM SETUP (2026)           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$rootPath = Get-Location

# 1. Start Docker PostgreSQL Database
Write-Host "`n[1/4] Starting PostgreSQL Service via Docker Compose..." -ForegroundColor Yellow
if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL Database container started successfully." -ForegroundColor Green
    } else {
        Write-Host "Warning: docker-compose failed to start. Ensure Docker Desktop is active." -ForegroundColor Red
    }
} else {
    Write-Host "Warning: docker-compose command not found. If PostgreSQL is running locally, we will proceed." -ForegroundColor Red
}

# 2. Setup Backend dependencies and migrations
Write-Host "`n[2/4] Deploying NestJS API Service Backend..." -ForegroundColor Yellow
Set-Location "$rootPath\backend"
Write-Host "Installing backend packages (npm install)..."
npm install

Write-Host "Running database migrations and prisma generate..."
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 3. Setup Frontend dependencies
Set-Location $rootPath
Write-Host "`n[3/4] Deploying Next.js UI Frontend Service..." -ForegroundColor Yellow
Set-Location "$rootPath\frontend"
Write-Host "Installing frontend packages (npm install)..."
npm install

# 4. Success summary and launch options
Set-Location $rootPath
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "         SMARTPOS SYSTEM SETUP SUCCESSFULLY COMPLETED!     " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "DEFAULT CREDENTIALS FOR ADMIN:" -ForegroundColor Yellow
Write-Host "Email: admin@pos.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host "`nTo start Backend Service:  cd backend; npm run start:dev" -ForegroundColor Cyan
Write-Host "To start Frontend Service: cd frontend; npm run dev" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
