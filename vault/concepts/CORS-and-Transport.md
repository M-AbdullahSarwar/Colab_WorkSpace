# CORS & Transport

The Phase 0 wall ([[Phase-00-Foundation]]). Two origins (Next app vs realtime server) → the browser
blocks the socket unless the server explicitly allows the app's origin.

- Configure the Socket.IO server's `cors.origin` to the Next app's URL.
- Understand the direction: the **realtime server** must allow the **web app's** origin.
- Don't copy a magic `origin: "*"` — know why the specific origin is allowed.
- Also learn the HTTP-server-vs-Socket.IO-server relationship (Socket.IO attaches to the HTTP server).

Deliverable of [[Phase-00-Foundation]] is fixing this **with understanding**.

## Deepened understanding (learned 2026-07-07)
- **CORS only governs the HTTP long-polling transport, NOT WebSocket.** Browsers don't apply CORS
  to WebSocket handshakes, so Socket.IO's `cors` option only affects the polling path.
- Therefore `transports: ["websocket"]` on the client **bypasses CORS entirely** — a wrong
  `cors.origin` won't block it. To see CORS actually block a connection, force
  `transports: ["polling"]` and use a mismatched origin → browser blocks the XHR, client fires
  `connect_error`, server logs nothing.
- `cors: {}` (empty) is **not** "CORS off" — the `cors` lib defaults `origin` to `*` (allow all).
- **Big lesson: CORS is not a security boundary for a socket server.** It only inconveniences the
  polling transport in a browser; WebSocket clients and non-browser clients ignore it. Real access
  control is server-side: check the `Origin` header (`allowRequest`) and/or require an auth token
  in `socket.handshake.auth` — see [[Auth-HTTP-and-WebSocket]] (Phase 1).
- Client connection events are `connect` / `disconnect` / `connect_error`; the **server** event is
  `connection`. Mixing them up (listening for `connection` on the client) is a common bug.
- **CORS gates the browser READING the response, not the server PROCESSING the request.** With a
  mismatched `origin` on the polling transport: the browser still sends the request, the server
  still handles it + fires `connection` + logs it, then the browser sees the wrong
  `Access-Control-Allow-Origin` and refuses to give the response to your JS (`connect_error`, UI
  shows "No"). So a server-side connection log is **not** proof CORS passed — only the client
  showing connected is. Blocked attempts auto-retry (phantom sessions) and drop on ping timeout.
