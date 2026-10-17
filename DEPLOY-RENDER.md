# Deploy the Laravel backend to Render (Aiven MySQL + S3 storage)

Render has no native PHP runtime, so the backend runs as a **Docker** web service
(`backend/Dockerfile`, PHP 8.3 + Apache). On every start it caches config, runs
any new migrations and starts Apache on Render's `$PORT`.

```
Browser ──► Render (Laravel, Docker) ──► Aiven MySQL (SSL)
                     │
                     └──► S3-compatible bucket (uploads: covers, videos, galleries)
```

You need: a GitHub account · Render account · Aiven MySQL (already migrated + seeded) ·
an S3-compatible bucket (step 2).

---

## Step 1 · Push the code to GitHub

Render deploys from your Git repo. From the project folder (`port/`):

```bash
git add .
git commit -m "Uploads, S3 storage, Docker deploy for Render"
git push
```

Make sure **no `.env` file** is committed (`git status` should not list one).

---

## Step 2 · Create the storage bucket (pick ONE)

### Option A — Cloudflare R2 (10 GB free, needs a card on file)
1. https://dash.cloudflare.com → **R2 Object Storage** → activate R2 (adds a payment method; free tier = 10 GB).
2. **Create bucket** → name e.g. `portfolio-media` → Create.
3. Bucket → **Settings** → **Public access** → **R2.dev subdomain** → **Allow Access**.
   Copy the public URL, e.g. `https://pub-1234abcd.r2.dev` → this is `AWS_URL`.
4. R2 overview → **Manage API tokens** → **Create API token** →
   permission **Object Read & Write**, apply to bucket `portfolio-media` → Create.
   Copy **Access Key ID**, **Secret Access Key**, and the **S3 endpoint**
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.

```env
MEDIA_DISK=s3
AWS_ACCESS_KEY_ID=<access key id>
AWS_SECRET_ACCESS_KEY=<secret access key>
AWS_DEFAULT_REGION=auto
AWS_BUCKET=portfolio-media
AWS_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_URL=https://pub-1234abcd.r2.dev
AWS_USE_PATH_STYLE_ENDPOINT=true
```

### Option B — Supabase Storage (1 GB free, no card)
1. https://supabase.com → New project.
2. **Storage** → **New bucket** → name `portfolio-media` → turn **Public bucket ON** → Create.
3. **Storage → Settings → S3 Connection** → enable, note **Endpoint** and **Region** →
   **New access key** → copy Access key ID + Secret.

```env
MEDIA_DISK=s3
AWS_ACCESS_KEY_ID=<access key id>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_DEFAULT_REGION=<region shown, e.g. ap-south-1>
AWS_BUCKET=portfolio-media
AWS_ENDPOINT=https://<project-ref>.storage.supabase.co/storage/v1/s3
AWS_URL=https://<project-ref>.supabase.co/storage/v1/object/public/portfolio-media
AWS_USE_PATH_STYLE_ENDPOINT=true
```

(AWS S3 or Backblaze B2 work too — same variables.)

---

## Step 3 · Collect the Aiven details

Aiven console → your MySQL service → **Overview → Connection information**:

| Aiven field | Env variable |
|---|---|
| Host | `DB_HOST` |
| Port (e.g. 12345) | `DB_PORT` |
| User (`avnadmin`) | `DB_USERNAME` |
| Password | `DB_PASSWORD` |
| Database name (`defaultdb` unless you created another) | `DB_DATABASE` |

Also click **CA certificate → Download** (`ca.pem`). Aiven only accepts SSL
connections, so Render needs this file (step 4.5).

---

## Step 4 · Create the Render web service

Generate an app key on your PC first (copy the whole `base64:...` output):

```bash
cd backend
php artisan key:generate --show
```

Then in https://dashboard.render.com:

1. **+ New** → **Web Service** → **Git Provider / GitHub** → select your repo (`port`).
2. Settings:

   | Field | Value |
   |---|---|
   | Name | e.g. `portfolio-api` (your URL becomes `https://portfolio-api.onrender.com`) |
   | Language | **Docker** |
   | Branch | `main` |
   | Region | the one **closest to your Aiven region** (e.g. Singapore) |
   | Root Directory | `backend` |
   | Dockerfile Path | `./Dockerfile` (auto-filled) |
   | Instance Type | Free (or Starter) |

3. **Environment Variables** → **Add from .env** → paste (fill in your values):

   ```env
   APP_NAME=Portfolio
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:PASTE_FROM_KEY_GENERATE
   APP_URL=https://portfolio-api.onrender.com
   FRONTEND_URL=https://your-frontend-domain
   LOG_CHANNEL=stderr
   LOG_LEVEL=info

   DB_CONNECTION=mysql
   DB_HOST=mysql-xxxxxxx.aivencloud.com
   DB_PORT=12345
   DB_DATABASE=defaultdb
   DB_USERNAME=avnadmin
   DB_PASSWORD=YOUR_AIVEN_PASSWORD
   MYSQL_ATTR_SSL_CA=/etc/secrets/aiven-ca.pem

   SESSION_DRIVER=database
   SESSION_SECURE_COOKIE=true
   CACHE_STORE=database
   QUEUE_CONNECTION=database

   MAIL_MAILER=log
   CONTACT_NOTIFY_EMAIL=you@example.com

   MEDIA_DISK=s3
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_DEFAULT_REGION=auto
   AWS_BUCKET=portfolio-media
   AWS_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   AWS_URL=https://pub-xxxx.r2.dev
   AWS_USE_PATH_STYLE_ENDPOINT=true
   ```

4. **APP_URL must exactly match your Render URL** (shown at the top of the
   service page after creation). If Render added a suffix (e.g.
   `portfolio-api-x1y2.onrender.com`), update `APP_URL` afterwards.

5. **Secret Files** (same Environment section) → **Add Secret File**:
   - Filename: `aiven-ca.pem`
   - Contents: paste the full text of the downloaded `ca.pem`
     (from `-----BEGIN CERTIFICATE-----` to `-----END CERTIFICATE-----`)

   Render mounts it at `/etc/secrets/aiven-ca.pem` (matches `MYSQL_ATTR_SSL_CA`).

6. **Advanced** → **Health Check Path** → `/up`

7. **Deploy Web Service**. The first build takes ~3–6 minutes. Watch the **Logs**; a good start ends with:

   ```
   INFO  Configuration cached successfully.
   INFO  Routes cached successfully.
   INFO  Blade templates cached successfully.
   INFO  Nothing to migrate.
   ... apache2 -D FOREGROUND
   ```

---

## Step 5 · Check it works

| URL | Expected |
|---|---|
| `https://portfolio-api.onrender.com/up` | green "Application up" page |
| `https://portfolio-api.onrender.com/api/content` | JSON with your projects |
| `https://portfolio-api.onrender.com/admin` | login page → sign in |

Upload a test image in **Admin → Projects → Edit** → Save → open `/api/content`:
the `cover` URL should start with your `AWS_URL`.

---

## Step 6 · Change the admin password (important!)

The seeded login (`admin@asifali.dev` / `password`) is public knowledge. On your PC,
with `backend/.env` pointing at **Aiven** (same DB_* values + `MYSQL_ATTR_SSL_CA`
= path to your downloaded `ca.pem`):

```bash
cd backend
php artisan tinker
```
```php
App\Models\User::where('email', 'admin@asifali.dev')->update(['password' => bcrypt('Your-New-Strong-Password')]);
exit
```

(To change the email too: `->update(['email' => 'you@domain.com', 'password' => bcrypt('...')])`.)

---

## Step 7 · Point the frontend at the API

When building/hosting the React site, set:

```env
VITE_API_URL=https://portfolio-api.onrender.com/api
```

then `npm run build` and deploy `dist/index.html` (Netlify, Vercel, Cloudflare Pages,
Render Static Site…). Put that frontend URL into the backend's `FRONTEND_URL`.

---

## Good to know

- **Free plan sleeps** after 15 minutes without traffic; the next request takes
  ~30–60 s to wake it. Uploads are safe (they live in the bucket, not on Render).
  A Starter instance stays awake.
- **Every push to `main` redeploys automatically.** New migrations run on start.
  Set `RUN_MIGRATIONS=false` to disable that.
- **Changing env vars** → *Save, rebuild, and deploy* (config is cached at container start).
- **Don't run the seeder against production** after you've edited content — it resets
  seeded projects to the original text/images.

## Troubleshooting

| Log / symptom | Fix |
|---|---|
| `Connections using insecure transport are prohibited` | Secret file missing or `MYSQL_ATTR_SSL_CA` path wrong — must be `/etc/secrets/aiven-ca.pem` |
| `SQLSTATE[HY000] [2002] Connection timed out` | Wrong `DB_HOST`/`DB_PORT`, or Aiven service powered off / IP allow-list set (Aiven → Allowed IP addresses → allow `0.0.0.0/0`) |
| `Access denied for user 'avnadmin'` | Wrong `DB_PASSWORD` |
| `No application encryption key has been specified` | `APP_KEY` missing — paste the `base64:...` value |
| 500 error, nothing useful in logs | Temporarily set `APP_DEBUG=true`, reproduce, then set it back to `false` |
| Login form "419 Page Expired" | `APP_URL` doesn't match the real URL, or `SESSION_SECURE_COOKIE` not `true` |
| Uploaded image URL 404 / Access Denied | Bucket not public (R2: enable R2.dev subdomain; Supabase: Public bucket) or wrong `AWS_URL` |
| Upload fails with S3 error in logs | Check `AWS_ENDPOINT`, keys, bucket name; token must have **Read & Write** |
| `exec docker/entrypoint.sh: no such file or directory` | Windows line endings — the Dockerfile strips them, but re-commit with `git add --renormalize .` if it persists |

## Troubleshooting: "failed loading cafile stream: /etc/secrets/aiven-ca.pem"

Render secret files are readable by **root only**, while Apache serves requests as `www-data`.
Migrations (run as root) succeed, but every web request returns 500.

`docker/entrypoint.sh` copies the CA to `storage/db-ca.pem` (mode 644) and points
`MYSQL_ATTR_SSL_CA` at the copy before caching config. Keep the env var as
`MYSQL_ATTR_SSL_CA=/etc/secrets/aiven-ca.pem`; the script handles the rest.

If you deploy an older commit without that fix, set **Settings → Docker Command** to
(no quotes — Render passes quote characters through literally):

    sh -c install${IFS}-m${IFS}644${IFS}/etc/secrets/aiven-ca.pem${IFS}/var/www/html/storage/db-ca.pem&&export${IFS}MYSQL_ATTR_SSL_CA=/var/www/html/storage/db-ca.pem&&exec${IFS}/var/www/html/docker/entrypoint.sh
