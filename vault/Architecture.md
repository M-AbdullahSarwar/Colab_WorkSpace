# Architecture

## Two processes (key decision — see [[Decisions]])
- `apps/web` — Next.js (App Router): UI, client socket, editor.
- `apps/realtime` — Node + Express + Socket.IO: the live layer, its **own** process.

Why separate: Next's request/response model (esp. serverless) is hostile to long-lived WebSocket
connections. A standalone socket server is fully under our control and visible for learning.

## Monorepo
```
apps/web
apps/realtime
packages/db       Prisma schema + client
packages/ai       provider-agnostic AI interface
packages/shared   shared TS types + socket event contract
```
`packages/shared` is imported by both apps so the event contract can't drift. See [[Realtime-Core]].

## Source-of-truth split (mental model)
- **Server** = truth for WHO is here and WHEN (presence, ordering, auth).
- **CRDT** = truth for WHAT the text currently is. See [[CRDT]].
- Socket.IO **moves** state; Postgres **stores** it. Losing all sockets must be recoverable from the DB.

## Cross-cutting, build early
- `assertCan(userId, workspaceId, action)` — one permission helper, called everywhere.
  Permissions live in `Membership.role`. See [[Data-Model]].
- ONE auth token for both HTTP and the socket handshake. See [[Auth-HTTP-and-WebSocket]].
