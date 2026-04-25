import { chatsApi } from "@/shared/lib/api";
import type { ApiUser, ChatSocketTokenResponse } from "@/shared/lib/api/types";
import type { ChatTimelineItem } from "@/shared/lib/types/ChatTimelineTypes";

import { buildChatWebSocketUrl } from "./chatWebSocketUrl";
import type { WsNormalizedChatMessage } from "./chatWsTypes";
import { isRecord } from "./chatWsTypes";
import {
  normalizeBroadcastMessage,
  normalizeHistoryMessage,
} from "./parseWsChatPayload";
import { buildTimelineFromWsMessages } from "./wsMessagesToTimeline";

const PING_MS = 25000;
const GET_OLD_WAIT_MS = 20000;

function extractSocketToken(res: ChatSocketTokenResponse): string {
  const responseRecord = res as Record<string, unknown>;
  const rawToken = responseRecord.token ?? responseRecord.Token;

  if (typeof rawToken !== "string" || !rawToken.trim()) {
    throw new Error("В ответе нет токена WebSocket");
  }

  return rawToken.trim();
}

type ChatMessagesSessionOptions = {
  chatId: number;
  peerDisplayName: string;
  isGroup: boolean;
  getCurrentUser: () => ApiUser | null;
  onTimelineChange: (items: ChatTimelineItem[]) => void;
  onError?: (message: string) => void;
};

type GetOldWaiter = {
  resolve: (batch: Record<string, unknown>[]) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

/**
 * Одно соединение на чат: токен, WS, ping, догрузка истории через `get old`,
 * broadcast и отправка текста.
 */
class ChatMessagesSession {
  readonly chatId: number;

  private readonly peerDisplayName: string;

  private readonly isGroup: boolean;

  private readonly getCurrentUser: () => ApiUser | null;

  private readonly onTimelineChange: (items: ChatTimelineItem[]) => void;

  private readonly onError?: (message: string) => void;

  private ws: WebSocket | null = null;

  private pingTimer: ReturnType<typeof setInterval> | null = null;

  private destroyed = false;

  private readonly messages = new Map<string, WsNormalizedChatMessage>();

  private getOldWaiter: GetOldWaiter | null = null;

  constructor(options: ChatMessagesSessionOptions) {
    this.chatId = options.chatId;
    this.peerDisplayName = options.peerDisplayName;
    this.isGroup = options.isGroup;
    this.getCurrentUser = options.getCurrentUser;
    this.onTimelineChange = options.onTimelineChange;
    this.onError = options.onError;
  }

  async start(): Promise<void> {
    if (this.destroyed) {
      return;
    }
    const user = this.getCurrentUser();

    if (!user) {
      this.onError?.("Нет профиля пользователя");
      this.onTimelineChange([]);

      return;
    }
    let token: string;

    try {
      const res = await chatsApi.postSocketToken(this.chatId);

      token = extractSocketToken(res);
    } catch {
      this.onError?.("Не удалось получить токен чата");
      this.onTimelineChange([]);

      return;
    }
    const url = buildChatWebSocketUrl(user.id, this.chatId, token);

    try {
      await new Promise<void>((resolve, reject) => {
        if (this.destroyed) {
          reject(new Error("cancelled"));

          return;
        }
        const socket = new WebSocket(url);

        this.ws = socket;
        socket.onopen = () => {
          resolve();
        };
        socket.onerror = () => {
          reject(new Error("WebSocket error"));
        };
        socket.onclose = () => {
          if (this.ws === socket) {
            this.ws = null;
          }
          this.stopPing();
        };
        socket.onmessage = (messageEvent) => {
          this.handleSocketMessage(messageEvent.data, user);
        };
      });
    } catch {
      this.onError?.("Не удалось подключиться к чату");
      this.onTimelineChange([]);

      return;
    }
    if (this.destroyed || !this.ws) {
      return;
    }
    this.startPing();
    await this.hydrateMessages(user);
  }

  sendText(text: string): void {
    const trimmed = text.trim();

    if (!trimmed || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    this.ws.send(JSON.stringify({ type: "message", content: trimmed }));
  }

  destroy(): void {
    this.destroyed = true;
    this.rejectGetOldWaiter(new Error("closed"));
    this.stopPing();
    if (this.ws) {
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
  }

  private startPing(): void {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, PING_MS);
  }

  private stopPing(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private rejectGetOldWaiter(err: Error): void {
    if (!this.getOldWaiter) {
      return;
    }
    const waiter = this.getOldWaiter;

    this.getOldWaiter = null;
    clearTimeout(waiter.timer);
    waiter.reject(err);
  }

  private waitForGetOldBatch(): Promise<Record<string, unknown>[]> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.getOldWaiter) {
          this.getOldWaiter = null;
          reject(new Error("Таймаут ожидания истории"));
        }
      }, GET_OLD_WAIT_MS);

      this.getOldWaiter = {
        resolve: (batch) => {
          clearTimeout(timer);
          resolve(batch);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
        timer,
      };
    });
  }

  private sendJson(payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  /** Подтягивает историю через `get old`, начиная с курсора `"0"`. */
  private async hydrateMessages(user: ApiUser): Promise<void> {
    if (this.destroyed || !this.ws) {
      return;
    }
    let cursor = "0";

    try {
      for (
        let iteration = 0;
        iteration < 100 && !this.destroyed;
        iteration += 1
      ) {
        this.sendJson({ type: "get old", content: cursor });
        let batchRaw: Record<string, unknown>[];

        try {
          batchRaw = await this.waitForGetOldBatch();
        } catch {
          break;
        }
        if (batchRaw.length === 0) {
          break;
        }
        const normalized: WsNormalizedChatMessage[] = [];

        for (const row of batchRaw) {
          if (!isRecord(row)) {
            continue;
          }
          const message =
            normalizeHistoryMessage(row) ?? normalizeBroadcastMessage(row);

          if (message) {
            normalized.push(message);
          }
        }
        if (normalized.length === 0) {
          break;
        }
        for (const message of normalized) {
          this.messages.set(message.id, message);
        }
        if (normalized.length < 20) {
          break;
        }
        const nextCursor = normalized[normalized.length - 1].id;

        if (nextCursor === cursor && cursor !== "0") {
          break;
        }
        cursor = nextCursor;
      }
    } finally {
      this.flushTimeline(user);
    }
  }

  private handleSocketMessage(data: unknown, user: ApiUser): void {
    if (this.destroyed) {
      return;
    }
    if (typeof data !== "string") {
      return;
    }
    let parsed: unknown;

    try {
      parsed = JSON.parse(data) as unknown;
    } catch {
      return;
    }
    if (Array.isArray(parsed)) {
      const batch = parsed.filter(isRecord);

      if (this.getOldWaiter) {
        const waiter = this.getOldWaiter;

        this.getOldWaiter = null;
        clearTimeout(waiter.timer);
        waiter.resolve(batch);
      }

      return;
    }
    if (!isRecord(parsed)) {
      return;
    }
    const messageType = parsed.type;

    if (messageType === "pong" || messageType === "ping") {
      return;
    }
    if (messageType === "user connected") {
      return;
    }
    const msg = normalizeBroadcastMessage(parsed);

    if (msg) {
      this.messages.set(msg.id, msg);
      this.flushTimeline(user);
    }
  }

  private flushTimeline(user: ApiUser): void {
    if (this.destroyed) {
      return;
    }
    const items = buildTimelineFromWsMessages([...this.messages.values()], {
      currentUserId: user.id,
      peerDisplayName: this.peerDisplayName,
      isGroup: this.isGroup,
    });

    this.onTimelineChange(items);
  }
}
export { ChatMessagesSession, type ChatMessagesSessionOptions };
