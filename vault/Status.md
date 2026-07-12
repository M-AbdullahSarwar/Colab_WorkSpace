# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 0 — Foundation · 🟨 in progress (Step 2 ✓ written; Step 3 underway)
- **Last updated:** 2026-07-07
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓ · docker ✗ (needed at Step 5) · jq ✗.

## Next concrete action
Step 3 in progress. `apps/web` scaffolded (Next 16, App Router, TS, Tailwind). **Do next:**
(1) cleanup — delete nested `apps/web/pnpm-lock.yaml` + `apps/web/pnpm-workspace.yaml`, add
`sharp: true` to root `pnpm-workspace.yaml` `allowBuilds`, then root `pnpm install`.
(2) `pnpm --filter web add socket.io-client`.
(3) Write a `"use client"` component that `io("http://localhost:4000")`-connects, tracks
`connect`/`disconnect`/`connect_error`, renders status. Verify **two tabs both "connected" +
realtime logs two socket ids** (Phase-0 DoD). Optional: toggle server `cors` off to feel the
CORS failure. See [[CORS-and-Transport]].

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
