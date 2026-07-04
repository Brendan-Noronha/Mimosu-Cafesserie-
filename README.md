# Mimosu Cafesserie

A productized Meta Ads lead generation agency for real estate businesses — agents, brokerages,
developers, and luxury property companies — that generates qualified buyer and seller leads
through Facebook and Instagram, with AI handling most of the day-to-day marketing operations.

## What's here

**Client Onboarding Portal** (`/onboarding`) — the first piece of the platform. A multi-step form
that collects everything needed to launch a new client's campaigns:

- Business info, services offered, and campaign goals
- Target market and ad budget
- Facebook Page, Instagram, Meta Business Manager ID, Ad Account ID, Pixel ID, website, CRM
- Logo, brand colors, brand guidelines, and previous ad creatives
- An access checklist and signed confirmation

On submit, the record and any uploaded files are saved and an admin notification email is sent.

### Planned next

1. ✅ Client Onboarding Portal
2. Internal Operations Dashboard — clients, campaigns, leads, CRM pipeline, reports
3. Client Dashboard — what clients see: campaigns, spend, leads, appointments, reports
4. Marketing Website — the public pitch (a placeholder home page exists today)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

```bash
cp .env.example .env.local
```

- **Resend API key** — resend.com (free tier works) — for admin notification emails
- **Vercel Blob token** — attach a Blob store to your Vercel project; it's injected
  automatically. Without it, uploads and onboarding records fall back to local disk
  (`.data/` and `public/uploads/`) for local development only — not durable on Vercel.

### 3. Run locally

```bash
npm run dev
```

Visit `/onboarding` to fill out the client onboarding form.

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → import the repo
3. Attach a Vercel Blob store to the project (Storage tab) so `BLOB_READ_WRITE_TOKEN` is set
4. Add the remaining env vars from `.env.example` in the Vercel dashboard
