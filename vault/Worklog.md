# Worklog

Dated, append-only. Newest at the top.

## 2026-07-07
- Set up cross-session automation: `.claude/settings.json` grants broad Bash/PowerShell perms +
  a SessionStart hook that auto-injects `Status.md`; root `CLAUDE.md` reduced to a pure pointer to
  this vault (no duplicated content — vault stays single source of truth); harness memory seeded.
- Started [[Phase-00-Foundation]] Step 1: user created `pnpm-workspace.yaml`. pnpm not yet
  installed; package stubs + `pnpm install` still to do.
- Discussed **pnpm workspaces vs Turborepo** — clarified they're different layers (see
  [[Decisions]] #7). Staying with plain pnpm workspaces; Turborepo deferred until builds get slow.
- Env checked: Node 24 ✓, git ✓; pnpm ✗ (install via Corepack), docker ✗ (needed at Step 5), jq ✗.
- **Step 1 DONE:** pnpm 11.10 installed; root `package.json` made private + 4 `@colab/*` stubs
  (`realtime`, `shared`, `db`, `ai`); `pnpm install` recognizes all 5 workspace projects;
  `git init` + `.gitignore` verified (node_modules excluded). Note: `node_modules/@colab/`
  symlinks appear only once a package depends on another `@colab/*` (Step 4), not yet.
- **Next:** Step 2 — hand-write the standalone Socket.IO server in `apps/realtime`.

## 2026-07-05
- Defined the project, scope, and stack (see [[Decisions]]).
- Wrote `../ROADMAP.md` (phases 0–9).
- Saved cross-session memory (project + working-style).
- Created this Obsidian vault: [[Home]], [[Status]], [[Overview]], [[Architecture]], [[Data-Model]],
  [[Realtime-Core]], [[Decisions]], [[Phases]], [[Phase-00-Foundation]], and concept notes.
- **Next:** user starts [[Phase-00-Foundation]].
