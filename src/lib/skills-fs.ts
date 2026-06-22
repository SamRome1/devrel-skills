import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type SkillFile = {
  path: string; // relative to the skill root, e.g. "SKILL.md" or "scripts/run.sh"
  size: number;
};

export type Skill = {
  slug: string; // == folder name
  name: string; // frontmatter `name`, falling back to slug
  description: string;
  tags: string[];
  author?: string; // optional frontmatter `author` (git history is the real record)
  readme: string; // raw SKILL.md text, including frontmatter
  files: SkillFile[];
};

// The repo's skills/ folder is the source of truth. It ships in the deploy
// bundle (see next.config.ts outputFileTracingIncludes), so this resolves both
// in local dev and on Vercel.
const SKILLS_DIR = join(process.cwd(), "skills");

const IGNORED = [/(^|\/)\.DS_Store$/, /(^|\/)__MACOSX(\/|$)/, /(^|\/)\.git(\/|$)/];

function isIgnored(rel: string): boolean {
  return IGNORED.some((re) => re.test(rel));
}

/** Recursively list files under `dir`, returning paths relative to `dir`. */
function walk(dir: string, base = ""): SkillFile[] {
  const out: SkillFile[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const rel = base ? `${base}/${entry}` : entry;
    if (isIgnored(rel)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full, rel));
    } else {
      out.push({ path: rel, size: st.size });
    }
  }
  return out;
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function readSkill(slug: string): Skill | null {
  const dir = join(SKILLS_DIR, slug);
  let readme: string;
  try {
    readme = readFileSync(join(dir, "SKILL.md"), "utf8");
  } catch {
    return null; // a directory without SKILL.md is not a skill
  }
  const { data: fm } = matter(readme);
  const files = walk(dir).sort((a, b) => a.path.localeCompare(b.path));
  return {
    slug,
    name:
      typeof fm.name === "string" && fm.name.trim() ? fm.name.trim() : slug,
    description:
      typeof fm.description === "string" ? fm.description.trim() : "",
    tags: toTags(fm.tags),
    author:
      typeof fm.author === "string" && fm.author.trim()
        ? fm.author.trim()
        : undefined,
    readme,
    files,
  };
}

/** Every skill in the repo, sorted by name. */
export function listSkills(): Skill[] {
  let entries: string[];
  try {
    entries = readdirSync(SKILLS_DIR);
  } catch {
    return [];
  }
  const skills: Skill[] = [];
  for (const name of entries) {
    let isDir = false;
    try {
      isDir = statSync(join(SKILLS_DIR, name)).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    const skill = readSkill(name);
    if (skill) skills.push(skill);
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/** A single skill by slug, or null if it doesn't exist. */
export function getSkill(slug: string): Skill | null {
  // Guard against path traversal — slugs are single folder names.
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  return readSkill(slug);
}

/** Read the raw bytes of one file within a skill (for building the zip). */
export function readSkillFile(slug: string, relPath: string): Uint8Array {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    throw new Error("Invalid skill slug.");
  }
  if (relPath.includes("..")) {
    throw new Error("Invalid file path.");
  }
  return new Uint8Array(readFileSync(join(SKILLS_DIR, slug, relPath)));
}
