# Mimosu Cafesserie

A productized Meta Ads lead generation agency for real estate businesses — agents, brokerages,
developers, and luxury property companies — that generates qualified buyer and seller leads
through Facebook and Instagram, with AI handling most of the day-to-day marketing operations.

## What's here

**Marketing home page** (`/`) — the public pitch, with links to onboarding and client login.

**Client Onboarding Portal** (`/onboarding`) — a multi-step form that collects everything needed
to launch a new client's campaigns: business info, services & goals, target market & budget,
Facebook Page/Instagram/Business Manager/Ad Account/Pixel IDs, brand assets and creative uploads,
and a signed access checklist. Submissions persist via Vercel Blob (local disk fallback for dev)
and trigger an admin notification email.

**Internal Ops Dashboard** (`/dashboard`) — sidebar app covering:

- **Overview** — client/lead counts at a glance
- **Clients** — every onboarded business, with a full detail view
- **Leads** — every lead, AI-qualified hot/warm/cold/spam, plus a manual "add lead" form
- **CRM** — a Kanban board (New → Contacted → Qualified → Appointment → Visit → Negotiation →
  Closed/Lost) with per-lead stage changes
- **Invoices** — create a Razorpay invoice and get a shareable payment link
- **Reports** — lead quality, qualified/appointment rates, and per-client breakdowns (ad spend/CTR
  are honestly marked as pending a Meta Ads Insights API connection)
- **Campaigns** — stubbed until Meta Ads campaign data is connected

**Client Portal** (`/login` → `/client`) — clients log in via an emailed magic link (no password)
and see their own leads and invoices.

**Automation that actually runs:**

- **AI lead qualification** (`lib/leads/qualify.ts`) — every lead (manual or from Meta) is scored
  by Claude (Haiku) into hot/warm/cold/spam with a reason. Falls back to a labeled "warm" default
  if `ANTHROPIC_API_KEY` isn't set — never fabricates a score.
- **Meta Lead Ads webhook** (`/api/webhooks/meta-leads`) — receives leads automatically from a
  connected client's Instant Form, verifies Meta's signature, fetches full lead data via the Graph
  API, and routes it to the right client via the Page ID collected during onboarding.
- **Follow-up automation** (`/api/cron/follow-ups`) — immediate → 5min → 1day → 3day → 7day →
  14day nurture sequence via Resend, driven by a Vercel Cron job (`vercel.json`). Only logs a
  follow-up as sent when the email actually went out.
- **Razorpay payments** — invoice creation, a public Checkout page (`/pay/[id]`), and both a
  client-side verify endpoint and a signature-verified server-to-server webhook for authoritative
  payment confirmation.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

```bash
cp .env.example .env.local
```

See `.env.example` for details on each — every integration below degrades gracefully if its env
vars are missing (features just won't be live), so you can run the app with none configured and
add them incrementally:

| Service | Used for |
|---|---|
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `ADMIN_NOTIFICATION_EMAIL` | Onboarding notifications, lead follow-ups, magic-link login emails |
| `BLOB_READ_WRITE_TOKEN` | Durable storage for onboarding files/records, leads, invoices (attach a Vercel Blob store) |
| `ANTHROPIC_API_KEY` | AI lead qualification |
| `META_APP_SECRET` / `META_WEBHOOK_VERIFY_TOKEN` / `META_ACCESS_TOKEN` | Meta Lead Ads webhook |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | Invoicing & payments |
| `CRON_SECRET` | Authenticates the follow-up cron endpoint |
| `AUTH_SECRET` | Signs client-portal magic-link tokens and sessions (generate with `openssl rand -base64 32`) |

### 3. Run locally

```bash
npm run dev
```

Visit `/onboarding` to submit a client, `/dashboard` for the internal ops view, and `/login` for
the client portal.

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → import the repo
3. Attach a Vercel Blob store to the project (Storage tab) so `BLOB_READ_WRITE_TOKEN` is set
4. Add the remaining env vars from `.env.example` in the Vercel dashboard
5. The `vercel.json` cron job runs every 30 minutes — note the Hobby plan only runs crons once a
   day; use an external scheduler (e.g. cron-job.org) hitting `/api/cron/follow-ups` with the same
   `CRON_SECRET` bearer token for tighter intervals
6. In the Meta App Dashboard, subscribe your Page(s) to the `leadgen` webhook field pointing at
   `/api/webhooks/meta-leads`
7. In the Razorpay Dashboard, add a webhook for `payment.captured` pointing at
   `/api/payments/webhook`
