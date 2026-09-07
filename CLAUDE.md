@AGENTS.md

# Tennis @INSEAD

A directory for INSEAD MIM and MBA students to find tennis partners at
their level, across the Fontainebleau and Singapore campuses.

## Core rule: keep this simple

- No in-app chat.
- No calendar sync.
- No matching algorithm.
- No notifications.
- No extra libraries beyond what's already installed.
- Browsing and filtering only. Contact happens off-platform (WhatsApp).

Resist the urge to add features beyond this brief, even ones that seem
obviously useful. If a change isn't browsing, filtering, profile
management, or auth, it's probably out of scope — check with the user
first.

## Stack

- Next.js (App Router, TypeScript, Tailwind CSS v4) — this project is on
  **Next.js 16**, which has breaking changes from earlier versions (see
  `AGENTS.md` / `node_modules/next/dist/docs/`). Notably: `cookies()` and
  `headers()` are async-only, `middleware.ts` is renamed to `proxy.ts`
  (exported function `proxy`), and route/layout `params`/`searchParams`
  are async.
- Supabase: Postgres, Auth (magic link), Row Level Security. Client
  helpers in `lib/supabase/` (`client.ts` for the browser, `server.ts`
  for Server Components/Route Handlers, `proxy.ts` used by the root
  `proxy.ts` to refresh the auth session cookie on every request).
- Deployment target: Vercel (not yet deployed).

## Data model

`supabase/schema.sql` is the source of truth — run it once in the
Supabase SQL editor to provision the project. Two tables:

- **profiles** — one row per user, `id` = `auth.users.id`. Fields:
  `email`, `full_name`, `cohort` (enum: `MIM '28`, `MBA '27J`,
  `MBA '26D`, `Executive MBA`, `Other` — with `cohort_other` free text
  required when `cohort = 'Other'`), `campus` (enum: `Fontainebleau`,
  `Singapore`), `skill_tier` (enum: `Beginner`, `Improver`,
  `Intermediate`, `Advanced`, `Professional/ex-professional`),
  `nationality` (optional text), `years_playing` (optional integer),
  `whatsapp` (optional text), `intensity` (optional enum: `Casual rally`,
  `Competitive match`, `Either`), `bio` (optional text, max 80 chars).
- **availability** — one row per (user, day, time block). Fields:
  `user_id`, `day_of_week`, `time_block` (`morning`/`afternoon`/
  `evening`).

RLS on both tables: public `SELECT` (the directory is browsable without
signing in), authenticated `INSERT`/`UPDATE` only where the row's
`user_id` (or `id` on `profiles`) equals `auth.uid()`. A trigger on
`auth.users` rejects sign-ups whose email isn't `@insead.edu`, as a
database-level backstop to the same check in `app/login/page.tsx`.

## Auth

Magic-link only, restricted to `@insead.edu` addresses, enforced both in
the login form and at the database trigger level (belt and braces).
Callback lands on `app/auth/callback/route.ts`, which exchanges the code
for a session and redirects to `/profile`.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Local development

```bash
npm run dev
```
