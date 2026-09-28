# Product

<!-- impeccable:product-schema 1 -->

> Impeccable's machine-read product record. The **[Obsidian vault](vault/)** remains this project's
> single source of truth (see `CLAUDE.md`); this file restates only the product facts the design
> tooling needs. When the two disagree, the vault wins and this file gets corrected.

## Platform

web

## Users

Small software teams who already use AI assistants individually and want to use one **together**.
The author's own colleagues are the first real users — confirmed 2026-09-28 as a tool intended for
actual team use, not a demo or portfolio piece. A team member is signed in, in a browser, alongside
other members who may be working in the same room at the same moment.

Roles are a product fact, not a future idea: a workspace has an OWNER, ADMIN, EDITOR and VIEWER
(`Role` enum, `Membership` model), so the same surface is seen by people with different powers.

## Product Purpose

A collaborative AI workspace. Teams share AI chat rooms, co-edit prompts and documents live, keep
workspace-wide AI memory/context, see each other's presence and cursors, run AI actions on selected
text, and keep version history.

Success: a team holds **one** AI conversation together — visible to everyone in the room as it
happens — instead of each person holding a private conversation and pasting the results to each other.

## Positioning

**The AI conversation belongs to the room, not to a user account.** In every mainstream assistant a
chat is private to one person and shared only by copy-paste; here presence, message history, memory
and document state are properties of a workspace that teammates occupy simultaneously.

## Operating Context

- Browser, multiple people connected at once; one socket per tab, multiple tabs/devices per person.
- Work is organised into **workspaces**; membership and role govern what a person may do in each.
  A person can be OWNER of one workspace and VIEWER of another at the same time.
- Two server processes: the Next.js web app (HTTP + UI) and a standalone Socket.IO realtime server.
  One JWT authenticates both — an `Authorization` header per HTTP request, the handshake payload
  once per socket connection.

## Capabilities and Constraints

**Works today (2026-09-28):** email/password registration and login (bcrypt + hand-rolled JWT);
authenticated socket handshake rejecting missing, forged and orphaned tokens; a single global chat
room broadcasting to every connected client.

**In progress (Phase 1, step 5):** workspace creation, `Membership` rows, an `assertCan`
authorization check shared by both processes, `room:join` gating, role-gated UI.

**Confirmed UI scope for the current design work:** what works today **plus** Phase 1 workspaces.
No placeholder surfaces for unbuilt phases (decided 2026-09-28).

**Confirmed product structure (2026-09-28):** the app has **two working surfaces**, not one.
1. **Rooms** — the live review thread that exists today.
2. **Documents** — a shared prompt/document the team writes together in real time, Google-Docs
   style, where a member can select a passage and run AI assistance on that selection. Confirmed by
   the user as a **separate surface** from the room, not a mode of it. This is the product's hardest
   and most distinctive half; it is Phases 5–8 on the roadmap and is not started.

**Also confirmed missing (2026-09-28):** **user management** — viewing a workspace's members,
their roles, inviting people and changing or revoking a role. It depends on `Membership` +
`assertCan`, so it belongs to Phase 1 step 5.

**Planned, not built** (Phases 2–9, see `vault/phases/Phases.md`): AI streaming into the room,
shared memory/context, collaborative editing (naive then Yjs CRDT), presence and live cursors, AI
actions on selection, version history.

**Technical constraints:** Next.js 16 App Router; Tailwind v4 with CSS-first `@theme` tokens;
Socket.IO; PostgreSQL via Prisma 7; pnpm workspaces monorepo. The realtime layer is hand-written by
the author on purpose — UI styling is the part that may be generated.

**Known simplification:** the token lives in `localStorage` (XSS-readable), accepted deliberately to
keep the handshake mechanism explicit. To be revisited before any deployment.

## Brand Commitments

None established. "Colab Workspace" is **placeholder scaffold text**, confirmed 2026-09-28 — a real
name is to be proposed during visual-world work. No logo, wordmark, palette, typeface, voice guide
or brand asset exists. Future work must not present invented brand elements as existing ones.

## Evidence on Hand

None. There are no customers, testimonials, case studies, usage metrics, press, screenshots or
demo recordings, and no pricing, licensing or deployment story. The product has never been
deployed — it runs locally against a Postgres container. **None of this may be fabricated** to fill
a surface; absent evidence is an absence to design around.

Real content available for the UI: the authenticated user's own name and email, their workspaces and
roles, and live chat messages from a running session.

## Product Principles

1. **The room owns the conversation.** Any surface should make shared state — who is here, who said
   what, what is synced — legible before it is pretty.
2. **Authorization is per-workspace and always fresh.** Never cache a role in the UI, the token or
   the socket connection; a demoted member must lose access immediately.
3. **Show only what is real.** No placeholder surfaces for unbuilt phases; an honest gap is more
   useful to this project than a convincing mock.
4. **Identity is visible.** People, not UUIDs — the interface should name whoever is acting.
5. **Multi-user reality is the default case.** Design for two or more people present at once, not
   for the single-user happy path with collaboration bolted on.

## Accessibility & Inclusion

No product-specific standard has been established yet — recorded as an open decision rather than
assumed. Baseline keyboard operability and visible focus are expected of any surface built here.
