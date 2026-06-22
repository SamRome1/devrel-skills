"use client";

import { useMemo, useState } from "react";
import { newFileUrl } from "@/lib/config";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

// Minimal client-side frontmatter reader so dropping in an existing SKILL.md
// pre-fills the form. Anything we don't recognize stays in the body.
function parseSkillMd(text: string): {
  name?: string;
  description?: string;
  tags?: string;
  body: string;
} {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { body: text.trim() };
  const fm: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    fm[kv[1]] = v;
  }
  const tags = (fm.tags ?? "").replace(/^\[|\]$/g, "");
  return {
    name: fm.name,
    description: fm.description,
    tags,
    body: m[2].trim(),
  };
}

function buildSkillMd(
  slug: string,
  description: string,
  tags: string[],
  body: string,
): string {
  const fm = [`name: ${slug}`, `description: ${description}`];
  if (tags.length) fm.push(`tags: [${tags.join(", ")}]`);
  return `---\n${fm.join("\n")}\n---\n\n${body.trim()}\n`;
}

export function UploadForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [body, setBody] = useState("");

  const slug = useMemo(() => slugify(name), [name]);
  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((t) => slugify(t))
        .filter(Boolean),
    [tagsInput],
  );

  const ready = slug.length > 0 && description.trim().length > 0;

  const prUrl = useMemo(() => {
    if (!ready) return "#";
    return newFileUrl(slug, buildSkillMd(slug, description.trim(), tags, body));
  }, [ready, slug, description, tags, body]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseSkillMd(text);
    if (parsed.name && !name) setName(parsed.name);
    if (parsed.description) setDescription(parsed.description);
    if (parsed.tags) setTagsInput(parsed.tags);
    setBody(parsed.body);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border bg-surface p-3 text-xs text-dim">
        Skills live in the GitHub repo. This form builds your{" "}
        <code>SKILL.md</code> and opens GitHub&apos;s &ldquo;new file&rdquo; flow
        prefilled — review it, commit to a branch, and open a PR. No upload, no
        login here.{" "}
        <span className="text-dimmer">
          Multi-file skills: create the PR here, then add the extra files to the
          same branch on GitHub.
        </span>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Start from an existing <code>SKILL.md</code> (optional)
        </label>
        <input
          type="file"
          accept=".md,text/markdown"
          onChange={onFile}
          className="block w-full text-sm text-dim file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-text"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Skill name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Postgres Migrations"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
        {slug && (
          <p className="mt-1 text-xs text-dimmer">
            Installs as <code>/{slug}</code> · file{" "}
            <code>skills/{slug}/SKILL.md</code>
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What it does, then a 'Use when…' trigger. This shows in the library index."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Tags <span className="text-dimmer">(comma-separated, optional)</span>
        </label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. database, migrations"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          SKILL.md body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          placeholder={
            "The instructions Claude reads when the skill is active. Write it like briefing a teammate: what to do, the steps, any gotchas."
          }
          className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-border-strong"
        />
      </div>

      <a
        href={prUrl}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!ready}
        onClick={(e) => {
          if (!ready) e.preventDefault();
        }}
        className={`inline-block rounded-md px-4 py-2 text-sm font-medium ${
          ready
            ? "bg-accent text-[#0d0b09] hover:opacity-90"
            : "cursor-not-allowed bg-surface-2 text-dimmer"
        }`}
      >
        Open pull request on GitHub →
      </a>
      {!ready && (
        <p className="text-xs text-dimmer">
          Add a name and description to continue.
        </p>
      )}
    </div>
  );
}
