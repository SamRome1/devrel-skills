import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  filesFromZip,
  parseSkill,
  slugify,
  type RawFile,
} from "@/lib/skill";
import { clearSkillFiles, uploadSkillFiles } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const author = (form.get("author") as string | null)?.trim() || "unknown";
    const slugOverride = (form.get("slug") as string | null)?.trim() || "";

    // Collect raw files from either a single .zip or a set of folder files.
    let raw: RawFile[] = [];

    const zip = form.get("file");
    if (zip instanceof File && zip.size > 0) {
      const bytes = new Uint8Array(await zip.arrayBuffer());
      if (/\.zip$/i.test(zip.name)) {
        raw = await filesFromZip(bytes);
      } else {
        raw = [{ path: zip.name, data: bytes }];
      }
    } else {
      const files = form.getAll("files").filter((f) => f instanceof File) as File[];
      const pathsRaw = form.get("paths") as string | null;
      let paths: string[] = [];
      try {
        paths = pathsRaw ? JSON.parse(pathsRaw) : [];
      } catch {
        paths = [];
      }
      raw = await Promise.all(
        files.map(async (f, i) => ({
          path: paths[i] || f.name,
          data: new Uint8Array(await f.arrayBuffer()),
        })),
      );
    }

    if (raw.length === 0) {
      return NextResponse.json(
        { error: "No files received. Upload a skill folder or a .zip." },
        { status: 400 },
      );
    }

    const parsed = parseSkill(raw, {
      author,
      slugHint: slugOverride || undefined,
    });
    const slug = slugOverride ? slugify(slugOverride) : parsed.slug;

    const supabase = db();

    // Determine version (bump if the slug already exists).
    const { data: existing } = await supabase
      .from("skills")
      .select("id, version")
      .eq("slug", slug)
      .maybeSingle();

    // Replace any prior files for this slug, then upload fresh.
    await clearSkillFiles(slug);
    const manifest = await uploadSkillFiles(slug, parsed.files);

    const row = {
      slug,
      name: parsed.name,
      description: parsed.description,
      author,
      tags: parsed.tags,
      readme: parsed.readme,
      files: manifest,
      file_count: manifest.length,
      version: existing ? existing.version + 1 : 1,
    };

    const { error } = await supabase
      .from("skills")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, slug, version: row.version });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
