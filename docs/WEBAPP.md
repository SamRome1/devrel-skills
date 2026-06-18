# Optional web gallery

The repo ships an optional Next.js + Supabase app — a searchable gallery with a
web-based upload form. The git repo is the source of truth; this is a
nice-to-have layer. You don't need it to use the library.

> Note: as built, the web app stores skills in Supabase (a `skills` table + a
> storage bucket) rather than reading the repo's `skills/` folder. If the team
> decides to host the gallery, the natural follow-up is to repoint it at the
> repo (read `skills/` at build time) so the repo stays the single source of
> truth. Until then, treat it as a standalone preview.

## Stack

Next.js 16 · React 19 · Tailwind v4 · `@supabase/supabase-js` (service role,
server-side only).

## Setup

1. **Create / pick a Supabase project** at https://supabase.com/dashboard.
2. **Run the schema** — paste [`supabase/schema.sql`](../supabase/schema.sql)
   into the SQL editor. It creates the `skills` table and a private `skills`
   storage bucket.
3. **Add env vars:**

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Run:**

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000.

## Routes

| Piece | Path |
| --- | --- |
| Browse / search gallery | `/` |
| Web upload | `/upload` |
| Skill detail + install command | `/skills/<slug>` |
| Build install zip on demand | `GET /api/download/<slug>` |
| Install shell script | `GET /api/install/<slug>` |

## Deploy

Deploy to Vercel like the team's other Next.js apps; set `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` in the project environment.
