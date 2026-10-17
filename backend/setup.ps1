# Portfolio backend — one-command Windows setup
# Requires PHP 8.2+ and Composer 2 (Laravel Herd includes both).
# Usage: cd backend; powershell -ExecutionPolicy Bypass -File .\setup.ps1

$ErrorActionPreference = "Stop"

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
    throw "PHP was not found. Install Laravel Herd, reopen PowerShell, and retry."
}
if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
    throw "Composer was not found. Install Laravel Herd or Composer, reopen PowerShell, and retry."
}

Write-Host "Installing Composer dependencies..." -ForegroundColor Yellow
composer install

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

$envText = Get-Content ".env" -Raw
if ($envText -notmatch "(?m)^APP_KEY=base64:") {
    Write-Host "Generating app key..." -ForegroundColor Yellow
    php artisan key:generate --force
}

if (-not (Test-Path "database\database.sqlite")) {
    Write-Host "Creating SQLite database..." -ForegroundColor Yellow
    New-Item -ItemType File "database\database.sqlite" | Out-Null
}

Write-Host "Linking public storage (for uploads)..." -ForegroundColor Yellow
if (-not (Test-Path "public\storage")) { php artisan storage:link }

Write-Host "Migrating and seeding..." -ForegroundColor Yellow
php artisan migrate --seed --force

Write-Host ""
Write-Host "Admin: http://localhost:8000/admin" -ForegroundColor Green
Write-Host "Login: admin@asifali.dev / password"
Write-Host "API:   http://localhost:8000/api/content"
Write-Host ""

php artisan serve