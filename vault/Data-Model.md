# Data Model (Postgres via Prisma)

Sketch — refine as we go. Update this note whenever the schema changes.

| Model       | Key fields                                                | Notes                                                           |
| ----------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| User        | id, email, passwordHash, name, avatarUrl                  |                                                                 |
| Workspace   | id, name, ownerId                                         |                                                                 |
| Membership  | id, workspaceId, userId, role                             | role = OWNER\|ADMIN\|EDITOR\|VIEWER — **permissions live here** |
| Room        | id, workspaceId, name, kind                               | kind = CHAT\|DOC\|PROMPT                                        |
| Message     | id, roomId, userId(nullable=AI), role, content, createdAt | role = user\|assistant                                          |
| Document    | id, roomId, title, ydocState(bytea)                       | CRDT binary state (Phase 6)                                     |
| DocVersion  | id, documentId, snapshot, authorId, label, createdAt      | Phase 9                                                         |
| MemoryEntry | id, workspaceId, key, value, updatedBy, updatedAt         | shared AI context                                               |

## Two things to internalize
- **Permissions = `Membership.role`.** Every socket action + API call runs `assertCan`. See [[Architecture]].
- **`Document.ydocState` is binary** (`bytea`). Once CRDT lands, the doc's truth is a Yjs blob, not a
  text column. Add the column now, fill it in [[Phases|Phase 6]]. See [[CRDT]].
