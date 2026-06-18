import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { zipForInstall } from "@/lib/skill";
import { downloadSkillFiles } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = db();

  const { data: skill, error } = await supabase
    .from("skills")
    .select("slug, files")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  const files = await downloadSkillFiles(skill.slug, skill.files);
  const zip = await zipForInstall(skill.slug, files);

  return new NextResponse(zip as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${skill.slug}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
