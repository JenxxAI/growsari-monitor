# GrowSari QA Monitor

A dashboard for the GrowSari Tech QA team to track squad assignments, engineer workload, and testing progress — with Jira and Testpad integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel (frontend + serverless API routes) |
| Integrations | Jira REST API, Testpad API |

## Squads & Projects

| Squad | Projects |
|-------|---------|
| ESERV | 2026 Sprint 1, Sprint 4 |
| FINSERV | Sprint 1, Sprint 2, Sprint 3, Sprint 4 |
| INFRASTRUCTURE | Store Network, Common Service, GrowCube, Mobile Platform, 1WS |
| OPS | LM & BH, PSP App, Supply Grow & MS |
| STORE APP RELEASE | Tech Debt, Sprint 1, Sprint 2 |
| STORE FRONTS | Ecommerce, Web & Merchant Admin |

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase + Jira + Testpad credentials

# 3. Start the dev server
npm run dev
# → http://localhost:3000
```

## Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `test123` | Manager (full access) |
| `qa.you` | `test123` | QA Engineer — OPS squad |

All other QA accounts also use password `test123`.

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Run the SQL — this creates tables, RLS policies, and seed data
4. Copy your **Project URL** and **anon public key** into `.env.local`

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables
# Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
#      JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN,
#      TESTPAD_BASE_URL, TESTPAD_API_KEY
```

## API Routes

| Route | Description |
|-------|-------------|
| `GET /api/jira/tickets` | Proxy to Jira REST API. Accepts `?jql=` query param. |
| `GET /api/testpad/runs` | Proxy to Testpad API. Accepts `?projectId=` query param. |

> **Note:** Without real API credentials, the app displays mock data so you can demo the UI immediately.

## Features

- **Overview Tab** — Squad cards with all members, their status (Active / Available / Busy / On Leave), assigned projects, current task, and capacity bar
- **Jira & Testpad Tab** — Live ticket table and test run progress bars; configurable base URLs
- **Manage Accounts Tab** *(manager only)* — Add, edit, or remove QA engineers; filter by squad
- **Search** — Filter across squads, members, and projects on the Overview tab
- **Responsive** — Works on desktop and tablet

## Project Structure

```
growsari-qa-monitor/
├── api/
│   ├── jira/tickets.ts       # Vercel serverless — Jira proxy
│   └── testpad/runs.ts       # Vercel serverless — Testpad proxy
├── src/
│   ├── components/
│   │   └── Layout.tsx        # Sidebar + nav shell
│   ├── hooks/
│   │   └── useAuth.tsx       # Auth context (demo + Supabase-ready)
│   ├── lib/
│   │   ├── data.ts           # Mock data, squad config, credentials
│   │   └── supabase.ts       # Supabase client
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── OverviewPage.tsx
│   │   ├── IntegrationsPage.tsx
│   │   └── ManagePage.tsx
│   ├── types/index.ts        # TypeScript types
│   ├── App.tsx               # Route definitions
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + Tailwind
├── supabase/
│   └── schema.sql            # DB schema + RLS + seed data
├── .env.local.example        # Environment variable template
├── vercel.json               # Vercel rewrite rules
└── README.md
```

## Connecting Real Jira

1. Generate an API token at https://id.atlassian.com/manage-profile/security/api-tokens
2. Add `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` to your environment
3. In `IntegrationsPage.tsx`, change the fetch call from mock data to:
   ```ts
   const res = await fetch('/api/jira/tickets?jql=project in (OPS) ORDER BY updated DESC')
   const { tickets } = await res.json()
   ```

## Connecting Real Testpad

1. Find your API key in Testpad → Settings → API Access
2. Add `TESTPAD_BASE_URL` and `TESTPAD_API_KEY` to your environment
3. In `IntegrationsPage.tsx`, change the fetch call to:
   ```ts
   const res = await fetch('/api/testpad/runs')
   const { runs } = await res.json()
   ```
