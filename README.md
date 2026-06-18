# Skills Library

A shared library of [Claude skills](https://docs.claude.com/en/docs/claude-code/skills)
for the Supabase DevRel team. Each skill is a folder under [`skills/`](skills).
Browse them right here on GitHub, and install any of them with one command.

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
web/ (the Next.js app)   ← optional browsable gallery — see below
```

## Optional: the web gallery

This repo also contains a Next.js + Supabase app (the `src/`, `next.config.ts`,
etc. at the root) — a prettier, searchable gallery and web-upload UI. **It's
optional.** The git repo is the source of truth; the web app is a nice-to-have
layer that can be pointed at this repo's `skills/` folder later if the team
wants a hosted index. To run it, see [`docs/WEBAPP.md`](docs/WEBAPP.md).
