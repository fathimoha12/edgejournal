# Edge Journal

A premium manual Forex Trade Journal web app built with Next.js, TypeScript, Tailwind CSS, shadcn/ui-style components, Supabase, and Recharts.

## Stack

- Next.js `16.2.9`
- React `19.2.7`
- TypeScript
- Tailwind CSS `4`
- shadcn/ui component conventions
- Supabase Auth and Postgres
- Recharts analytics
- Vercel free-plan ready

## Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL editor.
3. Paste and run `supabase/schema.sql`.
4. In Project Settings, copy the Project URL and anon public key.

The schema includes `profiles`, `trading_accounts`, `strategies`, `trades`, `screenshots`, and `journal_notes`. Row-level security is enabled so users can only access rows where `auth.uid()` matches their own user id.

If you previously ran an older schema version in the same Supabase project, create a fresh project or reset the old enum/table definitions before rerunning this schema.

Trade journal data is stored in the Supabase `public.trades` SQL table. The app does not use cookies or browser storage for adding, editing, deleting, or listing trades.

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Never store broker passwords, broker API secrets, or trading account credentials in this app. Edge Journal is only for manual forex journaling and trade analysis.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Deploy to Vercel free plan

1. Push this project to GitHub.
2. Create a new project on [vercel.com](https://vercel.com).
3. Import the GitHub repo.
4. Add the two Supabase environment variables in Vercel Project Settings.
5. Deploy.

Vercel will give you a free `your-project.vercel.app` domain. You can keep using that domain without buying a custom domain.

## Pages

- `/` landing page
- `/login` Supabase sign in/sign up
- `/dashboard` 3RR objective, TP/SL/BE/Open totals, session totals, price/risk stats, strategy analytics, charts, and heatmap
- `/journal` add/edit/delete trades with multi-strategy selection, default 3RR, calculated R-multiple, 3RR respected flag, screenshot upload/URL, strategy checklist points, overview modal, table, and filters
- `/analytics` pair, strategy, session, result, mistakes, and emotion analysis
- `/settings` profile, trading account settings, currency, and risk preferences
- `/backtesting` backtesting workspace
- `/demo-challenge` free trial / demo challenge workspace
- `/funded-challenge` funded challenge workspace
- `/account-challenge` account challenge workspace

## Personal trading system

Strategies: `KIL`, `LQ`, `IRL to ERL`, `ERL to IRL`, `OF`, `Model #1`, `SMT`, `2SMT`. One trade can now contain multiple strategies at once.

Every trade defaults to a `3` R:R objective. Results are tracked as `TP`, `SL`, `BE`, `Partial`, or `Open`, and trades are marked as respecting 3RR when the R:R is `3` or greater.

## Personalization

The Settings page includes an Appearance section where each trader can choose any accent color with a free color picker and upload a personal logo. The choice is saved in the browser for that user.

## Auth behavior

`/login` uses Supabase Auth. Supabase environment variables and the SQL schema are required before users can save journal data.
