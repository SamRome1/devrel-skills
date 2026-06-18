import Link from "next/link";
import { db, type SkillRow } from "@/lib/db";
import { SkillBrowser } from "./_components/SkillBrowser";

export const dynamic = "force-dynamic";

type LoadResult =
  | { ok: true; skills: SkillRow[] }
  | { ok: false; error: string };

async function loadSkills(): Promise<LoadResult> {
  try {
    const { data, error } = await db()
      .from("skills")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { ok: false, error: error.message };
    return { ok: true, skills: (data ?? []) as SkillRow[] };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load skills.",
    };
  }
}

export default async function HomePage() {
  const result = await loadSkills();

  if (!result.ok) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold">Setup needed</h1>
        <p className="mt-2 text-sm text-dim">
          Couldn&apos;t reach Supabase: <code>{result.error}</code>
        </p>
        <p className="mt-3 text-sm text-dim">
          Add <code>SUPABASE_URL</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code>.env.local</code>, then run the SQL in{" "}
          <code>supabase/schema.sql</code>. See the README.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight">
          DevRel Skills Library
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-dim">
          Browse Claude skills shared by the team. Install any skill with one
          command — it drops straight into <code>~/.claude/skills</code> and is
          ready to use.{" "}
          <Link href="/upload" className="text-accent hover:underline">
            Share your own →
          </Link>
        </p>
      </div>

      {result.skills.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface p-10 text-center">
          <p className="text-sm text-dim">No skills yet.</p>
          <Link
            href="/upload"
            className="mt-3 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-[#0d0b09] hover:opacity-90"
          >
            Be the first to share one
          </Link>
        </div>
      ) : (
        <SkillBrowser skills={result.skills} />
      )}
    </div>
  );
}
