/** Вложение файла в сообщениях WS / истории. */
type WsChatFileMeta = {
  id: number | string;
  user_id: number | string;
  path: string;
  filename: string;
  content_type: string;
  content_size: number | string;
  upload_date: string;
};

type WsChatMessageKind = "message" | "file" | "sticker";

/** Сообщение из broadcast или истории (после нормализации). */
type WsNormalizedChatMessage = {
  id: string;
  time: string;
  userId: string;
  content: string;
  kind: WsChatMessageKind;
  file?: WsChatFileMeta;
};

type WsPingPong =
  | {
      type: "ping";
    }
  | {
      type: "pong";
    };

type WsUserConnected = {
  type: "user connected";
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export {
  isRecord,
  type WsChatFileMeta,
  type WsChatMessageKind,
  type WsNormalizedChatMessage,
  type WsPingPong,
  type WsUserConnected,
};
