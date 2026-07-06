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
- (append learnings here as we go)
