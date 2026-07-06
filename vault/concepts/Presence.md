# Presence

Who's online / typing / editing right now. Makes the app "feel alive" ([[Phases|Phase 7]]).

- **Room-level presence:** ephemeral, in-memory on the realtime server, keyed by room. **Not**
  Postgres. Expire on `disconnect` (+ optional heartbeat).
- **In-document cursors/selections:** Yjs **Awareness** channel, separate from the doc state. See [[CRDT]].
- Broadcast on join / leave / status change.
- Multi-server scaling later uses the Socket.IO Redis adapter — out of scope until deploy.

Related: [[Realtime-Core]].
