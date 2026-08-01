# Auth across HTTP and WebSocket

The Phase 1 trap: **one** token must authenticate both the Next HTTP layer AND the socket handshake.

- Client sends the token in `socket.handshake.auth`.
- Socket.IO **middleware** verifies it once at connect → sets `socket.data.userId`.
- Reuse the same token/session the web app already issues (hand-rolled JWT — [[Decisions]] #9).
- Decide the strategy in Phase 1 and don't revisit it — it's the most common stall point.

Related: [[Realtime-Core]], [[Architecture]] (`assertCan`).

---

## Why socket auth is a different problem (the reasoning)

**The hard constraint:** the browser `WebSocket` API takes only a URL + optional subprotocols — it
**cannot set custom HTTP headers**. So `Authorization: Bearer <token>` is *impossible* from browser
JS on a WS handshake. Every WebSocket auth design exists because of this one limitation.

Given that, the only options are: token in the **query string** (leaks into server/proxy logs and
browser history — avoid), a **cookie** (sent automatically), the **`Sec-WebSocket-Protocol`** field
(a hack), or **the handshake payload** — which is what Socket.IO's `auth: { token }` option wraps.
We use `auth`.

**HTTP auth is per-request; socket auth is per-connection.**

| | HTTP | WebSocket |
|---|---|---|
| Credential sent | every request | **once**, at the handshake |
| Verified | every request | once, at connect |
| Identity stored | `req.user` (one request) | `socket.data` (whole connection) |

## Why `io.use()` middleware, not a check inside `connection`

`io.use` runs **before** the connection is established, so it's a **single chokepoint** — auth can't
be forgotten in a future event handler, and unauthenticated sockets never enter the system. Checking
inside `io.on("connection")` means the socket is already in, and every handler must re-check.

⚠️ **Gotcha:** during middleware the socket isn't connected yet, so **no `disconnect` event fires on
auth failure** — failures appear client-side as **`connect_error`**. Also: `verifyToken` **throws**
on bad signature/expiry, so always `try/catch` in the middleware.

Once set, `socket.data.userId` serves every later event with no crypto and no DB hit — the payoff of
connection-scoped auth.

## Authentication vs Authorization — two layers, two moments

| | Question | When | Mechanism |
|---|---|---|---|
| **Authentication** | *Who are you?* | once, at the handshake | `io.use` → `verifyToken` → `socket.data.userId` |
| **Authorization** | *Are you allowed **this**?* | per action | `assertCan(userId, workspaceId, action)` at `room:join` etc. |

**Do NOT gate the socket connection on workspace membership.** Decided 2026-07-31. A newly
registered user has no workspace and must still be able to connect; removing someone from their
last workspace shouldn't kill a live socket; and "is in *a* workspace" is too coarse — the real
question is always "in **workspace X** with a role permitting **this action**". Connect on identity;
gate on join. See [[Data-Model]] (`Membership.role`).

**A connection is NOT per-workspace.** One socket (per browser tab) multiplexes *all* workspaces via
Socket.IO **rooms** — a socket can be in many rooms at once, and emitting to overlapping rooms
delivers the event once (union). Multiple connections per user = multiple **tabs/devices**, not
multiple workspaces. Pattern for later: also join each socket to a `user:<userId>` room so you can
emit to a person across all their tabs (needed in [[Presence]], Phase 7).

## Does the JWT prove the user still exists? No.

`verifyToken` proves only: (1) we signed it, (2) untampered, (3) unexpired. The `userId` is a
**claim** — the row could have been deleted since. Options: trust the token (0 queries, stale up to
the 7-day expiry) vs **look the user up at the handshake** (1 query per *connection*).
**We do the lookup** — socket middleware runs once per connection (not per message, unlike HTTP), so
it's cheap, and stashing the user record in `socket.data` gives presence the name/avatar for free.

## What goes in the token vs. what you look up

**Rule: identity in the token; everything else from the DB.**
1. **Staleness** — a token is a snapshot frozen at login, valid until expiry (7d). Baking in a
   `role`/`permissions` is a **security hole**: demote an admin and their existing token still says
   admin for a week.
2. **Public** — the payload is base64, not encrypted; anyone holding the token can read every claim.
3. **Size** — it rides along on every request/handshake.

Applied to `SocketData`:
- **`permissions` — removed.** Beyond staleness, it's the *wrong shape*: permissions here are
  **per-workspace** (`Membership.role`), so a user can be OWNER in A and VIEWER in B. A flat array on
  the connection can't express that. Resolve per-workspace at join/action time via `assertCan`.
- **`displayName` — populate from the handshake DB lookup** (which we already run, and were
  discarding). Costs zero extra queries; makes chat/presence show names instead of UUIDs. It *is* a
  cache — stale if the user renames mid-session, which is fine for display and exactly why
  permissions must never be cached this way.

## HS256 vs RS256 (trade-off we accepted)

We sign **HS256** — symmetric HMAC, so the *same* `JWT_SECRET` signs and verifies. That's why
`apps/realtime` needs the identical secret as `apps/web` (mismatch = every token "invalid").
**Cost:** any process holding the secret can also **mint** tokens — realtime only needs to verify,
but gets forging power too. **RS256** (web signs with a private key, realtime verifies with the
public key) is the least-privilege alternative. Staying with HS256 for simplicity; revisit if these
ever become independently-deployed services.

## Token storage trade-off (known simplification)

- **localStorage** (chosen) — readable by any JS on the page → XSS steals the token. OWASP / OAuth
  browser-app guidance **discourages long-lived tokens here**. Chosen because it makes the handshake
  mechanism explicit (the point of the exercise) and avoids a CORS-credentials detour.
- **httpOnly cookie** — JS can't read it (XSS-safe), browser sends it automatically (`withCredentials`
  for cross-origin sockets), but adds **CSRF** risk → mitigate with `SameSite` + `Secure`.
- **Current best practice** — hybrid: short-lived access token **in memory** + refresh token in an
  httpOnly cookie.

➡️ **Revisit before deploying.** This is a deliberate learning-phase simplification, not a
recommendation.

## What middleware is (both worlds)

A function in the pipeline **between input arriving and the handler running** — it can inspect,
modify, reject, or pass along (chain-of-responsibility). It exists for **cross-cutting concerns**
(auth, logging, parsing, CORS, rate limiting): one chokepoint instead of copy-pasting a check into
every handler and eventually forgetting one. Contract: `next()` continues, `next(err)` rejects.
Express `app.use` runs **per request** (→ `req.user`); Socket.IO `io.use` runs **per connection**
(→ `socket.data`). That frequency gap is why a DB lookup is cheap in socket middleware.

## References
- [Middlewares — Socket.IO docs](https://socket.io/docs/v4/middlewares/)
- [Rooms — Socket.IO docs](https://socket.io/docs/v3/rooms/)
- [RS256 vs HS256: deep dive into JWT signing algorithms — WorkOS](https://workos.com/blog/rs256-vs-hs256-jwt-signing-algorithms)
- [WebSocket Authentication — websocket.org](https://websocket.org/guides/authentication/)
- [Essential guide to WebSocket authentication — Ably](https://ably.com/blog/websocket-authentication)
- [Cookies vs localStorage for JWT — OpenReplay](https://blog.openreplay.com/cookies-vs-localstorage-jwt-auth/)
