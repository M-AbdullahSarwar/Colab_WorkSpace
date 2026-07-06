# Collaborative AI Workspace — Build Roadmap

> Learning project. Primary goal: master real-time collaboration (presence, concurrent
> editing, shared state). Secondary goal: ship all 7 features. AI is provider-agnostic.

---

## 0. Guiding principles

1. **Every phase is runnable.** Never spend a week with nothing to demo. Even "full feature
   set" gets built as a series of working slices.
2. **Feel the problem before the solution.** You'll build naive sync (broadcast-the-whole-text),
   watch it corrupt under concurrent edits, *then* adopt a CRDT. The pain is the lesson.
3. **The server is the source of truth for *who* and *when*; the CRDT is the source of truth
   for *what the text is*.** Keep those two ideas separate in your head — most confusion comes
   from mixing them.
4. **Persist transport-independent state.** Socket.IO is how state *moves*; Postgres is where it
   *lives*. You should be able to lose every socket and rebuild the room from the DB.

---

## 1. Architecture

```
apps/
  web/            Next.js (App Router) — UI, client socket, editor
  realtime/       Node + Express + Socket.IO — the live layer (its OWN process)
packages/
  db/             Prisma schema + client (PostgreSQL)
  ai/             Provider-agnostic AI interface (Claude | OpenAI behind one API)
  shared/         Shared TS types + socket event contracts
```

**Why split `web` and `realtime` into two processes?**
Next.js server components / API routes are request-response and (on serverless) short-lived —
hostile to long-lived WebSocket connections. A dedicated Socket.IO process you fully control is
the single most important architectural decision for a *learning* project: you'll actually see
how the live layer works instead of fighting a framework. They share `packages/*`.

Use a monorepo (pnpm workspaces or Turborepo). Keep the socket **event contract** in
`packages/shared` so client and server can't drift.

---

## 2. Data model (PostgreSQL via Prisma)

Sketch — refine as you go:

```
User        id, email, passwordHash, name, avatarUrl
Workspace   id, name, ownerId
Membership  id, workspaceId, userId, role(OWNER|ADMIN|EDITOR|VIEWER)   // permissions live here
Room        id, workspaceId, name, kind(CHAT|DOC|PROMPT)
Message     id, roomId, userId(nullable=AI), role(user|assistant), content, createdAt
Document    id, roomId, title, ydocState(bytea)   // CRDT binary state, see Phase 6
DocVersion  id, documentId, snapshot, authorId, label, createdAt   // Phase 9
MemoryEntry id, workspaceId, key, value, updatedBy, updatedAt       // shared context
```

Two things worth internalizing now:
- **Permissions = `Membership.role`.** Every socket action and API call checks "is this user a
  member of this workspace/room, and is their role allowed to do this?" Build a single
  `assertCan(userId, workspaceId, action)` helper early; you'll call it everywhere.
- **`Document.ydocState` is binary.** Once you reach the CRDT phase, the document's truth is a
  Yjs binary blob, not a text column. Plan the column now (`bytea`), fill it later.

---

## 3. The real-time core (study this before coding)

### Socket.IO rooms map to your domain rooms
`socket.join(roomId)` then `io.to(roomId).emit(...)`. That's the whole multiplexing model.
Namespaces vs rooms: use **one namespace, many rooms** for this app.

### Connection lifecycle & auth
1. Client connects with a JWT/session token in `socket.handshake.auth`.
2. Server middleware verifies it → attaches `socket.data.userId`. Reject if invalid.
3. On `room:join`, check membership (`assertCan`), then `socket.join(roomId)` and send a
   **snapshot** (current presence + recent messages + doc state).
4. On `disconnect`, clean up presence and broadcast the departure.

### Event contract (define in `packages/shared`)
```
// client → server
room:join { roomId }
room:leave { roomId }
chat:send { roomId, content }
presence:typing { roomId, isTyping }
cursor:update { roomId, docId, anchor, head }     // Phase 7
doc:update { roomId, docId, update }               // naive first, CRDT binary later

// server → client
room:snapshot { messages, presence, doc }
chat:new { message }
chat:ai-token { messageId, token }                 // streaming, Phase 3
presence:update { roomId, users[] }
cursor:moved { userId, docId, anchor, head }
doc:patched { docId, update }
```

### Presence (the "feels alive" layer)
Presence is **ephemeral** — keep it in memory keyed by room, NOT in Postgres. A simple
`Map<roomId, Map<userId, {name, status, lastSeen}>>` on the server. Broadcast on join, leave,
and status change (online / typing / editing). Use a short heartbeat or rely on Socket.IO's
disconnect to expire entries. (Multi-server scaling uses Redis — out of scope until you deploy.)

---

## 4. Phased roadmap

Each phase lists the **learning goal**, the **deliverable**, and the **trap** to watch for.

### Phase 0 — Foundation (1 short sprint)
- Monorepo, TypeScript everywhere, Prisma + Postgres (Docker locally), ESLint/Prettier.
- Boot an empty `realtime` Socket.IO server and an empty Next app that connects to it and logs
  "connected". **Deliverable:** two browser tabs both show "connected".
- *Trap:* CORS + transport config between the two processes. Solve it now while it's isolated.

### Phase 1 — Auth, workspaces, permissions
- Email/password auth (NextAuth/Auth.js or hand-rolled JWT — your call; Auth.js is faster).
- Create workspace, invite users, assign roles. Build `assertCan`.
- Same token must authenticate **both** HTTP and the socket handshake.
- **Deliverable:** log in, create a workspace, add a second user, see role-gated UI.
- *Trap:* sharing the session between Next and the standalone socket server. Decide your token
  strategy here and don't revisit it.

### Phase 2 — Shared AI chat rooms (REAL-TIME FUNDAMENTALS) ⭐
- Rooms within a workspace. Join → snapshot of recent messages. Send a message → persisted →
  broadcast to everyone in the room instantly.
- **No AI yet.** Just human↔human realtime. This is where you learn the core loop.
- **Deliverable:** two users in `#general` chatting live, history survives refresh.
- *Trap:* optimistic UI vs. server echo (don't double-render your own message). Decide:
  optimistic insert with a temp id, reconcile on server ack.

### Phase 3 — AI in the room (provider-agnostic + streaming) ⭐
- `packages/ai`: `interface AIProvider { streamChat(messages, opts): AsyncIterable<string> }`
  with `ClaudeProvider` and/or `OpenAIProvider` implementations. Config picks one.
- An AI reply is just a `Message` with `userId = null, role = "assistant"`. The **room** owns the
  conversation — pass the room's recent messages as context, not one user's history. This is your
  "shared conversation context" feature, and it falls out naturally from Phase 2's data model.
- Stream tokens: AI process → `chat:ai-token` events → every client appends live.
- **Deliverable:** anyone in the room asks the AI; everyone watches the answer stream in.
- *Trap:* where streaming runs. The **realtime** server should call the AI and fan out tokens
  (so all room members see them), not the browser. Browser→AI direct = only one user sees it.

### Phase 4 — Shared memory / context
- `MemoryEntry` per workspace (key/value, e.g. ProjectName, Tone, TechStack).
- Inject these into every AI call's system prompt for that workspace.
- Editing memory is itself a small real-time + permission exercise (broadcast updates).
- **Deliverable:** set "Tone: Professional" once; every member's AI replies respect it.

### Phase 5 — Collaborative editing, NAIVE version ⭐⭐ (the deliberate mistake)
- A `DOC`/`PROMPT` room with a shared `<textarea>`. On every change, emit the **entire text**;
  server stores it and broadcasts to others.
- Open two tabs, type in both at once. **Watch it clobber itself.** Document exactly what breaks:
  cursor jumps, lost characters, last-write-wins overwrites.
- **Deliverable:** a written list (in this repo) of the failures you observed. *This is the
  point of the phase* — you now understand why CRDTs exist.
- *Trap:* none — you *want* it to break. Resist the urge to patch it; move to Phase 6.

### Phase 6 — Collaborative editing, CRDT (Yjs) ⭐⭐⭐ (the centerpiece)
- Adopt **Yjs**. Editor: **Tiptap** (ProseMirror) or **CodeMirror 6** via `y-prosemirror` /
  `y-codemirror`. Transport: send Yjs **binary updates** over your existing Socket.IO channel
  (`doc:update` carrying `Uint8Array`), or run `y-websocket`'s protocol over it.
- Server responsibilities: relay updates to the room, and **persist** `Y.encodeStateAsUpdate`
  into `Document.ydocState` (debounced). On join, send the stored state so latecomers sync.
- Re-run the two-tab test from Phase 5. It now merges cleanly. *Feel the difference.*
- **Deliverable:** true Google-Docs-style concurrent editing of a prompt/doc.
- *Traps:* (a) treat updates as opaque binary — don't try to interpret them; (b) persistence
  cadence — debounce, and snapshot on last-editor-leaves; (c) awareness vs. document are
  separate Yjs channels — keep them apart (leads into Phase 7).

### Phase 7 — Presence & live cursors ⭐⭐
- Use **Yjs Awareness** for cursors/selections in docs (it's built for exactly this) and your
  in-memory presence map for room-level "online / typing / editing".
- Render remote cursors with names ("Ali is editing…", "Sara highlighted ¶2").
- **Deliverable:** the app *feels alive* — you see others' carets move in real time.

### Phase 8 — AI actions on selected content ⭐
- Selection toolbar: Improve / Shorten / Explain / Bulletize / Translate.
- Send `{docId, selectionText, action}` to the AI layer; apply the result as a Yjs transaction so
  it merges and is visible to everyone (and undoable).
- **Deliverable:** highlight a paragraph, click "Shorten", everyone sees it shrink.
- *Trap:* mapping the selection range back onto a CRDT doc that may have shifted. Apply edits via
  Yjs positions/relative positions, not raw string offsets.

### Phase 9 — Version history
- Snapshot `Document` state into `DocVersion` on meaningful events (AI generation, manual save,
  periodic). Yjs supports state snapshots — store `encodeStateAsUpdate` blobs + metadata.
- UI: timeline, diff/preview, restore (restore = apply that snapshot as a new update).
- **Deliverable:** "V1 AI-generated → V2 user-edited → V3 AI-improved", with rollback.

---

## 5. The hard problems (so they don't surprise you)

| Problem | Where it bites | Approach |
|---|---|---|
| Concurrent edit conflicts | Phase 5→6 | CRDT (Yjs). Don't hand-roll OT unless you want a month on it. |
| Auth across HTTP + WebSocket | Phase 1 | One token, verified in both the Next layer and the socket handshake. |
| Streaming AI to *many* viewers | Phase 3 | AI call lives on the realtime server; fan out tokens to the room. |
| Presence cleanup on crash/disconnect | Phase 2,7 | Ephemeral in-memory state + disconnect handlers + heartbeat. |
| CRDT persistence cadence | Phase 6 | Debounced `encodeStateAsUpdate` to Postgres; snapshot on empty room. |
| Reconnection / missed updates | Phase 6 | On rejoin, server sends full Yjs state; CRDT reconciles automatically. |
| Selection → CRDT position mapping | Phase 8 | Yjs relative positions, never raw offsets. |

---

## 6. Tech decisions (defaults — change with reason)

- **Editor:** Tiptap (rich text) — best Yjs integration, friendly API. CodeMirror if you want
  code/prompt-as-text feel.
- **CRDT:** Yjs. (Automerge is the alternative; Yjs has the better editor ecosystem.)
- **Transport:** your own Socket.IO channel carrying Yjs binary, so you understand the pipe.
  (`y-websocket` is the shortcut if you'd rather not wire it yourself.)
- **Auth:** Auth.js for speed, or hand-rolled JWT for learning. Either is fine.
- **AI:** provider-agnostic interface in `packages/ai`; start with one concrete provider.
- **Scaling (later):** Socket.IO + Redis adapter when you go multi-instance. Ignore until deploy.

---

## 7. Suggested order of attack (TL;DR)

`0 Foundation → 1 Auth/Workspaces → 2 Live chat → 3 AI streaming → 4 Shared memory →
5 Naive editing (break it) → 6 Yjs CRDT (fix it) → 7 Presence/cursors → 8 AI-on-selection →
9 Version history`

The real-time learning curve peaks at **Phases 5–7**. Everything before is setup that earns you
the right to attempt them; everything after is application of what you learned there.
