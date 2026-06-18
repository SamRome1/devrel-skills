---
name: example-skill
description: A template skill showing the expected structure. Copy this folder to start your own. Use when you need a starting point for a new Skills-Library entry.
tags: [template, example]
---

# Example Skill

This is a template. Copy `skills/example-skill/` to `skills/<your-skill>/`,
rename it, and edit this file.

## What a skill is

A skill is just a folder with a `SKILL.md` at its root. The frontmatter above
is what matters:

- `name` — the skill's name (kebab-case; matches the folder name).
- `description` — one or two sentences. **Start with what it does, then add a
  "Use when…" trigger** so Claude knows when to reach for it. This line is what
  shows up in the library index.
- `tags` — optional, for filtering.

## Body

Everything below the frontmatter is the instructions Claude reads when the
skill is active. Write it like you'd brief a teammate: what to do, the steps,
any gotchas.

## Supporting files

Skills can ship helper files alongside `SKILL.md` (scripts, templates, prompts).
See `scripts/example.sh` in this folder — reference them by relative path from
your instructions.
