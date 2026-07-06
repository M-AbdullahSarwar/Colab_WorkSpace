# Glossary

- **CRDT** — Conflict-free Replicated Data Type; merges concurrent edits without conflict. Ours: Yjs. See [[CRDT]].
- **OT** — Operational Transform; older alternative to CRDT. Not using it (too much to hand-roll).
- **Awareness** — Yjs channel for ephemeral cursor/selection/presence data, separate from the document. See [[Presence]].
- **Presence** — who's online / typing / editing right now. Ephemeral. See [[Presence]].
- **Snapshot** — room state sent to a client on join (presence + recent messages + doc).
- **Optimistic UI** — render your own action before the server confirms it. See [[Optimistic-UI]].
- **assertCan** — the single permission-check helper. See [[Architecture]].
- **ydocState** — Yjs document state stored as binary (`bytea`) in Postgres.
