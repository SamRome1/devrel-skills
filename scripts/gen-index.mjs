#!/usr/bin/env node
// Regenerates the skills table in README.md from each skill's SKILL.md
// frontmatter. No dependencies — run with `node scripts/gen-index.mjs`.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const readmePath = join(root, "README.md");

const START = "<!-- SKILLS:START -->";
const END = "<!-- SKILLS:END -->";

// Minimal YAML frontmatter parser for top-level `key: value` pairs.
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

function listSkills() {
  let entries;
  try {
    entries = readdirSync(skillsDir);
  } catch {
    return [];
  }
  const skills = [];
  for (const name of entries.sort()) {
    const dir = join(skillsDir, name);
    if (!statSync(dir).isDirectory()) continue;
    let md;
    try {
      md = readFileSync(join(dir, "SKILL.md"), "utf8");
    } catch {
      continue; // not a skill
    }
    const fm = parseFrontmatter(md);
    skills.push({
      slug: name,
      name: fm.name || name,
      description: (fm.description || "").replace(/\|/g, "\\|"),
    });
  }
  return skills;
}

function buildTable(skills) {
  if (skills.length === 0) {
    return "_No skills yet. Add one under `skills/<name>/` — see CONTRIBUTING.md._";
  }
  const rows = skills.map(
    (s) =>
      `| [\`${s.slug}\`](skills/${s.slug}) | ${s.description || "—"} | \`./install.sh ${s.slug}\` |`,
  );
  return [
    `**${skills.length} skill${skills.length === 1 ? "" : "s"}**`,
    "",
    "| Skill | Description | Install |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

const skills = listSkills();
const table = buildTable(skills);

let readme = readFileSync(readmePath, "utf8");
if (!readme.includes(START) || !readme.includes(END)) {
  console.error(`README.md is missing ${START} / ${END} markers.`);
  process.exit(1);
}
readme = readme.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  `${START}\n${table}\n${END}`,
);
writeFileSync(readmePath, readme);
console.log(`Wrote index for ${skills.length} skill(s) to README.md`);
