# ============================================================
# start-autism.ps1  —  Module 3 AutismCapture startup script
# Starts: PostgreSQL + EHRbase (Docker) → Vite frontend
# ============================================================

$MODULE_DIR   = Split-Path -Parent $MyInvocation.MyCommand.Path
$FRONTEND_DIR = Join-Path $MODULE_DIR "frontend-autism"
$EHRBASE_URL  = "http://localhost:8082/ehrbase/rest/status"

function Write-Step($msg) { Write-Host "  $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  ! $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "  ✗ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor DarkBlue
Write-Host "  AutismCapture — Module 3 Startup" -ForegroundColor White
Write-Host "══════════════════════════════════════════════" -ForegroundColor DarkBlue
Write-Host ""

# ── 1. Check Docker is running ────────────────────────────────────────────────
Write-Step "Checking Docker..."
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Ok "Docker is running"
} catch {
    Write-Err "Docker is not running. Please start Docker Desktop and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

# ── 2. Check for port conflicts ───────────────────────────────────────────────
Write-Step "Checking ports 8082 and 5434..."
$port8082 = Get-NetTCPConnection -LocalPort 8082 -ErrorAction SilentlyContinue

if ($port8082 -and -not (docker ps --format "{{.Names}}" 2>$null | Select-String "neuro_ehrbase")) {
    Write-Warn "Port 8082 is in use by another process. EHRbase may fail to start."
    Write-Warn "Run: docker ps  to check if a different module is running."
}

# ── 3. Start Docker containers ────────────────────────────────────────────────
Write-Step "Starting Docker containers (neuro_db + neuro_ehrbase)..."
Set-Location $MODULE_DIR
docker-compose up -d 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Err "docker-compose up failed. Check docker-compose.yml or run: docker-compose logs"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Ok "Containers started"

# ── 4. Wait for EHRbase to be ready ──────────────────────────────────────────
Write-Step "Waiting for EHRbase to be ready (up to 90s)..."
$maxWait = 90
$waited  = 0
$ready   = $false

while ($waited -lt $maxWait) {
    try {
        $r = Invoke-WebRequest -Uri $EHRBASE_URL -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 3
    $waited += 3
    Write-Host "    waiting... ${waited}s" -ForegroundColor DarkGray
}

if (-not $ready) {
    Write-Err "EHRbase did not respond within ${maxWait}s."
    Write-Warn "Check logs with: docker logs neuro_ehrbase"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Ok "EHRbase is ready"

# ── 5. Check node_modules ─────────────────────────────────────────────────────
$nm = Join-Path $FRONTEND_DIR "node_modules"
if (-not (Test-Path $nm)) {
    Write-Step "node_modules not found — running npm install..."
    Set-Location $FRONTEND_DIR
    npm install 2>&1 | Out-Null
    Write-Ok "npm install complete"
}

# ── 6. Start Vite dev server in a new window ──────────────────────────────────
Write-Step "Starting AutismCapture frontend..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host 'AutismCapture frontend' -ForegroundColor Cyan; Set-Location '$FRONTEND_DIR'; npm run dev"
)

Start-Sleep -Seconds 3

# ── 7. Open browser ───────────────────────────────────────────────────────────
Write-Step "Opening browser..."
Start-Process "http://localhost:5174"

# ── 8. Summary ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════════" -ForegroundColor DarkGreen
Write-Host "  All services are running" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════" -ForegroundColor DarkGreen
Write-Host ""
Write-Host "  AutismCapture UI  → http://localhost:5174" -ForegroundColor White
Write-Host "  EHRbase status    → http://localhost:8082/ehrbase/rest/status" -ForegroundColor White
Write-Host "  Swagger UI        → http://localhost:8082/ehrbase/swagger-ui/index.html" -ForegroundColor White
Write-Host "  DB (postgres)     → localhost:5434  (user: postgres / postgres)" -ForegroundColor White
Write-Host ""
Write-Host "  To stop:  .\stop-autism.ps1  or  docker-compose down" -ForegroundColor DarkGray
Write-Host ""
