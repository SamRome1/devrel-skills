import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SkillFile = {
  path: string; // relative to the skill root, e.g. "SKILL.md" or "scripts/run.sh"
  size: number;
};

export type SkillRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  readme: string;
  files: SkillFile[];
  file_count: number;
  version: number;
  created_at: string;
  updated_at: string;
};

export type SkillInsert = Omit<SkillRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export const SKILLS_BUCKET = "skills";

let cached: SupabaseClient | null = null;

// Untyped client: this version of @supabase/supabase-js infers query result
// types as `never` from a hand-written Database generic, so we type results at
// the call site by casting to SkillRow instead.
export function db(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local",
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}
