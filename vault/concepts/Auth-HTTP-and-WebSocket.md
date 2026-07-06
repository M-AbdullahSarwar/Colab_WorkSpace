# Auth across HTTP and WebSocket

The Phase 1 trap: **one** token must authenticate both the Next HTTP layer AND the socket handshake.

- Client sends the token in `socket.handshake.auth`.
- Socket.IO **middleware** verifies it once at connect → sets `socket.data.userId`.
- Reuse the same token/session the web app already issues (Auth.js or hand-rolled JWT).
- Decide the strategy in Phase 1 and don't revisit it — it's the most common stall point.

Related: [[Realtime-Core]], [[Architecture]] (`assertCan`).
