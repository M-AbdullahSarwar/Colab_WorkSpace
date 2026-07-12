"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const WEB_PORT = process.env.WEB_PORT || 3000;
const RT_PORT = process.env.RT_PORT || 4000;

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL ||
        `http://localhost:${RT_PORT}`,
      {
        transports: ["websocket"], // Forces websockets immediately instead of polling
      },
    );
    socketInstance.on("connect", () => {
      setSocket(socketInstance);
    });
    socketInstance.on("disconnect", () => {
      setSocket(null);
    });
    socketInstance.on("connect_error", () => {
      console.log("Connection error");
      setSocket(null);
    });

    // Clean up and close connection when the user leaves or closes the app
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>Socket Connected: {socket ? "Yes" : "No"}</p>
    </div>
  );
}
