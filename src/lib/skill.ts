import matter from "gray-matter";
import JSZip from "jszip";

export type RawFile = {
  path: string; // raw path as uploaded (may include a leading folder)
  data: Uint8Array;
};

export type NormalizedFile = {
  path: string; // relative to the skill root (SKILL.md lives at the root)
  data: Uint8Array;
};

export type ParsedSkill = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  readme: string; // raw SKILL.md text
  files: NormalizedFile[];
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

const IGNORED = [/(^|\/)\.DS_Store$/, /(^|\/)__MACOSX\//, /(^|\/)\.git\//];

function isIgnored(path: string): boolean {
  return IGNORED.some((re) => re.test(path));
}

/**
 * Expand a single uploaded .zip into its constituent files.
 */
export async function filesFromZip(data: Uint8Array): Promise<RawFile[]> {
  const zip = await JSZip.loadAsync(data);
  const out: RawFile[] = [];
  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    if (isIgnored(entry.name)) continue;
    out.push({ path: entry.name, data: await entry.async("uint8array") });
  }
  return out;
}

/**
 * Build a downloadable .zip whose contents extract to `<slug>/<relpath>`,
 * so unzipping into ~/.claude/skills/ yields ~/.claude/skills/<slug>/SKILL.md.
 */
export async function zipForInstall(
  slug: string,
  files: NormalizedFile[],
): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const f of files) {
    zip.file(`${slug}/${f.path}`, f.data);
  }
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

/**
 * Given a flat list of uploaded files, locate SKILL.md, strip any common
 * top-level folder so SKILL.md sits at the root, parse its frontmatter, and
 * return normalized metadata + files.
 */
export function parseSkill(
  raw: RawFile[],
  opts: { author?: string; slugHint?: string } = {},
): ParsedSkill {
  const files = raw.filter((f) => !isIgnored(f.path) && f.path.trim() !== "");
  if (files.length === 0) {
    throw new Error("No files were uploaded.");
  }

  // Locate SKILL.md (case-insensitive) at the shallowest depth.
  const skillMd = files
    .filter((f) => /(^|\/)SKILL\.md$/i.test(f.path))
    .sort((a, b) => a.path.split("/").length - b.path.split("/").length)[0];

  if (!skillMd) {
    throw new Error(
      "No SKILL.md found. A Claude skill must contain a SKILL.md file at its root.",
    );
  }

  // The skill root is the directory containing SKILL.md.
  const rootPrefix = skillMd.path.replace(/SKILL\.md$/i, "");

  const normalized: NormalizedFile[] = [];
  for (const f of files) {
    if (!f.path.startsWith(rootPrefix)) {
      // File lives outside the skill root — skip stray siblings.
      continue;
    }
    const rel = f.path.slice(rootPrefix.length);
    if (!rel) continue;
    normalized.push({ path: rel, data: f.data });
  }

  const readme = new TextDecoder().decode(skillMd.data);
  const { data: fm } = matter(readme);

  const name =
    typeof fm.name === "string" && fm.name.trim()
      ? fm.name.trim()
      : rootPrefix.replace(/\/$/, "") || opts.slugHint || "untitled-skill";

  const description =
    typeof fm.description === "string" ? fm.description.trim() : "";

  let tags: string[] = [];
  if (Array.isArray(fm.tags)) {
    tags = fm.tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof fm.tags === "string") {
    tags = fm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const slug = slugify(opts.slugHint || name);
  if (!slug) {
    throw new Error("Could not derive a valid slug from the skill name.");
  }

  return { slug, name, description, tags, readme, files: normalized };
}
