# Portfolio backend — Laravel 12 + Blade admin

Content API and admin panel for the cyborg portfolio front end.

## What it manages

| Section on the site        | Admin screen    | Table              |
| -------------------------- | --------------- | ------------------ |
| 01 — What I build (cards)  | Service cards   | `services`         |
| 02 — Projects + case pages | Projects        | `projects`         |
| 04 — Technology universe   | Stack           | `tech_domains`     |
| 05 — Beyond the brief      | Side quests     | `quests`           |
| Footer / contact links     | Links           | `social_links`     |
| Contact form submissions   | Messages        | `contact_messages` |

## Setup

```bash
cd backend

composer install
cp .env.example .env
php artisan key:generate

# SQLite is the default — create the file, or switch DB_CONNECTION in .env
touch database/database.sqlite

php artisan migrate --seed
php artisan serve
```

Or use the supplied one-command script:

- macOS/Linux/Git Bash: `bash setup.sh`
- Windows PowerShell: `powershell -ExecutionPolicy Bypass -File .\setup.ps1`

- Admin panel → <http://localhost:8000/admin>
- Default login → `admin@asifali.dev` / `password` (change via `ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding, or update the user afterwards)

The seeder loads every project, side quest, service card, stack domain and link
that is currently hard-coded in the front end, so the site looks identical the
moment the API comes online.

## API

| Method | Endpoint       | Purpose                                         |
| ------ | -------------- | ----------------------------------------------- |
| `GET`  | `/api/content` | All published content in one payload (1 min cache) |
| `POST` | `/api/contact` | Store a contact submission (6 req/min per IP)   |

`POST /api/contact` accepts `{ name, email, message }` and an empty `company`
honeypot field. Any admin write clears the content cache automatically.

## Connecting the front end

In the React project root, create `.env`:

```bash
VITE_API_URL=http://localhost:8000/api
```

Then `npm run build`. The front end fetches `/content` on load and **falls back
to its bundled copy** of the content if the API is unreachable — so the site
never breaks when the backend is offline.

## Field formats in the admin

- **Description** — one paragraph per line
- **Stack / Tools** — one entry per line
- **Highlights** — JSON: `[["Pages","36"],["Panels","210+"]]`
- **Gallery** — JSON: `[{"src":"https://…","caption":"…"}]`
- **Links** — JSON: `[{"label":"Watch","href":"https://…"}]`
- **Icon key** — one of `cube, database, mobile, brain, code, sparkles, layers, terminal, chart, shield`

## Deploying

Point the web root at `backend/public`, set `APP_ENV=production`,
`APP_DEBUG=false`, configure a real database and mailer, then:

```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

Set `FRONTEND_URL` to the deployed site and `CONTACT_NOTIFY_EMAIL` to the
address that should receive contact alerts.
