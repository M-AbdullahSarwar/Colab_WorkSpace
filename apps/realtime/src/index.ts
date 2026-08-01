import express from "express";
import http from "http";
import { Server } from "socket.io";
import type {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "@colab/shared";
import { verifyToken } from "@colab/shared/auth";
import { prisma } from "@colab/db";

const app = express();
const RT_PORT = process.env.RT_PORT || 4000;
const WEB_PORT = process.env.WEB_PORT || 3000;
const server = http.createServer(app);
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server, {
    cors: {
        origin: `http://localhost:${WEB_PORT}`,
    },
});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }
    try {
        const { userId } = await verifyToken(token);

        const res = await prisma.user.findUnique({ where: { id: userId } });
        if (!res) {
            return next(new Error("Authentication error: User not found"));
        } else socket.data.userId = userId;
    } catch {
        return next(new Error("Authentication error: Invalid token"));
    }
    next();
});

io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.data.userId}`);
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("chat", (chatMessage) => {
        console.log(`Received chat message: ${chatMessage}`);

        io.emit("chat", `User ${socket.data.userId} says: ${chatMessage}`); // Broadcast the chat message to all connected clients
    });
});

server.listen(RT_PORT, () => {
    console.log(`Server is running on port ${RT_PORT}`);
});
