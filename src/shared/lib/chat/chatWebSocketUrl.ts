import { API_HOST, isDevApiProxy } from "@/shared/config/api";

/** `wss://…/ws/chats/<userId>/<chatId>/<token>` — путь вне `/api/v2`. */
export function buildChatWebSocketUrl(
  userId: number,
  chatId: number,
  token: string,
): string {
  if (isDevApiProxy && typeof location !== "undefined") {
    const wsScheme = location.protocol === "https:" ? "wss" : "ws";

    return `${wsScheme}://${location.host}/ws/chats/${userId}/${chatId}/${encodeURIComponent(token)}`;
  }

  const origin = API_HOST.replace(/^https:/i, "wss:").replace(/^http:/i, "ws:");

  return `${origin}/ws/chats/${userId}/${chatId}/${encodeURIComponent(token)}`;
}
