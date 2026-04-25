import type { WsChatFileMeta, WsNormalizedChatMessage } from "./chatWsTypes";
import { isRecord } from "./chatWsTypes";

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function parseFile(raw: unknown): WsChatFileMeta | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  return {
    id: raw.id as number | string,
    user_id: raw.user_id as number | string,
    path: asString(raw.path),
    filename: asString(raw.filename),
    content_type: asString(raw.content_type),
    content_size: raw.content_size as number | string,
    upload_date: asString(raw.upload_date),
  };
}

/** Элемент массива ответа `get old` (нужен `id` для следующего запроса `get old`). */
export function normalizeHistoryMessage(
  raw: Record<string, unknown>,
): WsNormalizedChatMessage | null {
  const kind = asString(raw.type) as WsNormalizedChatMessage["kind"];

  if (kind !== "message" && kind !== "file" && kind !== "sticker") {
    return null;
  }

  const rawId = raw.id ?? raw.message_id ?? raw.messageId ?? raw.msg_id;

  if (rawId === undefined || rawId === null || asString(rawId) === "") {
    return null;
  }

  const id = asString(rawId);

  return {
    id,
    time: asString(raw.time),
    userId: asString(raw.user_id),
    content: asString(raw.content),
    kind,
    file: parseFile(raw.file),
  };
}

/** Broadcast нового сообщения. */
export function normalizeBroadcastMessage(
  raw: Record<string, unknown>,
): WsNormalizedChatMessage | null {
  const kind = asString(raw.type) as WsNormalizedChatMessage["kind"];

  if (kind !== "message" && kind !== "file" && kind !== "sticker") {
    return null;
  }

  const id = asString(raw.id);

  if (!id) {
    return null;
  }

  return {
    id,
    time: asString(raw.time),
    userId: asString(raw.user_id),
    content: asString(raw.content),
    kind,
    file: parseFile(raw.file),
  };
}
