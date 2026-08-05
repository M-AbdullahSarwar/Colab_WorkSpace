export interface ClientToServerEvents {
  chat: (chatMessage: string) => void;
}

export interface ServerToClientEvents {
  chat: (chatMessage: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  displayName: string;
}