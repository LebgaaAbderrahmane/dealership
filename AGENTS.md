## Objective
- Add an admin **Dashboard** (overview stats + recent leads) and an editable **Settings** section so the admin can change site content (dealer contact, hours, hero copy/stats, trust strip, social links, footer blurb) from the admin panel.
- Restructured the admin panel into a professional **sidebar layout** (user's explicit request).
- **Do not commit/push until the user approves.**

## Important Details
- Settings persist in MySQL `settings` table; GET `/api/settings` is public, PUT requires admin JWT (from `POST /api/auth/login`, admin/admin123).
- Deep-partial Zod schema on PUT (top-level `.partial()` + per-group `.partial()`; string fields use `str(max)=z.string().max(max)`, only `dealer.name` has `.min(1)`; `trust` is a full-array field, no partial). PUT deep-merges each provided group over stored value via `mergeValue`.
- Critical gotcha: **mysql2 auto-parses JSON columns into JS objects** — `JSON.parse(value)` on an already-parsed object throws. Fixed with `parseStored()` (only parses `typeof value === 'string'`).
- Frontend `useSiteSettings()` hook: cached `GET /api/settings`, falls back to `DEFAULT_SETTINGS` in `src/data/settings.ts` (mirror of server defaults) when API is down.
- Everything for this task is uncommitted; prior tasks are committed+pushed to `main` (latest `f096954` navbar fix; prior `979d4fc` USD revert, `621fd28` images+Home, `74423fa` select/spinner/hero).
- README rewrite request remains deferred by the user.
- Remaining hardcoded copy (About, Reviews, FinalCTA, CtaBand, Privacy/Accessibility legal pages, VehicleDetailPage badges) is OUT of the approved settings scope and intentionally left as-is.
- Servers verified live: API :3001 (tsx watch), Vite :5173, CDP Chrome :9223. Admin token stored in localStorage key `apex_admin_token`.

## Work State
### Completed
- `server/src/settings-defaults.ts` (new): `SETTING_KEYS` + `DEFAULT_SETTINGS` (dealer/hours/hero/trust/social/footer).
- `server/src/migrate.ts`: `settings` table + idempotent seeding (verified "Settings seeded", existing 40 vehicles + admin untouched).
- `server/src/routes/settings.ts` (new): GET public merged; PUT requireAuth deep-partial upsert.
- `server/src/routes/admin.ts`: `GET /stats` → `{ vehicles:{total}, leads:{total,new,contacted,done,byKind}, recent:[5] }`.
- `server/src/app.ts`: settingsRouter registered at `/api/settings`.
- `src/data/settings.ts` (new): `DEFAULT_SETTINGS` + all setting types.
- `src/lib/settings.ts` (new): `useSiteSettings()` hook.
- `src/components/admin/DashboardTab.tsx` (new): stat cards, leads-by-kind bars, recent-5 table, quick actions (navigates tabs via `onNavigate` prop). Exports `AdminTab` type.
- `src/components/admin/SettingsTab.tsx` (new): grouped forms (Dealer, Hours, Hero + 4 stats, Trust + 4 badges, Social, Footer blurb), single Save → PUT, toast.
- `src/pages/AdminPage.tsx`: sidebar layout (desktop sticky aside + mobile top bar/horizontal nav), `Tab = AdminTab`, default `'dashboard'`; VehiclesTab/LeadsTab unchanged.
- Consumers updated to `useSiteSettings()`: `Hero` (eyebrow/subline/stats), `TrustStrip` (4 items + rotating icons), `Footer` (blurb, address, sales hours, license, social links rendered only if non-empty), `ContactPage` (4 cards + success message phone), `Service` (service hours), `ServicePage` (hours split on `·` + phone link).
- `pnpm build` passes (tsc -b + vite, only pre-existing chunk-size warning); `pnpm lint` passes (only pre-existing shadcn/auth warnings).
- CDP verified end-to-end: login → sidebar nav present → Dashboard shows Overview/Vehicles 40/leads 0 → edit Settings phone → save toast → public /contact shows new phone → restore → API back to original. Homepage renders hero eyebrow/stats/subline, 4 trust badges, footer blurb/hours/license from settings.

### Active
- (none — implementation complete)

### Blocked
- (none)

## Next Move
1. Await user approval, then commit + push. Suggested split: one commit for backend settings (server files) and one for the frontend (admin UI + consumers), or a single commit — follow user preference. Do not commit until approved.

## Relevant Files
- `server/src/settings-defaults.ts` (new), `server/src/routes/settings.ts` (new), `server/src/routes/admin.ts`, `server/src/migrate.ts`, `server/src/app.ts`.
- `src/data/settings.ts` (new), `src/lib/settings.ts` (new).
- `src/components/admin/DashboardTab.tsx` (new), `src/components/admin/SettingsTab.tsx` (new).
- `src/pages/AdminPage.tsx` (sidebar layout).
- Consumers: `src/components/Hero.tsx`, `src/components/TrustStrip.tsx`, `src/components/Footer.tsx`, `src/pages/ContactPage.tsx`, `src/components/Service.tsx`, `src/pages/ServicePage.tsx`.
- CDP scripts: `/tmp/opencode/verify-settings.mjs`, `/tmp/opencode/verify-home.mjs`.
