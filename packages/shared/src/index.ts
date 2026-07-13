export interface ClientToServerEvents {
  chat: (chatMessage: string) => void;
}

export interface ServerToClientEvents {
    chat: (chatMessage: string) => void;
}
