/**
 * Single place that knows which GitHub repo backs this library.
 *
 * The repo's `skills/` folder is the source of truth: the gallery reads from it,
 * the install command points at its `install.sh`, and the upload flow opens a PR
 * against it. Override via env when forking.
 */
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO?.trim() || "SamRome1/devrel-skills";
const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH?.trim() || "main";

export const githubRepo = REPO; // "owner/name"
export const githubBranch = BRANCH;

/** Raw URL of a file at the repo root, e.g. install.sh. */
export function rawUrl(path: string): string {
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
}

/** The one-line curl installer for a skill (works without the web app running). */
export function installCommand(slug: string): string {
  return `curl -fsSL ${rawUrl("install.sh")} | bash -s -- ${slug}`;
}

/** Browse a skill's folder on GitHub. */
export function skillTreeUrl(slug: string): string {
  return `https://github.com/${REPO}/tree/${BRANCH}/skills/${slug}`;
}

/**
 * GitHub's prefilled "new file" flow. Dropping the user here lets them commit a
 * new skill and open a PR in their own account — no server-side token needed.
 */
export function newFileUrl(slug: string, contents: string): string {
  const filename = `skills/${slug}/SKILL.md`;
  const params = new URLSearchParams({ filename, value: contents });
  return `https://github.com/${REPO}/new/${BRANCH}?${params.toString()}`;
}
