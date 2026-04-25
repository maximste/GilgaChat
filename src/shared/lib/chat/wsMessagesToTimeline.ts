import { resourceFileUrl } from "@/shared/config/api";
import type { ChatTimelineItem } from "@/shared/lib/types/ChatTimelineTypes";

import type { WsNormalizedChatMessage } from "./chatWsTypes";

function formatTimeLabel(isoOrFree: string): string {
  const date = new Date(isoOrFree);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return isoOrFree;
}

function dateKey(isoOrFree: string): string {
  const date = new Date(isoOrFree);

  if (!Number.isNaN(date.getTime())) {
    return date.toDateString();
  }

  return isoOrFree.slice(0, 10);
}

function datePillLabel(isoOrFree: string): string {
  const date = new Date(isoOrFree);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return isoOrFree;
}

function bodyText(msg: WsNormalizedChatMessage): string {
  if (msg.kind === "message") {
    return msg.content;
  }

  if (msg.kind === "sticker") {
    return "Sticker";
  }

  return msg.file?.filename ? `📎 ${msg.file.filename}` : "File";
}

function mediaUrl(msg: WsNormalizedChatMessage): string | undefined {
  if (!msg.file?.path) {
    return undefined;
  }

  const contentType = (msg.file.content_type ?? "").toLowerCase();

  if (contentType.startsWith("image/")) {
    return resourceFileUrl(msg.file.path);
  }

  return undefined;
}

/**
 * Сортирует по времени (и по id), строит разделители дат и элементы ленты.
 */
export function buildTimelineFromWsMessages(
  messages: WsNormalizedChatMessage[],
  options: {
    currentUserId: number;
    peerDisplayName: string;
    isGroup: boolean;
  },
): ChatTimelineItem[] {
  const me = String(options.currentUserId);
  const sorted = [...messages].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();

    if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    }

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  const rows: ChatTimelineItem[] = [];
  let lastDateKey = "";

  for (const msg of sorted) {
    const dayKey = dateKey(msg.time);

    if (dayKey !== lastDateKey) {
      lastDateKey = dayKey;
      rows.push({ dateLabel: datePillLabel(msg.time) });
    }

    const incoming = msg.userId !== me;
    const time = formatTimeLabel(msg.time);
    const text = bodyText(msg);
    const mediaImageUrl = mediaUrl(msg);

    if (incoming) {
      const author = options.isGroup
        ? `User ${msg.userId}`
        : options.peerDisplayName;

      rows.push({
        incoming: true,
        author,
        time,
        text,
        serverMessageId: msg.id,
        mediaImageUrl,
      });
    } else {
      rows.push({
        incoming: false,
        time,
        text,
        serverMessageId: msg.id,
        mediaImageUrl,
        hasImage: Boolean(mediaImageUrl),
      });
    }
  }

  return rows;
}
