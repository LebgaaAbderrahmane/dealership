## Objective
- Continue mobile-responsive and design refinements, and replace the home-page TrustStrip with a scrolling **car-brand marquee** (`BrandStrip`) to remove the duplication between the hero stats bar and the trust strip.
- Admin **Dashboard** (overview stats + recent leads/orders) and an editable **Settings** section (dealer contact, hours, hero copy/stats, social links, footer blurb) from the admin panel. Admin panel uses a **sidebar layout** (user's explicit request).
- Added an online **checkout** (purchase intent, no payment processing) with a dedicated `/checkout/:id` page and a new admin **Orders** tab.
- **Do not commit/push until the user confirms.**

## Important Details
- Settings persist in MySQL `settings` table; GET `/api/settings` is public, PUT requires admin JWT (from `POST /api/auth/login`, admin/admin123).
- Deep-partial Zod schema on PUT (top-level `.partial()` + per-group `.partial()`; string fields use `str(max)=z.string().max(max)`, only `dealer.name` has `.min(1)`). PUT deep-merges each provided group over stored value via `mergeValue`.
- **`settings.trust` was fully removed** (type, defaults, schema, admin Settings UI, and DB row) when TrustStrip was replaced by the `BrandStrip` marquee. Remaining setting groups: `dealer, hours, hero, social, footer`.
- Critical gotcha: **mysql2 auto-parses JSON columns into JS objects** — `JSON.parse(value)` on an already-parsed object throws. Fixed with `parseStored()` (only parses `typeof value === 'string'`).
- Checkout: `POST /api/orders` is public, Zod-validated, re-fetches the vehicle for a snapshot (404 if missing), stores `payload` JSON + snapshot fields (vehicle_name/price/image). No payment taken. Admin: `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status` (statuses `new | contacted | closed | cancelled`). `/api/admin/stats` includes `orders:{total,new,contacted,closed,cancelled}` + `recentOrders:[5]`.
- Frontend `useSiteSettings()` hook: cached `GET /api/settings`, falls back to `DEFAULT_SETTINGS` in `src/data/settings.ts` (mirror of server defaults) when API is down.
- Checkout frontend: `useSubmitOrder()` hook (mirrors `useSubmitLead`), `CheckoutPage` at `/checkout/:id` (order summary + Cash/Financing form, financing reveals down payment + term + estimated payment at 6.9% APR), "Buy This Vehicle" CTA on `VehicleDetailPage`.
- Committed+pushed to `main` up to `afce929` (BrandStrip marquee + `settings.trust` removal). **Hero mobile-center/full-width buttons is uncommitted.**
- README rewrite request remains deferred by the user.
- Remaining hardcoded copy (About, Reviews, FinalCTA, CtaBand, Privacy/Accessibility legal pages, VehicleDetailPage badges) is OUT of the approved settings scope and intentionally left as-is.
- Servers verified live: API :3001 (tsx watch), Vite :5173, CDP Chrome :9223. Admin token stored in localStorage key `apex_admin_token`.

## Work State
### Completed (BrandStrip + settings.trust removal — uncommitted)
- `src/components/BrandStrip.tsx` (new): scrolling marquee of 12 real car-brand **logo SVGs** (monochrome, 40px, from CC0 simple-icons paths in `src/data/brandLogos.ts` — BMW, Mercedes-Benz, Audi, Toyota, VW, Hyundai, Kia, Renault, Peugeot, Nissan, Honda, Ford), list doubled for a seamless `translateX(0 → -50%)` loop, static "Our brands" label on desktop, `prefers-reduced-motion` fallback. No hover behavior (animation never pauses, no hover styling).
- `src/index.css`: added `@keyframes marquee` + `.animate-marquee` (32s linear infinite) and removed the now-unused `glow-pulse` (was only used by TrustStrip).
- `src/pages/HomePage.tsx`: `<TrustStrip />` → `<BrandStrip />`.
- `src/components/TrustStrip.tsx`: deleted (removes duplicate "172-point inspection" / "4.8★" items also present in the hero stats bar; no-haggle + 7-day return remain on vehicle detail + checkout).
- `settings.trust` removed end-to-end: `server/src/settings-defaults.ts` (SETTING_KEYS + defaults), `server/src/routes/settings.ts` (trustItemSchema + schema key), `src/data/settings.ts` (TrustItem interface + field + defaults), `src/components/admin/SettingsTab.tsx` (INITIAL_DRAFT, updateTrust, "Trust strip" Section).
- MySQL: `DELETE FROM settings WHERE setting_key='trust'` run (remaining keys: dealer, footer, hero, hours, social).
- `pnpm build` + `pnpm lint` pass.

### Active
- (pending build/lint/CDP verification — see Next Move)

### Blocked
- (none)

## Next Move
1. Run `pnpm build` + `pnpm lint`.
2. CDP-verify live: home page marquee renders + animates (no horizontal page overflow, pause on hover), `/api/settings` no longer returns `trust`, admin Settings tab loads without the trust section.
3. Await user approval, then commit + push (split: backend trust removal, then frontend BrandStrip + trust removal). Do not commit until approved.

## Relevant Files
- BrandStrip: `src/components/BrandStrip.tsx` (new), `src/data/brandLogos.ts` (new, inline SVG paths), `src/pages/HomePage.tsx`, `src/index.css`.
- Backend: `server/src/migrate.ts`, `server/src/routes/orders.ts`, `server/src/routes/admin.ts`, `server/src/app.ts`.
- Settings: `server/src/settings-defaults.ts`, `server/src/routes/settings.ts`, `src/data/settings.ts`, `src/lib/settings.ts`, `src/components/admin/SettingsTab.tsx`.
- Admin: `src/pages/AdminPage.tsx` (sidebar), `src/components/admin/DashboardTab.tsx`, `src/components/admin/OrdersTab.tsx`.
- Checkout: `src/pages/CheckoutPage.tsx`, `src/hooks/useSubmitOrder.ts`, `src/types/order.ts`, `src/pages/VehicleDetailPage.tsx`, `src/App.tsx`, `src/data/inventory.ts`.
- CDP scripts: `/tmp/opencode/verify-checkout.mjs`, `/tmp/opencode/verify-settings.mjs`, `/tmp/opencode/verify-home.mjs`.
