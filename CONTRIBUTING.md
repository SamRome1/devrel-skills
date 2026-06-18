# Contributing a skill

A skill is just a folder with a `SKILL.md` at its root. Adding one is a normal
git contribution.

## Add your skill

1. Copy the template:

   ```bash
   cp -R skills/example-skill skills/my-skill
   ```

   (Or copy a skill straight from your machine: `cp -R ~/.claude/skills/my-skill skills/`.)

2. Edit `skills/my-skill/SKILL.md`. The frontmatter drives the library index:

   ```yaml
   ---
   name: my-skill
   description: What it does, then a "Use when…" trigger. This shows in the index.
   tags: [optional, tags]
   ---
   ```

3. (Optional) Regenerate the README index locally to preview it:

   ```bash
   node scripts/gen-index.mjs
   ```

   You don't have to — a GitHub Action regenerates it automatically on push to
   `main`.

4. Open a PR (or push, depending on the team's workflow). Reviewers see your
   skill as a normal diff.

## Conventions

- **Folder name == `name` frontmatter**, both kebab-case.
- Keep `SKILL.md` focused; bundle helper scripts/templates in the same folder
  and reference them by relative path.
- Don't commit secrets — skills are public in this repo.
