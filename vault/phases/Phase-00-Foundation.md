# Phase 00 — Foundation

**Goal:** prove the two processes talk over WebSockets; beat CORS/transport while it's cheap and
isolated. No features. Part of [[Phases]].

## Steps (user does these)
1. **Monorepo skeleton** (pnpm workspaces or Turborepo): `apps/web`, `apps/realtime`,
   `packages/{db,ai,shared}`. `pnpm install` works across the workspace.
2. **Standalone realtime server (BY HAND):** Express + HTTP server + Socket.IO; log the socket id
   on `connection`. See [[Realtime-Core]].
3. **Next client connects** to the realtime server; render connection status. Hit and FIX the
   [[CORS-and-Transport|CORS]] error — that's the real deliverable.
4. **First typed event** in `packages/shared`, imported by both apps (proves monorepo wiring).
5. **Postgres in Docker** + Prisma init + one `User` model + a migration. See [[Data-Model]].

## Redundant (fine to use generators/docs)
`create-next-app`, Prisma init, Docker postgres image.

## Write by hand (the lesson)
The Socket.IO server and connection/disconnect handling — anything in the live layer.

## Definition of done
Two browser tabs show "connected"; realtime logs two socket ids; `prisma migrate` created `User`;
user can explain their CORS config.

## Notes / findings
- **DONE 2026-07-15.** All DoD met.
- CORS deep-dive (see [[CORS-and-Transport]]): only governs polling; WebSocket bypasses it; browser
  gates *reading the response*, not the server *processing the request*; CORS ≠ socket security.
- Socket.IO connects over an **`http://`** URL (not `ws://`) — it upgrades internally. One socket
  connection multiplexes many named events; client events = `connect`/`disconnect`/`connect_error`,
  server event = `connection`.
- Typed event contract lives in `@colab/shared` (`ClientToServerEvents`/`ServerToClientEvents`);
  generic order flips between `Server<C2S,S2C>` and `Socket<S2C,C2S>` = `<receive, send>`.
- DB: Postgres in Docker (compose + named volume for persistence); Prisma schema → migration SQL →
  typed client. `String` defaults to `TEXT`; override with `@db.` (e.g. `@db.Uuid`). Relational =
  flat columns (name split, no nested object).
