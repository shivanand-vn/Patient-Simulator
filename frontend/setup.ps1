# ==============================================================================
# One-Click Automated Setup Script for AI Patient Simulation Engine (Tauri)
# Run in PowerShell: .\setup.ps1
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AI Patient Simulation Engine - Desktop Environment Setup" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check / Install Rust
Write-Host "`n[1/4] Checking Rust Toolchain..." -ForegroundColor Yellow
$cargoCmd = Get-Command cargo -ErrorAction SilentlyContinue
if (-not $cargoCmd -and -not (Test-Path "$HOME\.cargo\bin\cargo.exe")) {
    Write-Host "Rust not found. Installing Rustup via winget..." -ForegroundColor Green
    winget install Rustlang.Rustup --accept-source-agreements --accept-package-agreements --silent
} else {
    Write-Host "Rust is already installed." -ForegroundColor Green
}

# Add Cargo to current session PATH
$env:Path = "$HOME\.cargo\bin;$env:Path"

# 2. Check Visual Studio C++ Build Tools
Write-Host "`n[2/4] Checking Visual Studio C++ Build Tools..." -ForegroundColor Yellow
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
$hasVCTools = $false
if (Test-Path $vswhere) {
    $vcCheck = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64
    if ($vcCheck) { $hasVCTools = $true }
}

if (-not $hasVCTools) {
    Write-Host "Visual Studio C++ Build Tools not detected." -ForegroundColor Yellow
    Write-Host "Installing Visual Studio 2022 Build Tools (C++ Workload)..." -ForegroundColor Green
    winget install Microsoft.VisualStudio.2022.BuildTools --override "--passive --wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended" --accept-source-agreements --accept-package-agreements
} else {
    Write-Host "Visual Studio C++ Build Tools are already installed." -ForegroundColor Green
}

# 3. Install NPM Dependencies
Write-Host "`n[3/4] Installing Frontend NPM Dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# 4. Ready
Write-Host "`n[4/4] Setup Complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "You can now run the desktop application using:" -ForegroundColor White
Write-Host "  npm run desktop" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
