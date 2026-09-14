# TaskNow

On-demand local services web app (Next.js 14, TypeScript, Tailwind).

## Quick start

```bash
npm install          # install deps (Node 20+)
npm run build        # production build (static 16 pages + 3 API routes)
npm run dev          # dev server on localhost:3000
```

> **Node not on PATH?** Use the portable build at
> `C:\Users\yy\Documents\Default Project\node-v20.18.0-win-x64` and prepend it to
> `PATH` before any npm command.

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values you need.

### Demo mode (zero config)

Leave **all** env vars unset (or delete `.env.local`). Every page renders with
local mock data; auth is simulated; middleware skips route protection.

### Supabase (database + auth + realtime)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API → service role (server only, **never** exposed to client) |

After creating a Supabase project, run the SQL in **`supabase/schema.sql`** in
the SQL Editor (it creates tables, RLS policies, seed data for 5 demo providers,
and a realtime publication for the `messages` table).

### Stripe (paid subscriptions)

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API keys (secret) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API keys (publishable) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → endpoint signing secret |
| `STRIPE_PRICE_FREE / _BASIC / _PRO / _ENTERPRISE` | Stripe Dashboard → Products → Price IDs |

Create products/prices in Stripe, set `STRIPE_WEBHOOK_SECRET` to your webhook
endpoint's signing secret, and point the webhook URL at:

```
POST  /api/webhooks/stripe
```

---

## Database schema (`supabase/schema.sql`)

Creates:

- **profiles** — id, email, display_name, role, phone, avatar_url
- **providers** — category, lat/lng, hourly_rate, rating, bio, etc.
- **bookings** — client, provider, status, schedule, address, cost, etc.
- **messages** — sender, receiver, content (realtime enabled)
- **subscriptions** — user_id, stripe_customer_id, tier, status

Includes an `handle_new_user` trigger (auto-creates a profile row on signup)
and RLS policies scoped to the profile owner.

---

## Route map

```
/                             Landing page
/auth/login                   Sign in (with Google OAuth)
/auth/signup                  Create account
/auth/role-select             Pick client or provider
/auth/callback                OAuth callback (Supabase)

/client/dashboard             Client home + bookings list
/client/book                  Multi-step booking flow (Supabase providers)
/client/tracking              Live GPS tracking (demo)
/client/chat                  Messaging (realtime via Supabase)
/client/profile               Client profile

/provider/dashboard           Provider home
/provider/jobs                Provider bookings / accept jobs
/provider/availability        Weekly schedule (demo)
/provider/earnings            Earnings summary (demo)
/provider/chat                Messaging (realtime via Supabase)
/provider/profile             Provider profile

/pricing                      Subscription plans → Stripe checkout

/api/checkout                 POST — create Stripe Checkout session
/api/webhooks/stripe          POST — Stripe webhook
```

---

## Tech stack

- **Next.js 14** (App Router, static generation for 16 routes)
- **TypeScript** + **Tailwind CSS 3.4** (custom palette: primary `#0F172A`, accent `#10B981`)
- **Supabase** (auth, Postgres, RLS, realtime subscriptions)
- **Stripe** (customer portal / checkout / webhook)
- **Mobiscroll** time-slot picker (used in booking flow)

---

## License

Private project — not currently published.
