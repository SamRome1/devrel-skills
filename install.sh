#!/usr/bin/env bash
#
# Skills-Library installer.
#
# From a clone:
#   ./install.sh <skill> [<skill> ...]      # symlinks skills/<name> into ~/.claude/skills
#   ./install.sh --list                     # list available skills
#
# Without cloning (public repo):
#   curl -fsSL https://raw.githubusercontent.com/OWNER/REPO/main/install.sh | bash -s -- <skill>
#
# Flags:
#   --project   install into ./.claude/skills instead of ~/.claude/skills
#   --copy      copy files instead of symlinking (default is copy in curl mode)
#   --list      list available skills and exit
#
set -euo pipefail

# Which repo to pull from in curl mode. Override with SKILLS_REPO=owner/name.
REPO="${SKILLS_REPO:-SamRome1/devrel-skills}"
BRANCH="${SKILLS_BRANCH:-main}"

TARGET="${HOME}/.claude/skills"
MODE="symlink"
DO_LIST=false
SKILLS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --project) TARGET="$(pwd)/.claude/skills" ;;
    --copy)    MODE="copy" ;;
    --list)    DO_LIST=true ;;
    -h|--help) sed -n '2,20p' "$0" 2>/dev/null || true; exit 0 ;;
    -*)        echo "unknown flag: $1" >&2; exit 1 ;;
    *)         SKILLS+=("$1") ;;
  esac
  shift
done

# Locate a local skills/ dir if we're running from inside a clone.
SCRIPT_DIR=""
if [ -n "${BASH_SOURCE:-}" ] && [ -f "${BASH_SOURCE[0]:-}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

SKILLS_DIR=""
if [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/skills" ]; then
  SKILLS_DIR="$SCRIPT_DIR/skills"
fi

# Remote mode: download the repo tarball once and point SKILLS_DIR at it.
TMP=""
ensure_remote() {
  [ -n "$SKILLS_DIR" ] && return 0
  command -v tar >/dev/null || { echo "error: 'tar' is required." >&2; exit 1; }
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  echo "Fetching ${REPO}@${BRANCH} ..."
  curl -fsSL "https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}" -o "$TMP/repo.tgz"
  tar -xzf "$TMP/repo.tgz" -C "$TMP"
  local top
  top="$(find "$TMP" -maxdepth 1 -type d -name '*-*' | head -1)"
  SKILLS_DIR="$top/skills"
  MODE="copy"  # nothing persistent to symlink to in curl mode
}

if [ "$DO_LIST" = true ]; then
  ensure_remote
  echo "Available skills:"
  for d in "$SKILLS_DIR"/*/; do
    [ -f "${d}SKILL.md" ] && echo "  - $(basename "$d")"
  done
  exit 0
fi

if [ "${#SKILLS[@]}" -eq 0 ]; then
  echo "Usage: install.sh <skill> [<skill> ...]   (or --list)" >&2
  exit 1
fi

ensure_remote
mkdir -p "$TARGET"

for name in "${SKILLS[@]}"; do
  src="$SKILLS_DIR/$name"
  if [ ! -f "$src/SKILL.md" ]; then
    echo "✗ '$name' not found (no skills/$name/SKILL.md). Try --list." >&2
    continue
  fi
  dest="$TARGET/$name"
  rm -rf "$dest"
  if [ "$MODE" = "symlink" ]; then
    ln -s "$src" "$dest"
    echo "✓ linked '$name' → $dest"
  else
    cp -R "$src" "$dest"
    echo "✓ installed '$name' → $dest"
  fi
done

echo "Done. Restart Claude Code if it's running so it picks up the new skill(s)."
