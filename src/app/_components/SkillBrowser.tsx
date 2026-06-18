"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SkillRow } from "@/lib/db";

export function SkillBrowser({ skills }: { skills: SkillRow[] }) {
  const [query, setQuery] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [skills]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (activeTag && !s.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [skills, query, activeTag]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills by name, description, author, tag…"
          className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none placeholder:text-dimmer focus:border-border-strong"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-2.5 py-1 text-xs ${
                activeTag === null
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-dim hover:text-text"
              }`}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                className={`rounded-full border px-2.5 py-1 text-xs ${
                  activeTag === t
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-dim hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={`/skills/${s.slug}`}
            className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium tracking-tight group-hover:text-accent">
                {s.name}
              </h2>
              <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-dim">
                v{s.version}
              </span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-sm text-dim">
              {s.description || "No description."}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-dimmer">
              <span>by {s.author}</span>
              <span>
                {s.file_count} file{s.file_count === 1 ? "" : "s"}
              </span>
            </div>
            {s.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {s.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-dim">
          No skills match “{query}”.
        </p>
      )}
    </div>
  );
}
