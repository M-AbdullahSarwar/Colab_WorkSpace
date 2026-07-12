import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const RT_PORT = process.env.RT_PORT || 4000;
const WEB_PORT = process.env.WEB_PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:9999`,
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
});

server.listen(RT_PORT, () => {
  console.log(`Server is running on port ${RT_PORT}`);
});
