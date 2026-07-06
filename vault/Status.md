# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 0 — Foundation · 🟨 in progress (Step 2 underway)
- **Last updated:** 2026-07-07
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓ · docker ✗ (needed at Step 5) · jq ✗.

## Next concrete action
Step 2 of [[Phase-00-Foundation]]: **user hand-writes** the standalone realtime server in
`apps/realtime/src/index.ts` — Express + Node `http` server + Socket.IO on one port (4000),
logging `socket.id` on `connection` and on `disconnect`. Tooling (deps, tsconfig, `dev` script)
set up by Claude; the server logic is the hand-written lesson. See [[Realtime-Core]].

## Definition of done for the current phase
Two browser tabs both show "connected"; realtime server logs two socket ids; `prisma migrate`
created the `User` table; user can explain their CORS config. Full detail in [[Phase-00-Foundation]].

## Open blockers
- None yet.

## Recently decided
- Obsidian vault created to carry project context across sessions; `CLAUDE.md` + a SessionStart
  hook auto-load it each session (vault stays the single source of truth).
- pnpm workspaces now; Turborepo is a later add-on, not an alternative ([[Decisions]] #7).
- Full decision list in [[Decisions]].
