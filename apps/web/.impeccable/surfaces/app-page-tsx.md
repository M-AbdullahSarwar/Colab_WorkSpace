---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/login/page.tsx","app/signup/page.tsx","app/layout.tsx"]
---

Scope: the signed-in room (`app/page.tsx`) plus the two auth surfaces and the root layout.
Mode: Operate. Audience: members of a small software team, signed in, working alongside
teammates who may be in the same room at the same moment.
Job: see what the team is saying right now, know who is present, say something, and move
between workspaces where their role differs.
Constraints: Next 16 App Router, Tailwind v4 CSS-first tokens, Socket.IO client. Workspace
endpoints do not exist yet (Phase 1 step 5) — their absence is shown honestly, never mocked.

## Direction contract

THESIS: the room is a review thread, not a chat bubble stream. Every utterance is a row with a
gutter, an author, a time, and a read state — refusing the messenger arrangement of alternating
coloured bubbles that this category always ships.

OWN-WORLD: paper ground with ink body text, hairline rules instead of card borders, and a
structural mono gutter running the full height of the thread. Public Sans for text, JetBrains Mono
for figures, ids and gutter marks. One accent, ink indigo, for interactive primary only. Addition
green and removal red are law: they mark real changes and nothing else. No cards, no bubbles, no
avatars-as-decoration; separation comes from rules and space.

STORY: the visitor sees a working record their team is writing together, understands instantly who
is present and what is unread, and answers in the composer without leaving the record.

FIRST VIEWPORT: left rail at 260px lists workspaces with role, and rooms beneath the active one.
The thread column holds a header naming the room with present members' initials and live connection
state, then ruled rows grouped into hunks by author and time window, unread rows marked in the
gutter. The composer is pinned to the bottom of the thread column with the primary action at its
right. Nothing floats; the rail and thread meet on a single hairline.

FORM: the code review thread, candidate 1 of the ordered grounded list, chosen by the user over the
dealt direction; seed key d6a6eb9a.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- Product name: "Colab Workspace" is placeholder; a real name is still to be proposed.
- Accessibility standard: none formally set; keyboard operability and visible focus assumed.
- Workspace API shape: rail is built against `/api/workspaces` and degrades honestly until step 5 lands.
