# SmartPOS Database Backup Script
$backupDir = "d:\POS_Production\koselighar-backend\backups"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = "$backupDir\smartpos_backup_$timestamp.sql"

# Credentials based on backend/.env
$env:PGPASSWORD = "password123"
$dbUser = "postgres"
$dbName = "smartpos"
$dbHost = "127.0.0.1"
$dbPort = "5432"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         SMARTPOS DATABASE BACKUP UTILITY                 " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "Starting PostgreSQL Backup for '$dbName' database..." -ForegroundColor Yellow

if (!(Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    Write-Host "Created backups directory: $backupDir" -ForegroundColor DarkGray
}

try {
    # Dynamically find pg_dump path for PostgreSQL 18/17/16/15
    $pgDumpPath = "pg_dump"
    $possiblePaths = @(
        "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe",
        "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe",
        "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
        "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe"
    )
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $pgDumpPath = $path
            break
        }
    }

    Write-Host "Using pg_dump binary at: $pgDumpPath" -ForegroundColor DarkGray
    & $pgDumpPath -U $dbUser -h $dbHost -p $dbPort -f $backupFile $dbName

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup completed successfully!" -ForegroundColor Green
        Write-Host "Backup saved to: $backupFile" -ForegroundColor Cyan

        # Clean up backups older than 14 days
        $daysToKeep = 14
        $limitDate = (Get-Date).AddDays(-$daysToKeep)
        Get-ChildItem -Path $backupDir -Filter "smartpos_backup_*.sql" | Where-Object { $_.CreationTime -lt $limitDate } | Remove-Item -Force
        Write-Host "Cleaned up backups older than $daysToKeep days." -ForegroundColor DarkGray
    } else {
        Write-Host "Backup failed with exit code $LASTEXITCODE." -ForegroundColor Red
        Write-Host "Ensure that PostgreSQL tools (pg_dump) are installed and accessible." -ForegroundColor Red
    }
} catch {
    Write-Host "An error occurred during backup:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host "==========================================================" -ForegroundColor Cyan
