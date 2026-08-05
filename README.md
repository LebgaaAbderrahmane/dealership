# Apex Motors Dealership

A dealership SPA built with **React 19 + Vite + TypeScript + Tailwind CSS**, backed by an **Express 5 + MySQL** API and a **shadcn-style admin dashboard**.

- Public site: home, inventory (search/filter/sort), vehicle details, financing (pre-qualify), trade-in estimator, service booking, about, contact, privacy, accessibility.
- All forms submit leads to the API; inventory is served from MySQL.
- Admin area (`/admin`): JWT-protected dashboard to manage vehicles (add/edit/delete) and view/triage leads.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v3, motion (Framer Motion), Radix UI, shadcn-style components, react-router v8 |
| Backend | Express 5, TypeScript (tsx), Zod, mysql2, jsonwebtoken, bcryptjs |
| Database | MySQL 8.4 via Docker Compose |

## Requirements

- Node 20+ (developed on 26)
- pnpm
- Docker (for MySQL)

## Quick start

```bash
pnpm install
pnpm --dir server install

# 1. Start MySQL (first run creates the `apex` database)
pnpm db:up

# 2. Create schema + seed 40 vehicles + seed the admin user
pnpm db:migrate

# 3. Run the API (port 3001) and the SPA (port 5173) in two terminals
pnpm dev:server
pnpm dev
```

Open http://localhost:5173.

### Admin login

- URL: http://localhost:5173/admin
- Default credentials (override via `server/.env`): **admin** / **admin123**

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (port 5173) |
| `pnpm dev:server` | Start the API dev server (port 3001, tsx watch) |
| `pnpm build` | Type-check + production build |
| `pnpm lint` | Oxlint |
| `pnpm db:up` | `docker compose up -d` (MySQL) |
| `pnpm db:migrate` | Run the idempotent schema/seed migration |
| `pnpm seed` | Regenerate `server/seed/vehicles.json` from the DB |

The Vite dev server proxies `/api` → `http://localhost:3001`, so the SPA calls same-origin `/api` paths.

## Project layout

```
server/                 Express API (its own package)
  src/db.ts             mysql2 connection pool
  src/migrate.ts        idempotent schema + seed (vehicles, leads, admins)
  src/app.ts            express app, routes, error handler
  src/routes/
    vehicles.ts         public vehicle endpoints (list/filter/detail/similar/meta)
    leads.ts            POST /api/leads (contact, pre-qualify, service, trade-in)
    auth.ts             POST /api/auth/login, GET /api/auth/me
    admin.ts            auth-guarded vehicle CRUD + leads list/status
  seed/vehicles.json    40-vehicle seed dataset
src/                    React SPA
  lib/api.ts            fetch wrapper for /api
  lib/auth.tsx          admin auth context (JWT in localStorage)
  hooks/useSubmitLead.ts  lead-submission hook (status/error/submit)
  pages/                public pages
  pages/AdminPage.tsx   admin dashboard (vehicles CRUD + leads)
  pages/AdminLoginPage.tsx
  components/shadcn/    shadcn-style primitives (button, input, dialog, …)
```

## API overview

All public routes are unauthenticated; admin routes require `Authorization: Bearer <token>`.

- `GET /api/vehicles` — list with `type`, `make`, `maxPrice`, `maxMonthly`, `q`, `sort`, `page`, `limit`
- `GET /api/vehicles/meta` — facet counts
- `GET /api/vehicles/:id`, `GET /api/vehicles/:id/similar`
- `POST /api/leads` — `kind`: `contact | pre-qualify | service | trade-in`
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/admin/vehicles`, `POST /api/admin/vehicles`, `PUT /api/admin/vehicles/:id`, `DELETE /api/admin/vehicles/:id`
- `POST /api/admin/upload` — multipart field `image` (max 15 MB). Raster images are resized to ≤1920px and converted to WebP (quality 82); SVGs pass through as-is. Returns `{ url: '/uploads/<file>' }`, served statically at `/uploads`.
- `GET /api/admin/leads`, `PATCH /api/admin/leads/:id/status` (`new | contacted | done`)

## Configuration

Copy `server/.env.example` to `server/.env` and adjust as needed:

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `3001` | API port |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `apex` | MySQL user |
| `DB_PASSWORD` | `apex` | MySQL password |
| `DB_NAME` | `apex` | Database name |
| `JWT_SECRET` | `dev-secret` | Signing secret for admin JWTs |
| `ADMIN_USERNAME` | `admin` | Seeded admin username |
| `ADMIN_PASSWORD` | `admin123` | Seeded admin password (bcrypt-hashed) |

Vehicle prices are stored and edited in **USD**; the SPA renders them in DZD (×250).
