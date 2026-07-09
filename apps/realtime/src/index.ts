import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
    }
});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});