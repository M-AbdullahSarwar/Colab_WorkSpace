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

## Still open (decide when reached)
- Auth: Auth.js vs hand-rolled JWT.
- Editor: Tiptap vs CodeMirror 6.
- Which AI provider to implement first.
