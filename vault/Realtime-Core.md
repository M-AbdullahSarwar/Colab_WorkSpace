# Realtime Core

Study this before writing socket code. Keep it in sync with `packages/shared`.

## Socket.IO rooms = domain rooms
`socket.join(roomId)` then `io.to(roomId).emit(...)`. One namespace, many rooms for this app.

## Connection lifecycle & auth
1. Client connects with a token in `socket.handshake.auth`.
2. Server middleware verifies it → sets `socket.data.userId`. Reject if invalid.
3. On `room:join`: check membership (`assertCan`), `socket.join(roomId)`, send a **snapshot**
   (presence + recent messages + doc state).
4. On `disconnect`: clean up presence, broadcast departure.

See [[Auth-HTTP-and-WebSocket]].

## Event contract (define in `packages/shared`)
**Client → server:** `room:join`, `room:leave`, `chat:send`, `presence:typing`, `cursor:update`, `doc:update`
**Server → client:** `room:snapshot`, `chat:new`, `chat:ai-token`, `presence:update`, `cursor:moved`, `doc:patched`

> Update this list whenever an event is added or changed, and mirror it in `packages/shared`.

## Presence
Ephemeral, in-memory, keyed by room — **not** in Postgres.
`Map<roomId, Map<userId, {name, status, lastSeen}>>`. Broadcast on join / leave / status change.
See [[Presence]].
