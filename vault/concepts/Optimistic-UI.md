# Optimistic UI

The Phase 2 trap. When a user sends a chat message you render it immediately (optimistic), but the
server also echoes it back to the room — risk of rendering it twice.

- Insert locally with a **temp id**.
- On server ack / broadcast, **reconcile**: replace the temp entry (match on temp id) instead of
  appending again.
- Applies to any user-initiated action the server also broadcasts.

Related: [[Realtime-Core]], [[Phases|Phase 2]].
