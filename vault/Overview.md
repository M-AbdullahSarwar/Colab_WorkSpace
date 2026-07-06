# Overview

**What:** a Collaborative AI Workspace — teams share AI chat rooms, co-edit prompts/docs live
(Google-Docs style), get AI-generated editable documents, share team-wide AI memory/context, see
live presence/cursors, run AI actions on selected text, and keep version history.

**Why:** a **learning project**. Primary goal: master real-time sharing/editing (WebSocket presence,
concurrent editing, shared state). Shipping features is secondary to understanding the hard parts.

## Working style
The **user writes the code**. My role is to guide, explain, review, and unblock — not to implement.
Redundant boilerplate (Next scaffold, Prisma init, Docker) may be generated; the real-time layer is
written by hand because that's the lesson. See [[Decisions]].

## The 7 features
1. Shared AI chat rooms — a conversation belongs to a ROOM, not one user.
2. Multi-user prompt editing — live, concurrent.
3. AI-generated editable documents.
4. Shared memory/context — workspace-wide AI context.
5. Real-time presence — online / typing / cursors.
6. AI actions on selected content — improve / shorten / translate…
7. Version history — Git-like document versions.

## Stack
Next.js + Tailwind (web) · Node + Express + Socket.IO (realtime, **own process**) · PostgreSQL +
Prisma · provider-agnostic AI. Details in [[Architecture]].

See also: `../ROADMAP.md`, memory `project-collaborative-ai-workspace`.
