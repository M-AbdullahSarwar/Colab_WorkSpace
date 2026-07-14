# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 0 — Foundation · 🟨 nearly done (Steps 1–4 ✓; Step 5 in progress — Docker ready)
- **Last updated:** 2026-07-14
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓, docker 29 ✓ · jq ✗.
- **DB:** Postgres in Docker (dev) / Neon at deploy — Prisma swaps via `DATABASE_URL` ([[Decisions]] #8).
- **Target:** working version through all 9 phases in ~1 month (~early Aug 2026); week plan in [[Worklog]].

## Next concrete action
Step 5 in progress (Docker installed & running). Do: (1) `docker-compose.yml` at root with a
`postgres:17` service (port 5432, named volume for persistence) → `docker compose up -d`; (2) in
`packages/db`: add `prisma` (dev) + `@prisma/client`, `prisma init --datasource-provider
postgresql`, set `DATABASE_URL` to the local container; (3) add the `User` model; (4)
`prisma migrate dev --name init` → creates the table + generates the client. Finishes Phase 0.
See [[Data-Model]].

## Definition of done for the current phase
Two browser tabs both show "connected"; realtime server logs two socket ids; `prisma migrate`
created the `User` table; user can explain their CORS config. Full detail in [[Phase-00-Foundation]].

## Open blockers
- None.

## Recently decided
- Obsidian vault created to carry project context across sessions; `CLAUDE.md` + a SessionStart
  hook auto-load it each session (vault stays the single source of truth).
- pnpm workspaces now; Turborepo is a later add-on, not an alternative ([[Decisions]] #7).
- Full decision list in [[Decisions]].
