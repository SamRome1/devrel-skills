import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getSkill, listSkills } from "@/lib/skills-fs";
import { installCommand, skillTreeUrl } from "@/lib/config";
import { InstallBox } from "@/app/_components/InstallBox";

export function generateStaticParams() {
  return listSkills().map((s) => ({ slug: s.slug }));
}

// Strip frontmatter for a cleaner reading view (metadata is shown separately).
function withoutFrontmatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const command = installCommand(skill.slug);
  const downloadHref = `/api/download/${skill.slug}`;

  return (
    <div>
      <Link href="/" className="text-sm text-dim hover:text-text">
        ← All skills
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {skill.name}
          </h1>
          <p className="mt-1 text-sm text-dim">
            <code className="text-dim">/{skill.slug}</code>
            {skill.author && <> · by {skill.author}</>} ·{" "}
            <a
              href={skillTreeUrl(skill.slug)}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>

      {skill.description && (
        <p className="mt-3 max-w-2xl text-[0.95rem] text-text">
          {skill.description}
        </p>
      )}

      {skill.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skill.tags.map((t) => (
            <span
              key={t}
              className="rounded bg-surface-2 px-2 py-0.5 text-xs text-dim"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6">
        <InstallBox
          command={command}
          downloadHref={downloadHref}
          slug={skill.slug}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <article className="prose-skill rounded-lg border border-border bg-surface p-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {withoutFrontmatter(skill.readme) || "_No SKILL.md content._"}
          </ReactMarkdown>
        </article>

        <aside>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-dimmer">
            Files ({skill.files.length})
          </h3>
          <ul className="space-y-1 text-xs">
            {skill.files.map((f) => (
              <li
                key={f.path}
                className="flex items-center justify-between gap-2 rounded border border-border bg-surface px-2 py-1.5 font-mono text-dim"
              >
                <span className="truncate">{f.path}</span>
                <span className="shrink-0 text-dimmer">
                  {formatBytes(f.size)}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
