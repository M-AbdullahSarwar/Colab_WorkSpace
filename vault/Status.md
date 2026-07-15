# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 1 — Auth / Workspaces / Permissions · 🟦 starting (Phase 0 ✅ complete)
- **Last updated:** 2026-07-15
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓, docker 29 ✓ · jq ✗.
- **DB:** Postgres in Docker (dev) / Neon at deploy — Prisma swaps via `DATABASE_URL` ([[Decisions]] #8).
- **Target:** working version through all 9 phases in ~1 month (~early Aug 2026); week plan in [[Worklog]].

## Next concrete action
Phase 0 complete. **Phase 1 kickoff** — first decide the **auth strategy** (hand-rolled JWT vs
Auth.js), because one token must authenticate BOTH the Next HTTP app and the standalone socket
handshake. Then: email/password login → create workspace → `Membership` + roles → `assertCan`
helper → the token verified in both HTTP and `socket.handshake.auth`. See
[[Auth-HTTP-and-WebSocket]], [[Data-Model]].

## Definition of done for the current phase
**(Phase 1)** Log in with email/password; create a workspace; add a second user; see role-gated UI;
the **same token** authenticates both an HTTP request and the socket handshake. (Phase 0 ✅: two
tabs connected + two socket ids, `User` table migrated, CORS understood — see [[Phase-00-Foundation]].)

## Open blockers
- None.

## Recently decided
- Obsidian vault created to carry project context across sessions; `CLAUDE.md` + a SessionStart
  hook auto-load it each session (vault stays the single source of truth).
- pnpm workspaces now; Turborepo is a later add-on, not an alternative ([[Decisions]] #7).
- Full decision list in [[Decisions]].
