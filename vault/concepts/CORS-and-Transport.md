# CORS & Transport

The Phase 0 wall ([[Phase-00-Foundation]]). Two origins (Next app vs realtime server) → the browser
blocks the socket unless the server explicitly allows the app's origin.

- Configure the Socket.IO server's `cors.origin` to the Next app's URL.
- Understand the direction: the **realtime server** must allow the **web app's** origin.
- Don't copy a magic `origin: "*"` — know why the specific origin is allowed.
- Also learn the HTTP-server-vs-Socket.IO-server relationship (Socket.IO attaches to the HTTP server).

Deliverable of [[Phase-00-Foundation]] is fixing this **with understanding**.
