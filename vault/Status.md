# 📍 Status

> The single "where are we now" note. I update this at the end of every working step.

- **Current phase:** Phase 1 — Auth / Workspaces / Permissions · 🟨 steps 1–4 ✅, step 5 next
  (Phase 0 ✅ complete)
- **Last updated:** 2026-09-28
- **Who writes the code:** the user. I guide, review, explain — I do not implement. See [[Decisions]].
- **Monorepo tool:** pnpm workspaces (decided — [[Decisions]] #7; Turborepo deferred until builds slow).
- **Env:** Node 24 ✓, git ✓, pnpm 11.10 ✓, docker 29 ✓ · jq ✗. Restored 2026-09-25: deps installed,
  Postgres container up, `.env` files recreated (write them as `KEY=value` — no spaces, no quotes).
- **DB:** Postgres in Docker (dev) / Neon at deploy — Prisma swaps via `DATABASE_URL` ([[Decisions]] #8).
- **Timeline:** original target (all 9 phases by ~early Aug 2026) is **stale** — ~7-week break, last
  commit 2026-08-06. Needs rebaselining; the week plan in [[Worklog]] no longer holds.

## Next concrete action (updated 2026-09-25 — step 4 done)
**Step 5 finishes Phase 1: workspaces + authorization.** Four pieces, in order:

1. **Workspace creation** — same 3-layer shape as auth ([[Decisions]] #10): zod schema in
   `@colab/shared/schema`, service in a new `apps/web/lib/workspace.ts` (with `import "server-only"`),
   thin route. Creating a workspace must **also** create the creator's `Membership` with
   `role: OWNER` — both writes in a `prisma.$transaction` so a half-created workspace can't exist.
2. **`assertCan(userId, workspaceId, action)`** — lives in `@colab/shared` because **both** processes
   need it (HTTP routes and socket handlers). Looks up the `Membership` row (single indexed query via
   `@@unique([workspaceId, userId])`), throws if missing or the role is too weak. **Queries the DB
   every time** — never reads a role off the token or `socket.data` ([[Auth-HTTP-and-WebSocket]]).
   Prefer a `role -> allowed actions` map over scattered `if (role === "OWNER")` checks.
3. **`room:join` authorization** — add the event to `ClientToServerEvents`; in realtime, call
   `assertCan(socket.data.userId, workspaceId, "read")` before `socket.join(...)`. Gate the **join**,
   never the connection — a new user with no workspace must still be able to connect.
4. **Role-gated UI** — cosmetic only; the server check in (2) is the actual security.

## UI (added 2026-09-28)
The app is no longer scaffold. Visual world: **the code review thread** — chosen by the user from a
mandated concept roll; contract in `apps/web/.impeccable/surfaces/app-page-tsx.md`. Product record
for the design tooling is `PRODUCT.md` at repo root (the vault still wins on any disagreement).
Impeccable is vendored at `.claude/skills/impeccable/` so it works on any machine.

**Two seams the UI exposes, both the user's to close:**
1. `chat` carries a flat string; the client regex-parses `"User X says: Y"` to recover author and
   text. Real fix: a structured payload in `@colab/shared` — realtime layer, hand-written.
2. `/api/workspaces` does not exist; the rail renders an honest "not built yet" state and its
   `ready` branch waits for step 5.

## Definition of done for the current phase
**(Phase 1)** Log in with email/password; create a workspace; add a second user; see role-gated UI;
the **same token** authenticates both an HTTP request and the socket handshake. (Phase 0 ✅: two
tabs connected + two socket ids, `User` table migrated, CORS understood — see [[Phase-00-Foundation]].)

## Open blockers
- None (the `connect_error` above is expected unfinished work, not a blocker).

## Recently decided
- Obsidian vault created to carry project context across sessions; `CLAUDE.md` + a SessionStart
  hook auto-load it each session (vault stays the single source of truth).
- pnpm workspaces now; Turborepo is a later add-on, not an alternative ([[Decisions]] #7).
- Identity in the token; permissions **never** in the token or `SocketData` — resolved per-workspace
  from the DB ([[Auth-HTTP-and-WebSocket]]).
- Full decision list in [[Decisions]].
