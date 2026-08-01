# Decisions (ADR-lite)

Running log. Each entry: decision · why · date. Append newest at the bottom.

1. **Two-process architecture** (web + standalone realtime). Why: Next is hostile to long-lived WS;
   a standalone socket server is controllable and visible for learning. — 2026-07-05
2. **Naive sync first, then Yjs CRDT.** Why: feel the conflict pain before adopting the solution —
   deeper learning. — 2026-07-05
3. **All 7 features, but built as sequential runnable slices** (not in parallel). Why: avoid stalling. — 2026-07-05
4. **Provider-agnostic AI** (`packages/ai`, one interface, swappable Claude/OpenAI). Why: clean
   architecture + flexibility. — 2026-07-05
5. **User writes the code; I guide.** Why: it's a learning project; doing the non-redundant work by
   hand is the point. — 2026-07-05
   - **Clarified 2026-07-07 (stricter):** "guide" means the user runs **all** commands and writes
     **all** files — including scaffolding, dependency installs, and config, not just the live
     layer. Claude does not run installs or create/edit project files, even trivial boilerplate;
     it gives exact commands + specs + the *why*, and the user does it. Only exceptions: Claude
     maintains the vault/memory and may revert its own mistakes.
6. **Maintain this Obsidian vault** (`/vault`) as the project knowledge base, updated every step.
   Why: cross-session context without overloading the window. — 2026-07-05
7. **Monorepo tool: pnpm workspaces** (not Turborepo). Why: simplest setup, fewest moving parts —
   keeps the focus on the real-time layer; can add Turborepo later if builds get slow. — 2026-07-05
   - **Clarified 2026-07-07:** pnpm workspaces and Turborepo are *different layers*, not
     alternatives. pnpm workspaces is the foundation (linking + install); Turborepo is a task
     runner/cache that layers **on top of** a workspace (it can't stand alone). Plan: learn raw
     workspaces first (understand the mechanism), then adopt Turborepo as a ~15-min upgrade **when
     builds get slow/repetitive** — same "feel the problem before the solution" principle as the
     naive-sync→CRDT arc. Adopting it changes nothing already built.

8. **Database: Postgres in Docker locally (dev); managed Postgres (Neon) at deploy.** Why: a local
   container is free/offline/fast for heavy dev iteration and teaches running infra; Neon's
   serverless strengths matter at deploy. Prisma abstracts the difference — same schema, swap
   `DATABASE_URL` per environment. — 2026-07-14

9. **Auth: hand-rolled JWT** (not Auth.js). Why: one token must authenticate both the Next HTTP app
   and the standalone Socket.IO handshake; signing/verifying a JWT with a shared secret makes that
   one-token-two-transports flow explicit and is the most educational — which is the Phase-1 lesson.
   Password hashing done ourselves (bcrypt). — 2026-07-15

10. **Backend structure: thin route → service → Prisma, with zod validation at the boundary.**
    Reusable zod schemas live in `@colab/shared` (subpath `./schemas`, split by domain) so the
    client form and the server route validate identically from **one** source. The route is the
    **HTTP boundary only** (parse, validate → 400, call service, map errors → status, format
    Response); business logic lives in **HTTP-agnostic service functions** (`apps/web/lib/*`) so it
    can be reused by a socket handler later; Prisma is the data layer. **No separate Repository
    layer** — Prisma is already the abstraction; wrapping it is ceremony for this scale. — 2026-07-23

11. **Token storage: `localStorage` — a deliberate, known simplification.** Why: makes the socket
    handshake mechanism explicit (the learning goal) and avoids CORS-credentials wiring. **Cost:**
    XSS-readable; OWASP discourages long-lived tokens there. httpOnly cookie (XSS-safe, adds CSRF)
    or the hybrid (in-memory access token + httpOnly refresh cookie) is the production answer.
    **Revisit before deploy.** See [[Auth-HTTP-and-WebSocket]]. — 2026-07-23
12. **Teaching format: concept → trade-offs → references → then steps.** Why: the user must
    understand *why*, not follow a checklist; bare step lists defeat the point of the project.
    Every non-trivial step gets the problem, the mental model, alternatives, and real links. — 2026-07-23

## Still open (decide when reached)
- Editor: Tiptap vs CodeMirror 6.
- Which AI provider to implement first.
