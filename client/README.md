# Oaken website

Next.js 14 site for Oaken, plus the admin CMS at `/admin`.

All content — text, products, design cases and **every image** — comes from
the Oaken API. It runs inside the portfolio server (`apps/server` in the
portfolio repo), mounted at `https://api.andreyhuey.dev/api/oaken`. Images are
uploaded through the admin media library; the site ships no content images of
its own.

## Development

```bash
pnpm install
cp .env.example .env
pnpm dev              # http://localhost:3000, admin at /admin
```

`next dev` reads from `NEXT_PUBLIC_LOCAL_HOST_API_URL` (the portfolio server,
`http://localhost:5555`); production builds use `NEXT_PUBLIC_API_URL`
(`https://api.andreyhuey.dev`). Every call goes through `apiUrl()` in
`constants/config.ts`, which adds the `/api/oaken` prefix
(`NEXT_PUBLIC_API_PREFIX`). The API must be reachable at build time because
public pages are pre-rendered.

## How content updates reach the site

Public pages are cached and refreshed every 5 minutes. When an admin saves
anything, the CMS calls `/api/revalidate` (authenticated with the admin's
session), so changes appear immediately.

## Structure

- `app/(site)` — public pages (home, products, design cases, about, contact, legal)
- `app/admin` — CMS (dashboard, catalog, media library, page editors, inbox, settings)
- `components/site` — shared public UI (navbar, footer, page hero, CMS image)
- `components/admin` — CMS building blocks (media picker, form fields, block editor)
- `lib/cms.ts` — server-side data fetching; `lib/admin/*` — admin API client & hooks
