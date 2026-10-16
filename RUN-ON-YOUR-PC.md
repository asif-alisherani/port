# Run the whole thing on your PC — step by step

There are **two halves**: a static front end (the portfolio you see) and a
Laravel backend (admin panel + API). You can run **either on its own**
(front end shows fallback content when there's no API) or **both together**
(the site becomes fully editable from `/admin`).

---

## 0 · What you need installed (once)

| Tool | Version | Download / command |
| ---- | ------- | ------------------ |
| Node.js | 20 + | https://nodejs.org (LTS) |
| PHP | 8.2 + | see below |
| Composer | 2.x | https://getcomposer.org/download/ |

### Installing PHP + Composer in one go

- **Windows** — install **Laravel Herd**: https://herd.laravel.com/windows
  (includes PHP 8.3 + Composer, zero config)
- **macOS** — `brew install php composer`
- **Linux** — `sudo apt install php-cli php-mbstring php-xml php-curl php-sqlite3 composer`

Verify after:
```bash
node -v      # v20 or higher
php -v       # 8.2 or higher
composer -V  # 2.x
```

---

## 1 · Run JUST the front end (admin panel not required)

Good for: seeing the portfolio exactly as it is, with its built-in content.

```bash
npm install
npm run dev
```

→ open **http://localhost:5173**

That's it. The site reads `VITE_API_URL`; when it's unset, the site uses the
content bundled with it and the contact form falls back to mail drafts.

For a production preview of the exact file the hosting tier serves:

```bash
npm run build       # creates dist/index.html (single file, everything inlined)
npm run preview     # serves dist/ on http://localhost:4173
```

---

## 2 · Run the backend + admin panel

### Windows PowerShell

```powershell
cd backend
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

### macOS, Linux, or Git Bash on Windows

```bash
cd backend
bash setup.sh
```

`setup.sh` does this for you:

```
composer install
cp .env.example .env        (first run only)
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed  (creates tables + loads ALL current content)
php artisan serve           (http://localhost:8000)
```

Then open:

| URL | What you get |
| --- | ------------ |
| http://localhost:8000/admin | Admin panel (the whole point) |
| http://localhost:8000/login | Sign-in page |
| http://localhost:8000/api/content | Raw JSON the site consumes |

**Default login** → `admin@asifali.dev` / `password`

> Prefer a different login? Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
> `backend/.env` BEFORE the first seed (`php artisan migrate:fresh --seed`),
> or just change the row in the `users` table afterwards.

---

## 3 · Connect the two halves (the dynamic site)

Keep the backend terminal open. Open a **second terminal** at the extracted
project root, then connect and run the front end:

### Windows PowerShell

```powershell
"VITE_API_URL=http://localhost:8000/api" | Set-Content .env
npm install
npm run dev
```

### macOS / Linux / Git Bash

```bash
# at the project ROOT (same folder as package.json)
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm install
npm run dev          # → http://localhost:5173, hot-reloads
```

The front end now fetches `http://localhost:8000/api/content` on load.
Everything you change inside `/admin` shows up on the site after ~1 minute
(the API cache TTL). Edit a project title in the admin → refresh the page.

Open **http://localhost:5173**. **Contact form** submissions now land in
`/admin/messages` (and optionally email you — set `CONTACT_NOTIFY_EMAIL` +
`MAIL_MAILER` in `backend/.env`). Without the API, the form instead opens a
pre-addressed draft in the visitor's default mail app.

---

## 4 · Build gates / verification (optional but recommended)

One command builds the front end and PHP-lints the backend:

```bash
python scripts/build.py
```

Expect:

```
[PASS] frontend npm install
[PASS] frontend vite build
[PASS] production dependency audit
[WARN] build-tool dependency audit
[PASS] backend php -l           (SKIP if PHP isn't on PATH here)
[PASS] dist/index.html exists
[build] PASS ALL — manifest at build-manifest.json
```

The build-tool warning is currently from `vite-plugin-singlefile` and its
glob parser dependencies. They run only while creating `dist/index.html` and
are not included as executable dependencies in the deployed page. Production
dependencies audit at zero vulnerabilities. See `AUDIT-REPORT.md`.

Interactive smokes (Playwright, optional):

```bash
npm i -D @playwright/test && npx playwright install chromium

# frontend-only (no backend needed)
FRONTEND_URL=http://localhost:4173 npx playwright test -c scripts/smoke/playwright.config.js scripts/smoke/specs/smoke-frontend.spec.js

# full system (needs `php artisan serve` running on :8000)
FRONTEND_URL=http://localhost:4173 API_URL=http://localhost:8000 \
npx playwright test -c scripts/smoke/playwright.config.js scripts/smoke/specs/smoke-full-system.spec.js
```

---

## 5 · Troubleshooting

| Symptom | Fix |
| --- | --- |
| `php: command not found` | PHP not installed — see step 0 |
| `composer install` fails on `artisan post-autoload-dump` | You're running a stale copy of the folder — keep `backend/artisan` present (it's included) |
| Blank admin page, 500 error | Run `php artisan key:generate` and ensure `backend/storage` is writable |
| `SQLSTATE: no such table` | `cd backend && php artisan migrate --seed` |
| Site shows old content after admin edits | Cached for 1 min — wait, or `php artisan cache:clear` |
| Admin login says credentials wrong | `php artisan migrate:fresh --seed` re-creates the default admin |
| CORS errors in the browser console | The API already sends `Access-Control-Allow-Origin: *`; ensure you're calling `http://localhost:8000/api` exactly (no trailing slash) |

---

## 6 · Going to production (later)

- Host the backend anywhere PHP lives (Laravel Forge, Railway, a plain VPS,
  shared host with SSH): point the docroot at `backend/public`, run
  `php artisan config:cache route:cache view:cache`.
- Set `APP_ENV=production`, `APP_DEBUG=false`, a real DB, `FRONTEND_URL`,
  `CONTACT_NOTIFY_EMAIL`, and a mail driver.
- Front end: `npm run build` with `VITE_API_URL=https://<your-api-domain>/api`,
  then upload **only `dist/index.html`** to any static host — the whole site
  is one file.

### Before publishing

1. Replace the placeholder Experience companies/copy in
   `src/components/Experience.jsx` with your real employment history.
2. Publish your real LinkedIn/GitHub URLs in `/admin/links`; seeded placeholder
   profiles are hidden by default.
3. Replace the `#` project/quest links in the admin. Until then, the front end
   shows them as “Coming soon” instead of navigating somewhere broken.
4. Change the seeded admin password. The easiest clean-install method is to
   set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run
   `php artisan migrate:fresh --seed` before adding your content.
