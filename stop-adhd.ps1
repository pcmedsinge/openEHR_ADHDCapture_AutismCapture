# ============================================================
# stop-adhd.ps1  —  Stop Module 3 ADHDCapture containers
# ============================================================

$MODULE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Stopping ADHDCapture containers..." -ForegroundColor Yellow
Set-Location $MODULE_DIR
docker-compose down

Write-Host ""
Write-Host "Containers stopped. Data volume (neuro_db_data) is preserved." -ForegroundColor Green
Write-Host "Run .\start-adhd.ps1 to start again." -ForegroundColor DarkGray
Write-Host ""
