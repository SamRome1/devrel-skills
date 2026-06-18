import { db, SKILLS_BUCKET, type SkillFile } from "./db";
import type { NormalizedFile } from "./skill";

function contentType(path: string): string {
  if (/\.md$/i.test(path)) return "text/markdown; charset=utf-8";
  if (/\.json$/i.test(path)) return "application/json";
  if (/\.(sh|bash)$/i.test(path)) return "text/x-shellscript";
  if (/\.(py)$/i.test(path)) return "text/x-python";
  if (/\.(js|mjs|cjs|ts)$/i.test(path)) return "text/javascript";
  if (/\.(txt)$/i.test(path)) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

/**
 * Remove every object under `<slug>/` so a re-upload starts clean.
 */
export async function clearSkillFiles(slug: string): Promise<void> {
  const supabase = db();
  const { data, error } = await supabase.storage
    .from(SKILLS_BUCKET)
    .list(slug, { limit: 1000 });
  if (error) return; // nothing to clear / bucket empty
  const paths = (data ?? [])
    .filter((o) => o.id !== null)
    .map((o) => `${slug}/${o.name}`);
  if (paths.length) {
    await supabase.storage.from(SKILLS_BUCKET).remove(paths);
  }
}

/**
 * Upload normalized skill files to `<slug>/<relpath>` and return their manifest.
 * NOTE: stores a flat list under the slug prefix (nested paths use "/" keys,
 * which Supabase Storage supports).
 */
export async function uploadSkillFiles(
  slug: string,
  files: NormalizedFile[],
): Promise<SkillFile[]> {
  const supabase = db();
  const manifest: SkillFile[] = [];
  for (const f of files) {
    const key = `${slug}/${f.path}`;
    const { error } = await supabase.storage
      .from(SKILLS_BUCKET)
      .upload(key, f.data, {
        contentType: contentType(f.path),
        upsert: true,
      });
    if (error) {
      throw new Error(`Failed to upload ${f.path}: ${error.message}`);
    }
    manifest.push({ path: f.path, size: f.data.byteLength });
  }
  return manifest;
}

/**
 * Download every file for a skill, returning their bytes keyed by relpath.
 */
export async function downloadSkillFiles(
  slug: string,
  files: SkillFile[],
): Promise<NormalizedFile[]> {
  const supabase = db();
  const out: NormalizedFile[] = [];
  for (const f of files) {
    const { data, error } = await supabase.storage
      .from(SKILLS_BUCKET)
      .download(`${slug}/${f.path}`);
    if (error || !data) {
      throw new Error(`Failed to download ${f.path}: ${error?.message}`);
    }
    out.push({ path: f.path, data: new Uint8Array(await data.arrayBuffer()) });
  }
  return out;
}
