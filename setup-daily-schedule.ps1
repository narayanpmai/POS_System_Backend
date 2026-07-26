# Script to register SmartPOS Daily Backup Task in Windows Task Scheduler
$taskName = "SmartPOS_Daily_Backup"
$scriptPath = "d:\POS_Production\koselighar-backend\backup-db.ps1"

Write-Host "Registering Daily Backup Task in Windows Task Scheduler..." -ForegroundColor Cyan

# Action: Execute PowerShell with scriptPath
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""

# Trigger: Every day at 10:00 PM (22:00)
$trigger = New-ScheduledTaskTrigger -Daily -At "10:00PM"

# Settings: Allow run on demand, wake to run if sleeping
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

try {
    # Register Scheduled Task
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -User "NT AUTHORITY\SYSTEM" -Force | Out-Null
    Write-Host "✅ Task '$taskName' successfully registered to run daily at 10:00 PM!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Could not register with SYSTEM account. Registering for current user..." -ForegroundColor Yellow
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
    Write-Host "✅ Task '$taskName' registered for current user to run daily at 10:00 PM!" -ForegroundColor Green
}
