/** Вложение файла в сообщениях WS / истории. */
export type WsChatFileMeta = {
  id: number | string;
  user_id: number | string;
  path: string;
  filename: string;
  content_type: string;
  content_size: number | string;
  upload_date: string;
};

export type WsChatMessageKind = "message" | "file" | "sticker";

/** Сообщение из broadcast или истории (после нормализации). */
export type WsNormalizedChatMessage = {
  id: string;
  time: string;
  userId: string;
  content: string;
  kind: WsChatMessageKind;
  file?: WsChatFileMeta;
};

export type WsPingPong = { type: "ping" } | { type: "pong" };

export type WsUserConnected = {
  type: "user connected";
  content: string;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
