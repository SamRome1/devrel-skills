# Skills Library

A shared library of [Claude skills](https://docs.claude.com/en/docs/claude-code/skills)
for the Supabase DevRel team. Each skill is a folder under [`skills/`](skills).
Browse them right here on GitHub, and install any of them with one command.

**🔎 Browse the gallery → [devrel-skills.vercel.app](https://devrel-skills.vercel.app/)** —
a searchable view of every skill, with copy-paste install commands and a form to
share your own. (The repo is the source of truth; the gallery reads from it.)

## Install a skill

**Without cloning** (this repo is public):

```bash
curl -fsSL https://raw.githubusercontent.com/SamRome1/devrel-skills/main/install.sh | bash -s -- <skill>
```

**From a clone** (recommended if you want a `git pull` to keep skills updated —
clone mode symlinks them, so updates propagate):

```bash
git clone https://github.com/SamRome1/devrel-skills.git
cd devrel-skills
./install.sh <skill>          # e.g. ./install.sh example-skill
./install.sh --list           # see what's available
```

Skills install into `~/.claude/skills/<skill>/`. Add `--project` to install into
the current project's `./.claude/skills` instead. Restart Claude Code afterward
so it picks them up.

## Available skills

<!-- SKILLS:START -->
**1 skill**

| Skill | Description | Install |
| --- | --- | --- |
| [`example-skill`](skills/example-skill) | A template skill showing the expected structure. Copy this folder to start your own. Use when you need a starting point for a new Skills-Library entry. | `./install.sh example-skill` |
<!-- SKILLS:END -->

The table above is generated from each skill's `SKILL.md` frontmatter by a
GitHub Action on every push to `main`.

## Share your own skill

It's a normal git contribution — copy the template, edit `SKILL.md`, open a PR.
See [CONTRIBUTING.md](CONTRIBUTING.md).

## Repo layout

```
skills/<name>/SKILL.md   ← a skill (plus any supporting files)
install.sh               ← installer (clone mode + curl mode)
scripts/gen-index.mjs    ← regenerates the table above from frontmatter
.github/workflows/       ← runs the index generator on push
src/, next.config.ts …   ← the optional Next.js gallery (reads skills/) — see below
```

## The web gallery

Live at **[devrel-skills.vercel.app](https://devrel-skills.vercel.app/)** — a
searchable gallery with a web form that opens a prefilled PR to add a skill.
It reads this repo's `skills/` folder directly, so the git repo stays the single
source of truth (no database to keep in sync), and it redeploys automatically on
every push to `main`. The site is optional — everything works from the repo and
the installer alone. To run or tweak it locally, see [`docs/WEBAPP.md`](docs/WEBAPP.md).
