import express from "express";
import http from "http";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@colab/shared";

const app = express();
const RT_PORT = process.env.RT_PORT || 4000;
const WEB_PORT = process.env.WEB_PORT || 3000;
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: `http://localhost:${WEB_PORT}`,
  },
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat", (chatMessage) => {
    console.log(`Received chat message: ${chatMessage}`);

    io.emit("chat", `socket with ID ${socket.id} says: ${chatMessage}`); // Broadcast the chat message to all connected clients
  });
});

server.listen(RT_PORT, () => {
  console.log(`Server is running on port ${RT_PORT}`);
});
