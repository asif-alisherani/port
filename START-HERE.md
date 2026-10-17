# Start here — run the full project locally

## Requirements (install once)
- **Node.js 20+** → https://nodejs.org
- **PHP 8.2+ & Composer** → Windows: https://herd.laravel.com/windows (includes both)
  · macOS: `brew install php composer` · Ubuntu: `sudo apt install php-cli php-mbstring php-xml php-curl php-sqlite3 php-zip unzip composer`

Check: `node -v` · `php -v` · `composer -V`

---

## First time

### Terminal 1 — backend (Laravel admin + API)
**Windows PowerShell**
```powershell
cd port\backend
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```
**macOS / Linux / Git Bash**
```bash
cd port/backend
bash setup.sh
```
Installs packages, creates `.env` + app key, SQLite database, storage link, seeds content, then starts the server. Keep it open.

### Terminal 2 — frontend (React site)
**Windows PowerShell**
```powershell
cd port
"VITE_API_URL=http://localhost:8000/api" | Set-Content .env
npm install
npm run dev
```
**macOS / Linux / Git Bash**
```bash
cd port
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm install
npm run dev
```

---

## Using XAMPP MySQL instead of SQLite

Do this **before** running `setup.ps1` / `setup.sh` (or see "Already set up with SQLite?" below).

1. **XAMPP Control Panel** → click **Start** next to **MySQL** (and **Apache** if you want phpMyAdmin).
2. **Create the database** — either:
   - phpMyAdmin → http://localhost/phpmyadmin → **New** → name `portfolio`, collation `utf8mb4_unicode_ci` → **Create**, or
   - PowerShell: `C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"`
3. **Create `backend\.env`** from the example:
   ```powershell
   cd port\backend
   copy .env.example .env
   ```
4. **Edit `backend\.env`** — replace the database block with:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=portfolio
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   (XAMPP's root has **no password** by default — leave `DB_PASSWORD=` empty unless you set one.)
5. **Run the setup** as normal — it keeps your `.env` and migrates into MySQL:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup.ps1
   ```
   (It also creates an empty `database.sqlite` file — harmless, ignore it.)

### Already set up with SQLite?
Edit `backend\.env` as in step 4, then:
```powershell
cd port\backend
php artisan config:clear
php artisan migrate --seed
php artisan serve
```
Content edited in the SQLite version is **not** copied over — MySQL starts with the original seeded content.

### XAMPP checklist / errors
| Problem | Fix |
|---|---|
| `SQLSTATE[HY000] [2002] No connection could be made` | MySQL isn't started in XAMPP Control Panel (or uses another port → set `DB_PORT`) |
| `Access denied for user 'root'` | Put your MySQL root password in `DB_PASSWORD=` |
| `Unknown database 'portfolio'` | Create it (step 2) |
| `could not find driver` | The PHP you're using lacks `pdo_mysql`. Herd has it. XAMPP's PHP: open `C:\xampp\php\php.ini`, make sure `extension=pdo_mysql` has no `;` in front |
| `Specified key was too long` (error 1071) | Very old MySQL. Update XAMPP (8.x ships MariaDB 10.4+) |
| MySQL won't start (port 3306 busy) | Another MySQL is running — stop it, or change XAMPP's port and `DB_PORT` |

**Using XAMPP's PHP instead of Herd?** It must be **8.2+** (`php -v`). In `C:\xampp\php\php.ini` remove the `;` before
`extension=zip`, `extension=fileinfo`, `extension=pdo_mysql`, `extension=mbstring`, `extension=openssl`, then add
`C:\xampp\php` to your Windows PATH and reopen the terminal. You still run the backend with `php artisan serve`
(Apache isn't needed).

---

## Every time after that
```bash
# (XAMPP users: start MySQL in XAMPP Control Panel first)
# Terminal 1
cd port/backend
php artisan serve

# Terminal 2
cd port
npm run dev
```

---

## Open
| URL | What |
|---|---|
| http://localhost:5173 | Portfolio site |
| http://localhost:8000/admin | Admin panel (login: `admin@asifali.dev` / `password`) |
| http://localhost:8000/api/content | API JSON |

Admin edits appear on the site within ~1 minute (API cache).

## Handy commands (run inside `port/backend`)
| Command | Does |
|---|---|
| `php artisan storage:link` | Fix broken uploaded images (404) |
| `php artisan optimize:clear` | Clear all caches |
| `php artisan migrate:fresh --seed` | ⚠️ Reset database to original content (deletes your edits) |

More detail and troubleshooting: `RUN-ON-YOUR-PC.md`

---

## Deploying
Backend → Render + Aiven MySQL + S3 storage: see **`DEPLOY-RENDER.md`**.
