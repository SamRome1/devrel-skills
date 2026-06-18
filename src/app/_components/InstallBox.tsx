"use client";

import { useState } from "react";

export function InstallBox({
  command,
  downloadHref,
  slug,
}: {
  command: string;
  downloadHref: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Install</h3>
        <a
          href={downloadHref}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1 text-xs text-dim hover:text-text"
          download={`${slug}.zip`}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download .zip
        </a>
      </div>
      <p className="mb-2 text-xs text-dim">
        Run this in your terminal — it installs into{" "}
        <code>~/.claude/skills</code>:
      </p>
      <div className="flex items-stretch gap-2">
        <code className="flex-1 overflow-x-auto rounded-md border border-border bg-[#14110f] px-3 py-2.5 font-mono text-xs text-text">
          {command}
        </code>
        <button
          onClick={copy}
          className="shrink-0 rounded-md bg-accent px-3 text-xs font-medium text-[#0d0b09] hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-xs text-dimmer">
        Add <code>-s -- --project</code> to install into the current project&apos;s{" "}
        <code>.claude/skills</code> instead.
      </p>
    </div>
  );
}
