# The web gallery

The repo ships an optional Next.js app — a searchable gallery for the skills in
this repo, plus a form that opens a prefilled pull request to add a new one. The
**git repo is the single source of truth**: the app reads `skills/` directly and
has no database. You don't need it to use the library.

## How it works

- **Browse / detail / download** read the repo's `skills/<name>/SKILL.md`
  folders at build time, so the gallery is just a prettier view of the repo.
- **Install** shows the same `curl … | bash` one-liner the README uses — it
  installs from `raw.githubusercontent.com`, so it works even if the app is down.
- **Share a skill** builds a `SKILL.md` from the form and hands off to GitHub's
  "new file" flow against `skills/<slug>/SKILL.md`. The contributor commits and
  opens a PR in their own account — no token or login is stored by the app.

There is no Supabase, no storage bucket, and nothing to keep in sync.

## Stack

Next.js 16 · React 19 · Tailwind v4. No backend services.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. It reads the `skills/` folder beside it.

## Config (only when forking)

Skills install from, and PRs open against, `SamRome1/devrel-skills@main` by
default. To point the app at a fork, set these (see `.env.local.example`):

```
NEXT_PUBLIC_GITHUB_REPO=your-org/your-repo
NEXT_PUBLIC_GITHUB_BRANCH=main
```

## Routes

| Piece | Path |
| --- | --- |
| Browse / search gallery | `/` |
| Open a PR to add a skill | `/upload` |
| Skill detail + install command | `/skills/<slug>` |
| Download install zip | `GET /api/download/<slug>` |

## Deploy

Deploy to Vercel like the team's other Next.js apps. No environment variables
are required unless you're pointing it at a fork. Redeploy (or rebuild) when
skills change so the static gallery picks them up — or wire a deploy hook to the
repo's push.
