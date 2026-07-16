# Worklog

Dated, append-only. Newest at the top.

## 2026-07-17
- **Phase 1 Step 2 done:** `@colab/db` exports a Prisma client **singleton** (`src/index.ts`, `pg`
  driver adapter, `globalThis` cache so Next dev hot-reload doesn't leak connection pools);
  package `exports` + `type:module`; wired into `web` (dep + `transpilePackages`), `DATABASE_URL`
  in `apps/web/.env.local`, `serverExternalPackages: ["@prisma/adapter-pg","pg"]` in next.config.
  Import fix: generated client is **extensionless** (`../generated/prisma/client`), matching
  Prisma 7's output (my `.js` was wrong). `/api/db-check` → `{"users":0}`.
- **Next:** Step 3 — auth core (JWT helper in `@colab/shared/auth`, bcrypt, register/login routes).

## 2026-07-16
- **Phase 1 Step 1 done:** `Workspace` + `Membership` models and `Role` + `Salutation` enums added
  and migrated (`20260715190315_workspaces_and_memberships`). Fixed nullable `workspaceId` →
  required (NULLs would defeat `@@unique([workspaceId, userId])`); renamed `ROLE`→`Role`,
  `MemberShip`→`Membership`. See [[Data-Model]].
- **Auth decided:** hand-rolled JWT ([[Decisions]] #9).
- **Next:** Step 2 — `prisma generate`, then export a Prisma client singleton from `@colab/db` and
  wire it into the apps.

## 2026-07-15
- **Phase 0 COMPLETE.** Step 5 done: `docker-compose.yml` runs `postgres:17` (container
  `colab-postgres`, volume `colab-pgdata`, port 5432); Prisma 7 in `packages/db` (config in
  `prisma.config.ts`, `pg` driver adapter, `dotenv` loads env); `User` migrated — `id` native
  `@db.Uuid`, unique `email`, name split into `salutation?/firstName/middleName?/lastName/
  avatarUrl?`. Added `packages/db/tsconfig.json` (bundler resolution) to fix editor module errors.
  Learned Docker (image/container/volume/ports) and Prisma (schema → migrate → typed client).
- **Next:** Phase 1 (auth/workspaces/permissions). First decision: auth strategy (JWT vs Auth.js).

## 2026-07-14
- **Step 4 DONE & verified:** event contract typed in `@colab/shared/src/index.ts`
  (`ClientToServerEvents`/`ServerToClientEvents`, `chat: (msg: string) => void`); shared
  `package.json` `exports` → `./src/index.ts`; `transpilePackages: ["@colab/shared"]` in Next; both
  apps import the types and type their `Server`/`Socket` (generic order correctly flipped —
  `<events I receive, events I send>`); `@colab/shared` now symlinked into each app's `node_modules`
  (monorepo payoff visible). Drift test passed.
- **Docker installed** (29.6.1, Compose v5.3.0, daemon running). **DB decision:** Postgres in
  Docker locally for dev; Neon (managed) at deploy — Prisma swaps via `DATABASE_URL` ([[Decisions]] #8).
- **Next:** Step 5 in progress — compose Postgres, Prisma init in `packages/db`, `User` model, migrate.

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
- **Step 2 DONE (server written & reviewed):** user hand-wrote `apps/realtime/src/index.ts` —
  Express + `http.createServer(app)` + Socket.IO; `RT_PORT` 4000 / `WEB_PORT` 3000, CORS origin
  = `http://localhost:${WEB_PORT}`; `io.on("connection")` logs `socket.id` + `disconnect`. Listens
  on the http server (not `app`). tsconfig fixed (`types:["node"]`, jsx removed). Live
  connection log verified for real in Step 3 (needs a client).
- **Step 3 in progress:** `apps/web` scaffolded via create-next-app (Next 16, App Router, TS,
  Tailwind); recognized as workspace member `web`. Cleanup needed: delete nested
  `apps/web/pnpm-lock.yaml` + `apps/web/pnpm-workspace.yaml` (merge `sharp: true` into root
  `allowBuilds`), then root `pnpm install` — one lockfile / one workspace root. `page.tsx` still
  the default template.
- **Step 3 DONE:** `apps/web/app/page.tsx` (`"use client"`) connects to realtime via
  `socket.io-client` inside `useEffect` with cleanup; `connect`/`disconnect`/`connect_error`
  handled. Monorepo cleanup: removed nested lockfile + workspace file in `apps/web`. Deep CORS
  lesson captured in [[CORS-and-Transport]] (governs polling only; WebSocket bypasses it; browser
  gates reading the response, not the server processing it; CORS ≠ socket security).
- **Timeline goal:** working version of all 9 phases in ~1 month (~early Aug 2026). Plan — **W1:**
  finish Phase 0 + Phase 1 (auth) + start Phase 2 · **W2:** Phase 2 chat + Phase 3 AI + Phase 4
  memory · **W3:** Phase 5 (break it) + Phase 6 Yjs CRDT (the hard one) · **W4:** Phase 7 presence
  + Phase 8 AI-on-selection + Phase 9 history + polish. Rule: keep each phase to its minimal
  runnable slice; protect W3 for Yjs.
- **Next:** Step 4 — first typed event in `@colab/shared`, imported by both apps.

## 2026-07-05
- Defined the project, scope, and stack (see [[Decisions]]).
- Wrote `../ROADMAP.md` (phases 0–9).
- Saved cross-session memory (project + working-style).
- Created this Obsidian vault: [[Home]], [[Status]], [[Overview]], [[Architecture]], [[Data-Model]],
  [[Realtime-Core]], [[Decisions]], [[Phases]], [[Phase-00-Foundation]], and concept notes.
- **Next:** user starts [[Phase-00-Foundation]].
