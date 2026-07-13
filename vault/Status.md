# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 0 — Foundation · 🟨 nearly done (Steps 1–4 ✓; Step 5 left — blocked on Docker)
- **Last updated:** 2026-07-07
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓ · docker ✗ (needed at Step 5) · jq ✗.
- **Target:** working version through all 9 phases in ~1 month (~early Aug 2026); week plan in [[Worklog]].

## Next concrete action
Step 4 done & verified: typed event contract in `@colab/shared` (`chat` event), both apps import
it, `@colab/shared` symlinked into each app's `node_modules`. **Step 5 (finishes Phase 0), needs
Docker:** install Docker Desktop → Postgres in a container → `prisma init` in `packages/db` → one
`User` model → `prisma migrate` creates the table. See [[Data-Model]].

## Definition of done for the current phase
Two browser tabs both show "connected"; realtime server logs two socket ids; `prisma migrate`
created the `User` table; user can explain their CORS config. Full detail in [[Phase-00-Foundation]].

## Open blockers
- **Docker not installed** — blocks Step 5 (Postgres). Install Docker Desktop.

## Recently decided
- Obsidian vault created to carry project context across sessions; `CLAUDE.md` + a SessionStart
  hook auto-load it each session (vault stays the single source of truth).
- pnpm workspaces now; Turborepo is a later add-on, not an alternative ([[Decisions]] #7).
- Full decision list in [[Decisions]].
