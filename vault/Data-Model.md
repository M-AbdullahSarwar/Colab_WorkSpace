# Data Model (Postgres via Prisma)

Sketch — refine as we go. Update this note whenever the schema changes.

## Implemented so far (2026-07-16, Phase 1)
In `packages/db/prisma/schema.prisma`, migrated to Postgres:
- **User** — `id` uuid (`@db.Uuid`), `email` unique, `passwordHash`, `salutation?` (enum
  `Salutation`: MR/MS/MRS/DR), `firstName`, `middleName?`, `lastName`, `avatarUrl?`, timestamps.
  Name is **flat columns** — relational tables can't nest; `fullName` is derived in app code.
- **Workspace** — `id` uuid, `name`, `owner`/`ownerId` → User (FK `RESTRICT`), `members` →
  Membership[], timestamps.
- **Membership** — `id` uuid, `user`/`userId`, `workspace`/`workspaceId` (both **required** — a
  nullable FK would defeat the unique constraint, since `NULL != NULL` in SQL), `role` (enum
  `Role`: OWNER/ADMIN/EDITOR/VIEWER), `@@unique([workspaceId, userId])`, cascade delete.
  **Permissions live here** — `assertCan` reads `membership.role`.
- Not yet: Room, Message, Document, DocVersion, MemoryEntry (later phases).

> Prisma note: a relation needs **both sides declared**; the back-relation field (e.g.
> `User.memberShips`) is **virtual — it creates no DB column**, it exists so the client can
> traverse the relation. A named `@relation` is only needed when two models relate more than once.

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
