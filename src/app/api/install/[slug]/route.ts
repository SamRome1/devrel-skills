import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { baseUrlFromRequest } from "@/lib/url";

export const runtime = "nodejs";

/**
 * Returns a POSIX shell script that downloads the skill zip and extracts it
 * into a Claude skills directory. Intended for:
 *
 *   curl -fsSL <app>/api/install/<slug> | bash
 *
 * By default installs to ~/.claude/skills. Pass -s -- --project to install
 * into ./.claude/skills of the current directory instead.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = db();

  const { data: skill } = await supabase
    .from("skills")
    .select("slug, name")
    .eq("slug", slug)
    .maybeSingle();

  if (!skill) {
    return new NextResponse(
      `#!/usr/bin/env bash\necho "Skill '${slug}' not found in the library." >&2\nexit 1\n`,
      { status: 404, headers: { "Content-Type": "text/x-shellscript" } },
    );
  }

  const base = baseUrlFromRequest(req);
  const downloadUrl = `${base}/api/download/${skill.slug}`;

  const script = `#!/usr/bin/env bash
set -euo pipefail

SLUG="${skill.slug}"
DOWNLOAD_URL="${downloadUrl}"

TARGET="\${HOME}/.claude/skills"
if [ "\${1:-}" = "--project" ]; then
  TARGET="\$(pwd)/.claude/skills"
fi

echo "Installing skill '\${SLUG}' into \${TARGET}/\${SLUG} ..."

if ! command -v unzip >/dev/null 2>&1; then
  echo "error: 'unzip' is required but not installed." >&2
  exit 1
fi

mkdir -p "\${TARGET}"
TMP="\$(mktemp -d)"
trap 'rm -rf "\${TMP}"' EXIT

curl -fsSL "\${DOWNLOAD_URL}" -o "\${TMP}/\${SLUG}.zip"

# The zip extracts to <slug>/..., so unzip directly into TARGET.
rm -rf "\${TARGET}/\${SLUG}"
unzip -q -o "\${TMP}/\${SLUG}.zip" -d "\${TARGET}"

echo "✓ Installed '\${SLUG}'. It will be available in Claude Code as /\${SLUG} (or by name)."
echo "  Location: \${TARGET}/\${SLUG}"
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
