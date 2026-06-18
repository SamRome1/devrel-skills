"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "folder" | "zip";

type FileWithPath = File & { webkitRelativePath: string };

export function UploadForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("folder");
  const [author, setAuthor] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ slug: string; version: number } | null>(
    null,
  );

  const folderRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  function onPick() {
    const input = mode === "folder" ? folderRef.current : zipRef.current;
    const files = input?.files ? Array.from(input.files) : [];
    setPicked(
      files.map((f) => (f as FileWithPath).webkitRelativePath || f.name),
    );
    setDone(null);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);

    const form = new FormData();
    form.set("author", author.trim() || "unknown");

    if (mode === "zip") {
      const file = zipRef.current?.files?.[0];
      if (!file) {
        setError("Choose a .zip file first.");
        return;
      }
      form.set("file", file);
    } else {
      const files = folderRef.current?.files
        ? Array.from(folderRef.current.files)
        : [];
      if (files.length === 0) {
        setError("Choose a skill folder first.");
        return;
      }
      const paths: string[] = [];
      for (const f of files) {
        form.append("files", f);
        paths.push((f as FileWithPath).webkitRelativePath || f.name);
      }
      form.set("paths", JSON.stringify(paths));
    }

    setBusy(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Upload failed.");
      } else {
        setDone({ slug: json.slug, version: json.version });
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Your name</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Sam"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-border-strong"
        />
      </div>

      <div>
        <div className="mb-2 inline-flex rounded-md border border-border p-0.5 text-sm">
          {(["folder", "zip"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setPicked([]);
              }}
              className={`rounded px-3 py-1 ${
                mode === m
                  ? "bg-surface-2 text-text"
                  : "text-dim hover:text-text"
              }`}
            >
              {m === "folder" ? "Upload folder" : "Upload .zip"}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-dashed border-border-strong bg-surface p-5">
          {mode === "folder" ? (
            <input
              ref={folderRef}
              type="file"
              onChange={onPick}
              className="block w-full text-sm text-dim file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-text"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ webkitdirectory: "", directory: "", multiple: true } as any)}
            />
          ) : (
            <input
              ref={zipRef}
              type="file"
              accept=".zip"
              onChange={onPick}
              className="block w-full text-sm text-dim file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-text"
            />
          )}
          {picked.length > 0 && (
            <p className="mt-3 text-xs text-dimmer">
              {picked.length} item{picked.length === 1 ? "" : "s"} selected
              {picked.length <= 8 && (
                <>: {picked.map((p) => p.split("/").pop()).join(", ")}</>
              )}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {done && (
        <div className="rounded-md border border-accent/40 bg-accent-soft px-3 py-3 text-sm">
          <p className="text-accent">
            ✓ Uploaded <code>{done.slug}</code> (v{done.version}).
          </p>
          <a
            href={`/skills/${done.slug}`}
            className="mt-1 inline-block text-accent underline"
          >
            View it →
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0d0b09] hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Publish skill"}
      </button>
    </form>
  );
}
