import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { getSkill, readSkillFile, listSkills } from "@/lib/skills-fs";

export const dynamic = "force-static";

export function generateStaticParams() {
  return listSkills().map((s) => ({ slug: s.slug }));
}

/**
 * Build a zip whose contents extract to `<slug>/<relpath>`, so unzipping into
 * ~/.claude/skills/ yields ~/.claude/skills/<slug>/SKILL.md.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const zip = new JSZip();
  for (const f of skill.files) {
    zip.file(`${skill.slug}/${f.path}`, readSkillFile(skill.slug, f.path));
  }
  const bytes = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });

  return new NextResponse(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${skill.slug}.zip"`,
    },
  });
}
