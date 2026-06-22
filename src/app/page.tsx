import Link from "next/link";
import { listSkills } from "@/lib/skills-fs";
import { SkillBrowser } from "./_components/SkillBrowser";

export default function HomePage() {
  const skills = listSkills();

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

      {skills.length === 0 ? (
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
        <SkillBrowser skills={skills} />
      )}
    </div>
  );
}
