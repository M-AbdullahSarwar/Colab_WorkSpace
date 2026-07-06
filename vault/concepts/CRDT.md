# CRDT

Conflict-free Replicated Data Type — merges concurrent edits deterministically without a central
lock. Solves the clobbering seen in naive sync ([[Phases|Phase 5]]).

- Ours: **Yjs**. Editor binding: Tiptap (`y-prosemirror`) or CodeMirror (`y-codemirror`).
- Transport: send Yjs **binary updates** over our Socket.IO channel (`doc:update`).
- Persist: debounced `Y.encodeStateAsUpdate` → `Document.ydocState` (bytea). Snapshot when the room empties.
- Treat updates as **opaque binary** — don't interpret them.
- Cursors/selections use Yjs **Awareness**, a separate channel — see [[Presence]].

Arrives in [[Phases|Phase 6]]. Alternative considered: Automerge (Yjs has the better editor
ecosystem). OT rejected — too much to hand-roll. Related: [[Data-Model]] (`ydocState`).
