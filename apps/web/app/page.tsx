"use client";

import { io, Socket } from "socket.io-client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import type { ClientToServerEvents, ServerToClientEvents } from "@colab/shared";
import { Button } from "@/components/ui";
import {
  IconEmpty,
  IconPlus,
  IconSend,
  IconSignOut,
  IconThread,
} from "@/components/icons";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type Status = "connecting" | "live" | "offline";

type Row = {
  id: number;
  author: string | null;
  text: string;
  at: number;
  mine: boolean;
};

type StoredUser = { firstName?: string; lastName?: string; email?: string };

// Display-only cache. Read as an external store so it stays hydration-safe
// and never needs a setState inside an effect.
function subscribeToUser(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function readStoredUser() {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem("user");
}

type Workspace = { id: string; name: string; role?: string };
type RailState =
  | { kind: "loading" }
  | { kind: "ready"; workspaces: Workspace[] }
  | { kind: "unbuilt" }
  | { kind: "error"; detail: string };

// TEMPORARY SEAM — the server broadcasts one flat string ("User X says: Y"), so
// author and text have to be recovered from it here. Delete this the moment the
// chat event carries a structured payload.
const BROADCAST = /^User (.+?) says: ([\s\S]*)$/;

function parseBroadcast(raw: string): { author: string | null; text: string } {
  const match = BROADCAST.exec(raw);
  if (!match) return { author: null, text: raw };
  return { author: match[1] ?? null, text: match[2] ?? "" };
}

// Inline `code` spans: the affordance the chosen world is named after.
function renderText(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        className="font-mono text-[0.8125rem] px-1 py-0.5 rounded-xs bg-sunk border border-rule"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function clockTime(at: number): string {
  return new Date(at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_COPY: Record<Status, string> = {
  connecting: "Connecting",
  live: "Live",
  offline: "Not connected",
};

const STATUS_TONE: Record<Status, string> = {
  connecting: "bg-warn",
  live: "bg-add",
  offline: "bg-remove",
};

export default function Home() {
  const [socket, setSocket] = useState<ClientSocket | null>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [failure, setFailure] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState("");
  const [rail, setRail] = useState<RailState>({ kind: "loading" });
  const [railOpen, setRailOpen] = useState(false);
  const storedUser = useSyncExternalStore(
    subscribeToUser,
    readStoredUser,
    () => null,
  );
  const me = useMemo<StoredUser | null>(() => {
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }, [storedUser]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  // Index of the first row the reader has not caught up with.
  const [unreadFrom, setUnreadFrom] = useState<number | null>(null);

  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(0);
  const rowCountRef = useRef(0);
  const pinnedRef = useRef(true);

  const myName = useMemo(() => {
    if (!me) return null;
    return [me.firstName, me.lastName].filter(Boolean).join(" ") || null;
  }, [me]);

  const myNameRef = useRef<string | null>(null);
  useEffect(() => {
    myNameRef.current = myName;
  }, [myName]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // The rail asks for real workspaces. The endpoint does not exist yet
    // (Phase 1, step 5), so a 404 is a known state, not an error to shout about.
    fetch("/api/workspaces", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 404) return setRail({ kind: "unbuilt" });
        if (!response.ok)
          return setRail({
            kind: "error",
            detail: `Workspaces request failed (${response.status})`,
          });
        const data = (await response.json()) as { workspaces?: Workspace[] };
        setRail({ kind: "ready", workspaces: data.workspaces ?? [] });
      })
      .catch(() =>
        setRail({
          kind: "error",
          detail: "Could not reach the server to load workspaces.",
        }),
      );

    const socketInstance: ClientSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        // Function form: re-read on every reconnect attempt, so a changed
        // token is never resent stale.
        auth: (cb) => cb({ token: localStorage.getItem("token") }),
      },
    );

    socketInstance.on("connect", () => {
      setStatus("live");
      setFailure(null);
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      setStatus("offline");
      setSocket(null);
    });

    socketInstance.on("connect_error", (err) => {
      setStatus("offline");
      setFailure(err.message);
      setSocket(null);
    });

    socketInstance.on("chat", (chatMessage) => {
      const { author, text } = parseBroadcast(chatMessage);
      const caughtUp =
        pinnedRef.current && document.visibilityState === "visible";
      if (!caughtUp) {
        setUnreadFrom((from) => (from === null ? rowCountRef.current : from));
      }
      rowCountRef.current += 1;
      setRows((prev) => [
        ...prev,
        {
          id: nextId.current++,
          author,
          text,
          at: Date.now(),
          mine: author !== null && author === myNameRef.current,
        },
      ]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [router]);

  // Only follow the thread when the reader is already at the end, so reading an
  // older row is never hijacked by a teammate typing.
  useEffect(() => {
    if (pinnedRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [rows.length]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    pinnedRef.current = pinned;
    if (pinned && document.visibilityState === "visible") setUnreadFrom(null);
  }, []);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text || !socket) return;
    socket.emit("chat", text);
    setDraft("");
    pinnedRef.current = true;
  }, [draft, socket]);

  const signOut = useCallback(() => {
    socket?.disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router, socket]);

  // Real data only: who has actually spoken in this session. Live presence is
  // Phase 7 and is not faked here.
  const speakers = useMemo(() => {
    const seen = new Set<string>();
    for (const row of rows) if (row.author) seen.add(row.author);
    return [...seen];
  }, [rows]);

  const unreadCount = unreadFrom === null ? 0 : rows.length - unreadFrom;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="flex items-center justify-between h-12 px-4 border-b border-rule shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setRailOpen((open) => !open)}
            aria-expanded={railOpen}
            aria-label="Toggle workspaces"
            className="md:hidden text-ink-muted hover:text-ink"
          >
            <IconThread className="w-4 h-4" />
          </button>
          <span className="flex items-center gap-2 text-sm font-semibold tracking-[-0.01em] truncate">
            <IconThread className="w-4 h-4 text-accent hidden md:block" />
            Colab Workspace
          </span>
        </div>
        <div className="flex items-center gap-3">
          {myName ? (
            <span className="hidden sm:inline text-sm text-ink-muted">
              {myName}
            </span>
          ) : null}
          <Button variant="quiet" onClick={signOut} className="h-8 px-2.5">
            <IconSignOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <nav
          className={`${
            railOpen ? "flex" : "hidden"
          } md:flex w-full md:w-65 shrink-0 border-r border-rule flex-col`}
        >
          <div className="flex items-center justify-between px-4 h-11 shrink-0">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Workspaces
            </h2>
            <button
              type="button"
              aria-disabled
              aria-label="Create workspace — available once Phase 1 step 5 lands"
              onClick={(event) => event.preventDefault()}
              className="text-ink-faint cursor-not-allowed"
            >
              <IconPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 pb-4 min-h-0 overflow-y-auto">
            {rail.kind === "loading" ? (
              <p className="text-sm text-ink-muted">Loading…</p>
            ) : rail.kind === "ready" && rail.workspaces.length > 0 ? (
              <ul className="flex flex-col gap-0.5">
                {rail.workspaces.map((workspace) => (
                  <li key={workspace.id}>
                    <button
                      type="button"
                      onClick={() => setActiveWorkspaceId(workspace.id)}
                      aria-current={
                        activeWorkspaceId === workspace.id ? "true" : undefined
                      }
                      className={`w-full flex items-baseline justify-between gap-2 px-2 py-1.5 rounded-[3px] text-left text-sm transition-colors duration-150 ${
                        activeWorkspaceId === workspace.id
                          ? "bg-accent-wash text-ink font-medium"
                          : "text-ink hover:bg-sunk"
                      }`}
                    >
                      <span className="truncate">{workspace.name}</span>
                      {workspace.role ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint shrink-0">
                          {workspace.role}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : rail.kind === "error" ? (
              <p className="text-sm text-remove leading-relaxed">
                {rail.detail}
              </p>
            ) : (
              <p className="text-sm text-ink-muted leading-relaxed">
                Not built yet — workspaces, membership and roles are the next
                step. Every signed-in member shares one room until then.
              </p>
            )}
          </div>

          <div className="mt-auto px-4 py-3 border-t border-rule">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${STATUS_TONE[status]}`}
                aria-hidden
              />
              <span className="text-xs text-ink-muted">
                {STATUS_COPY[status]}
              </span>
            </div>
            {failure ? (
              <p className="mt-1 font-mono text-[11px] text-remove wrap-break-word">
                {failure}
              </p>
            ) : null}
          </div>
        </nav>

        <main
          className={`${
            railOpen ? "hidden" : "flex"
          } md:flex flex-1 flex-col min-w-0`}
        >
          <div className="flex items-baseline justify-between gap-4 h-11 px-4 md:px-5 border-b border-rule shrink-0">
            <h1 className="text-sm font-semibold tracking-[-0.01em]">General</h1>
            <div className="flex items-center gap-3">
              {unreadCount > 0 ? (
                <span className="tnum font-mono text-[11px] text-accent">
                  {unreadCount} unread
                </span>
              ) : null}
              <span
                className={`w-1.5 h-1.5 rounded-full ${STATUS_TONE[status]}`}
                title={STATUS_COPY[status]}
                aria-hidden
              />
              {speakers.length > 0 ? (
                <div className="flex items-center gap-1">
                  {speakers.map((name) => (
                    <span
                      key={name}
                      title={name}
                      className="w-5 h-5 grid place-items-center rounded-[3px] bg-sunk border border-rule font-mono text-[10px] text-ink-muted"
                    >
                      {initials(name)}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex-1 overflow-y-auto min-h-0"
          >
            <div className="relative min-h-full">
            {/* Spans the thread's own height, not the scrollport. */}
            <div
              className="absolute inset-y-0 left-0 w-18 bg-sunk border-r border-rule"
              aria-hidden
            />

            {rows.length === 0 ? (
              <div className="h-full grid place-items-center px-6 relative">
                <div className="text-center max-w-88">
                  <IconEmpty className="w-8 h-8 mx-auto text-rule-strong" />
                  <p className="mt-4 text-sm text-ink">
                    Nothing in this thread yet.
                  </p>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                    Messages are broadcast to everyone connected. Open a second
                    browser and sign in as another member to watch it work.
                  </p>
                </div>
              </div>
            ) : (
              <ol className="relative">
                {rows.map((row, index) => {
                  const previous = rows[index - 1];
                  // Consecutive lines from one author inside five minutes read
                  // as one hunk with a single header.
                  const grouped =
                    previous != null &&
                    previous.author === row.author &&
                    row.at - previous.at < 5 * 60 * 1000;
                  const unread = unreadFrom !== null && index >= unreadFrom;

                  return (
                    <li
                      key={row.id}
                      className="row-in grid grid-cols-[4.5rem_1fr] border-b border-rule"
                    >
                      <div className="relative px-2 md:px-4 py-2 text-right">
                        {unread ? (
                          <span
                            className="absolute inset-y-0 left-0 w-0.5 bg-accent"
                            title="Unread"
                          />
                        ) : null}
                        <span className="tnum font-mono text-[10px] md:text-[11px] text-ink-faint">
                          {grouped ? "" : clockTime(row.at)}
                        </span>
                      </div>
                      <div className="px-4 md:px-5 py-2 min-w-0">
                        {grouped ? null : (
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-ink">
                              {row.author ?? "Server"}
                            </span>
                            {row.mine ? (
                              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                                you
                              </span>
                            ) : null}
                          </div>
                        )}
                        <p className="text-sm text-ink leading-relaxed wrap-break-word whitespace-pre-wrap max-w-[68ch]">
                          {renderText(row.text)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-rule px-4 md:px-5 py-3 shrink-0">
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <label htmlFor="composer" className="sr-only">
                Write to the room
              </label>
              <textarea
                id="composer"
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  // Enter sends; Shift+Enter keeps the newline, so a message
                  // can hold a block of code.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={status !== "live"}
                placeholder={
                  status === "live"
                    ? "Write to the room — Shift+Enter for a new line"
                    : "Reconnect to write to the room"
                }
                className="flex-1 min-h-9 max-h-40 py-2 px-3 bg-surface text-ink text-sm font-sans rounded-[3px] border border-rule hover:border-rule-strong disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 resize-y"
              />
              <Button
                type="submit"
                disabled={status !== "live" || !draft.trim()}
              >
                <IconSend className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
