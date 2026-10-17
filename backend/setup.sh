#!/usr/bin/env bash
# ---------------------------------------------------------------
# Portfolio backend — one-command local setup
# Requires: PHP 8.2+, Composer 2.x, ext-sqlite3
# Usage:    cd backend && bash setup.sh
# ---------------------------------------------------------------
set -e

echo "→ Installing dependencies…"
composer install

if [ ! -f .env ]; then
  echo "→ Creating .env…"
  cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
  echo "→ Generating app key…"
  php artisan key:generate --force
fi

if [ ! -f database/database.sqlite ]; then
  echo "→ Creating SQLite database…"
  touch database/database.sqlite
fi

echo "→ Linking public storage (for uploads)…"
php artisan storage:link 2>/dev/null || true

echo "→ Migrating + seeding…"
php artisan migrate --seed --force

echo ""
echo "✓ Admin panel:  http://localhost:8000/admin"
echo "  Login:        admin@asifali.dev / password"
echo "  API:          http://localhost:8000/api/content"
echo ""
echo "Tip: point the React site at the API by adding this to the"
echo "     frontend .env, then rebuild:  VITE_API_URL=http://localhost:8000/api"
echo ""

php artisan serve
