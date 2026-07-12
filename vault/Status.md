# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 0 — Foundation · 🟨 nearly done (Steps 1–3 ✓; Step 4 next, then Step 5)
- **Last updated:** 2026-07-07
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓ · docker ✗ (needed at Step 5) · jq ✗.
- **Target:** working version through all 9 phases in ~1 month (~early Aug 2026); week plan in [[Worklog]].

## Next concrete action
Step 3 done (web client connects to realtime; deep CORS understanding — [[CORS-and-Transport]]).
**Step 4:** define socket event-contract types in `packages/shared` (`ClientToServerEvents` /
`ServerToClientEvents`), add `@colab/shared` as a `workspace:*` dep of BOTH apps (creates the first
`node_modules/@colab` symlink), type the `Server` (realtime) + client socket (web) with them, and
add `transpilePackages: ["@colab/shared"]` to Next. Proof: rename an event in shared → both apps
fail to compile. **Then Step 5** (needs Docker): Postgres + Prisma + `User` model + migration →
Phase 0 done. See [[Realtime-Core]], [[Data-Model]].

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
