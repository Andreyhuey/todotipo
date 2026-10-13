# Oaken API

Express + TypeORM API that powers the Oaken website and its admin CMS:
products, categories, design cases, page content, the media library,
contact/quote forms and newsletter sign-ups.

## Setup

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:8000
```

### Database over SSH

The database only listens on the hosting server's localhost, so the API opens
an SSH tunnel on start-up when `SSH_HOST` is set:

```
API -> 127.0.0.1:<random port> -> SSH (SSH_HOST:22) -> DB_REMOTE_HOST:DB_PORT
```

Authenticate with `SSH_PASSWORD` (cPanel password) or, preferably, a key
authorised under cPanel > SSH Access (`SSH_PRIVATE_KEY_PATH`). Set
`SSH_HOST_FINGERPRINT` (`ssh-keygen -lf`, "SHA256:…") to pin the host key.
When the API runs on the hosting server itself, leave `SSH_HOST` empty.

`DB_PORT=5432` selects PostgreSQL, anything else MySQL (override with
`DB_TYPE`). Tables are created/updated automatically (`DB_SYNC=false` to
disable).

### Media storage

Uploads go to the FTP storage host and are served from `FTP_PUBLIC_URL`.
Raster images are resized (max 2400px) and converted to WebP; SVGs that just
wrap a photo are rasterised too. For local development set
`STORAGE_DRIVER=local` to keep files in `./uploads` instead.

## First-time content

```bash
npm run create-admin -- you@example.com "a-strong-password"
npm run import:legacy -- --dry-run   # check what will be imported
npm run import:legacy                # upload ../legacy-assets + create content
```

The import is safe to re-run: files already uploaded are skipped, records are
upserted by slug and settings that already have a value are left alone. Once it
has run against production, `../legacy-assets` can be deleted.

## API overview

| Area | Public | Admin (`Authorization: Bearer <jwt>`) |
| --- | --- | --- |
| Site content | `GET /api/site` | `GET /api/admin/settings`, `PUT /api/admin/settings/:key` |
| Products | `GET /api/products`, `/api/products/:idOrSlug` | CRUD `/api/admin/products`, `PUT …/reorder` |
| Categories | `GET /api/categories` | CRUD `/api/admin/categories` |
| Design cases | `GET /api/design-cases`, `/:idOrSlug` | CRUD `/api/admin/design-cases` |
| Media | — | `GET/POST /api/admin/media`, `PATCH/DELETE /:id`, `GET /:id/usage` |
| Forms | `POST /api/mail`, `/mail/quote-product`, `/mail/subscribe` | `/api/admin/inquiries`, `/api/admin/subscribers` |
| Auth | `POST /api/auth/login` | `GET /api/auth/me`, `PUT /api/auth/password`, `/api/admin/users` |

## Visitor analytics

The public site sends a page view to `POST /api/track` on every navigation
and reports time on page via `POST /api/track/leave` (sendBeacon). The API
records the IP, page, referrer and browser/OS/device, then looks the IP up
with [ipgeolocation.io](https://ipgeolocation.io) (`IP_GEO_LOCATION_CONFIG`)
to add country, region, city, coordinates, timezone and network. Each IP is
looked up once per `IP_GEO_CACHE_DAYS` (default 30) to save API credits. Bots
and `/admin` pages are ignored. Results appear under **Admin > Analytics**.

## Deployment (cPanel Node.js app)

The API runs on the hosting server as a CloudLinux Node.js app:

- **URL:** https://oaken-api.andreyhuey.dev (cPanel subdomain, AutoSSL certificate)
- **App folder:** `~/oaken-api` (outside the web root) — `dist/`, `package.json`, `.env`
- **Runtime:** Node 22 via Passenger; dependencies live in `~/nodevenv/oaken-api/22`

Deploy from this folder with:

```bash
npm run deploy
```

which builds `dist/`, uploads it plus `package.json`, `package-lock.json` and
`production.env` (as `~/oaken-api/.env`, permissions 600) over SFTP, runs
`npm install` through the Node.js selector and restarts the app.

**Configuration** lives in `production.env` here (git-ignored), not in the
cPanel "Environment variables" panel. To change a setting, edit
`production.env` and run `npm run deploy`. Variables set in the cPanel panel
would take precedence over the file, so keep them in one place.

`npm run remote -- "<command>"` runs a command on the server, e.g.
`npm run remote -- "tail -50 ~/oaken-api/stderr.log"`.

### Automatic deploys and pre-push builds

- **Before every push** a git hook (`.githooks/pre-push`) builds whatever the
  push changes — the API and/or the website — and cancels the push if a build
  fails. Enable it once per clone: `git config core.hooksPath .githooks`.
  Bypass in an emergency with `git push --no-verify`.
- **After every push** GitHub Actions (`.github/workflows/api.yml`) type-checks
  and builds the API; pushes to `master` are then deployed with `npm run deploy`
  and verified against `/api/health`. Redeploy manually from the Actions tab
  ("Run workflow").
- The website deploys itself through Vercel's Git integration.

Repository secrets used by the workflow: `PRODUCTION_ENV` (contents of
`production.env`), `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD` (or
`SSH_PRIVATE_KEY`), `SSH_HOST_FINGERPRINT`. Because `PRODUCTION_ENV` is the
deployed config, update that secret whenever you change `production.env`.
