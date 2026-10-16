# Full frontend + backend audit

Audit date: 2026-10-14

## Executive result

- **Frontend production build:** PASS (`dist/index.html`, one-file build)
- **TypeScript check:** PASS (`npx tsc --noEmit`)
- **Production npm vulnerabilities:** 0
- **Laravel source graph:** PASS (62 PHP source/view/config files; all referenced `App\\…` classes present)
- **Laravel runtime test:** NOT RUN in the sandbox — PHP, Composer and Docker are not installed here

The last limitation is environmental, not hidden: after installing PHP 8.2+
and Composer on your PC, run `python scripts/build.py` to add the real `php -l`
gate, then boot Laravel with `backend/setup.ps1` (Windows) or
`backend/setup.sh` (macOS/Linux/Git Bash).

## Frontend audit

### Passed

- React/Vite production compilation, 461 modules transformed
- TypeScript configuration check
- Dynamic content provider correctly falls back only when the API is absent;
  an intentional empty API section now remains empty
- Dynamic projects, quests, section-01 service cards, tech stack and social
  links all consume one `/api/content` payload
- Project and quest hash routes remain bookmarkable and use browser history
- Contact form posts to Laravel, displays field errors, has a honeypot, locks
  background scroll, and falls back to a mail draft when the API is offline
- Optional case-study video now renders conditionally
- Empty quest and tech-domain arrays no longer crash their sections
- Dead `#` links no longer close detail pages; they display “Coming soon”
- Social links are hidden until real profile URLs exist

### Dependency security

- Runtime/production packages: **0 vulnerabilities**
- Build-only packages: **1 low, 3 high advisories** reported through
  `vite-plugin-singlefile` → `micromatch` / `braces`, plus an esbuild
  development-server advisory. These packages run during local compilation;
  they are not runtime dependencies in `dist/index.html`.
- Vite itself was upgraded to the patched `7.3.7`; single-file plugin was
  upgraded to `2.3.3`. npm currently proposes an incompatible major downgrade
  (`vite-plugin-singlefile@0.9.0`) for the remaining transitive advisories, so
  that force-fix was deliberately not applied.

### Content requiring owner input

- `src/components/Experience.jsx` still contains explicitly marked placeholder
  companies/history. Replace it before publishing.
- Project and side-quest external URLs are placeholders until edited in admin.
- Seeded LinkedIn/GitHub base URLs are unpublished until replaced in admin.

## Backend audit

### Boot completeness repaired

- `artisan`, `public/index.php`, `public/.htaccess`
- `bootstrap/app.php`, `bootstrap/providers.php`, `AppServiceProvider`
- Base `App\\Http\\Controllers\\Controller`
- Writable storage/cache/session/view/log directory placeholders
- Full config: app, auth, cache, CORS, database, filesystems, hashing, logging,
  mail, portfolio, queue, services and session
- Core users, sessions, cache, jobs, job batches and failed-jobs migrations

### Data and API

- `/api/content` returns all published content and caches it for one minute
- Every admin mutation clears the content cache
- `/api/contact` validates length/email, applies 6 req/min throttling, records
  IP, stores the submission, and optionally sends a notification email
- CORS allows the separately served Vite/static front end to access `/api/*`
- Database defaults to zero-configuration SQLite; MySQL/PostgreSQL configs are
  available through environment variables

### Admin panel

- Session authentication with CSRF-protected Blade forms
- CRUD for projects, quests, section-01 cards, stack domains and social links
- Contact inbox: unread count, details, reply link, deletion and pagination
- Draft/published state and numeric order on all content types
- Slug uniqueness, URL validation, valid-JSON enforcement, field limits
- Empty sort order normalizes to zero; unchecked publish boxes persist correctly
- Placeholder social profiles seed as unpublished

### Not runtime-verified here

- Composer dependency installation / `composer audit`
- `php artisan migrate --seed`
- PHP syntax lint (`php -l`)
- Real browser admin login and end-to-end API interaction

These are all covered by the local guide and smoke specs, but require your PC
because the execution sandbox contains Node.js only. Do not interpret this
report as claiming those runtime checks passed here.

## Build evidence

Machine-readable gate output is written to `build-manifest.json`. Browser
smoke specs are in `scripts/smoke/specs/` for both frontend-only and full-system
runs.