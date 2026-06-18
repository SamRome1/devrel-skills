-- Skills-Library schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once per project.

-- ---------------------------------------------------------------------------
-- skills: one row per uploaded Claude skill
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,           -- kebab-case, used as the install folder name
  name        text not null,                  -- from SKILL.md frontmatter `name`
  description text not null default '',        -- from SKILL.md frontmatter `description`
  author      text not null default 'unknown', -- who uploaded it
  tags        text[] not null default '{}',
  readme      text not null default '',         -- raw SKILL.md contents (for preview)
  files       jsonb not null default '[]',      -- [{ path, size }] relative to the skill root
  file_count  int  not null default 0,
  version     int  not null default 1,          -- bumped on re-upload of the same slug
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists skills_created_at_idx on public.skills (created_at desc);
create index if not exists skills_tags_idx on public.skills using gin (tags);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: a bucket that holds the actual skill files at `<slug>/<relpath>`
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('skills', 'skills', false)
on conflict (id) do nothing;

-- NOTE: This app talks to Supabase exclusively with the service-role key from
-- server-side routes, which bypasses RLS. We still enable RLS on the table so
-- that the anon/public key can never read or write it directly.
alter table public.skills enable row level security;
