## Objective
- Admin **Dashboard** (overview stats + recent leads/orders) and an editable **Settings** section (dealer contact, hours, hero copy/stats, trust strip, social links, footer blurb) from the admin panel. Admin panel uses a **sidebar layout** (user's explicit request).
- Added an online **checkout** (purchase intent, no payment processing) with a dedicated `/checkout/:id` page and a new admin **Orders** tab.
- **Do not commit/push until the user approves.**

## Important Details
- Settings persist in MySQL `settings` table; GET `/api/settings` is public, PUT requires admin JWT (from `POST /api/auth/login`, admin/admin123).
- Deep-partial Zod schema on PUT (top-level `.partial()` + per-group `.partial()`; string fields use `str(max)=z.string().max(max)`, only `dealer.name` has `.min(1)`; `trust` is a full-array field, no partial). PUT deep-merges each provided group over stored value via `mergeValue`.
- Critical gotcha: **mysql2 auto-parses JSON columns into JS objects** — `JSON.parse(value)` on an already-parsed object throws. Fixed with `parseStored()` (only parses `typeof value === 'string'`).
- Checkout: `POST /api/orders` is public, Zod-validated, re-fetches the vehicle for a snapshot (404 if missing), stores `payload` JSON + snapshot fields (vehicle_name/price/image). No payment taken. Admin: `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status` (statuses `new | contacted | closed | cancelled`). `/api/admin/stats` includes `orders:{total,new,contacted,closed,cancelled}` + `recentOrders:[5]`.
- Frontend `useSiteSettings()` hook: cached `GET /api/settings`, falls back to `DEFAULT_SETTINGS` in `src/data/settings.ts` (mirror of server defaults) when API is down.
- Checkout frontend: `useSubmitOrder()` hook (mirrors `useSubmitLead`), `CheckoutPage` at `/checkout/:id` (order summary + Cash/Financing form, financing reveals down payment + term + estimated payment at 6.9% APR), "Buy This Vehicle" CTA on `VehicleDetailPage`.
- Committed+pushed to `main` up to `514efc7` (admin settings feature, 2 commits). **All checkout work is uncommitted.**
- README rewrite request remains deferred by the user.
- Remaining hardcoded copy (About, Reviews, FinalCTA, CtaBand, Privacy/Accessibility legal pages, VehicleDetailPage badges) is OUT of the approved settings scope and intentionally left as-is.
- Servers verified live: API :3001 (tsx watch), Vite :5173, CDP Chrome :9223. Admin token stored in localStorage key `apex_admin_token`.

## Work State
### Completed (checkout task — uncommitted)
- `server/src/migrate.ts`: `orders` table (snapshot + customer + finance + payload + 4-status) — idempotent, migration re-run verified ("Schema ready").
- `server/src/routes/orders.ts` (new): public `POST /api/orders` (201/400/404 verified via curl).
- `server/src/routes/admin.ts`: `GET /orders`, `PATCH /orders/:id/status`, stats extended with `orders` + `recentOrders`.
- `server/src/app.ts`: ordersRouter registered at `/api/orders`.
- `src/types/order.ts` (new): `Order`, `OrderStatus` (4), `STATUS_BADGE`, `ORDER_STATUSES`.
- `src/hooks/useSubmitOrder.ts` (new): returns `{status, error, orderId, submit, reset}`.
- `src/pages/CheckoutPage.tsx` (new): route `/checkout/:id`, order summary + form (name/phone/email/payment-type/notes — no trade-in), FormSuccess on success, not-found state, financing shows down/term/est-monthly. Reads `?down=&term=` query params to prefill financing (from the detail-page calculator).
- `src/components/PaymentCalculator.tsx`: accepts optional `vehicle` — on the vehicle detail page the price is locked to the car (no "Vehicle price" slider) and the CTA is "Continue to Checkout" → `/checkout/:id?down=X&term=Y`; on `/financing` it keeps the price slider and "Get Pre-Qualified" scrolls to `#pre-qualify`.
- `src/pages/VehicleDetailPage.tsx`: full-width **Buy This Vehicle** → `/checkout/:id` above full-width Get Pre-Qualified. **Test Drive button removed** (it only scrolled to the calculator, no real function).
- `src/pages/FinancingPage.tsx`: `#pre-qualify` anchor on the pre-qualify form for the calculator CTA.
- `src/App.tsx`: `/checkout/:id` route added.
- `src/components/admin/OrdersTab.tsx` (new): table + expandable row (notes) + 4-status select, wired into sidebar nav (icon `ShoppingCart`) and `AdminTab` union.
- `src/components/admin/DashboardTab.tsx`: orders stat cards (Orders/New orders), recent-orders table, "Review orders" quick action.
- `pnpm build` passes (tsc -b + vite, only pre-existing chunk-size warning); `pnpm lint` passes (only pre-existing shadcn/auth warnings).
- CDP verified end-to-end: detail → Buy button → checkout → fill form → switch to Financing (down/term/est. monthly appear) → Place Order → "Order #N placed" → admin login → Orders tab shows order + status select → Dashboard shows orders stat + recent order. Test orders cleaned up (orders table back to 0). Refinements verified: no Test Drive button, detail calculator locked to vehicle price with "Continue to Checkout" → `/checkout/:id?down=..&term=..` prefills checkout financing, no trade-in field in the checkout form.

### Active
- (none — implementation complete)

### Blocked
- (none)

## Next Move
1. Await user approval, then commit + push. Suggested split: backend (migrate, orders route, admin routes, app.ts) then frontend (types/hook/CheckoutPage/detail CTA/route/OrdersTab/dashboard wiring). Do not commit until approved.

## Relevant Files
- Backend: `server/src/migrate.ts`, `server/src/routes/orders.ts` (new), `server/src/routes/admin.ts`, `server/src/app.ts`.
- Settings: `server/src/settings-defaults.ts`, `server/src/routes/settings.ts`, `src/data/settings.ts`, `src/lib/settings.ts`, `src/components/admin/SettingsTab.tsx`.
- Admin: `src/pages/AdminPage.tsx` (sidebar), `src/components/admin/DashboardTab.tsx`, `src/components/admin/OrdersTab.tsx` (new).
- Checkout: `src/pages/CheckoutPage.tsx` (new), `src/hooks/useSubmitOrder.ts` (new), `src/types/order.ts` (new), `src/pages/VehicleDetailPage.tsx`, `src/App.tsx`, `src/data/inventory.ts`.
- CDP scripts: `/tmp/opencode/verify-checkout.mjs`, `/tmp/opencode/verify-settings.mjs`, `/tmp/opencode/verify-home.mjs`.
