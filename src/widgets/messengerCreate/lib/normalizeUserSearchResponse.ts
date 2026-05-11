import type { ApiUser } from "@/shared/lib/api/types";

/** Бэкенд может вернуть массив или обёртку `{ users: [...] }` / `{ data: [...] }`. */
function normalizeUserSearchResponse(raw: unknown): ApiUser[] {
  if (Array.isArray(raw)) {
    return raw as ApiUser[];
  }
  if (raw !== null && typeof raw === "object") {
    const o = raw as Record<string, unknown>;

    if (Array.isArray(o.users)) {
      return o.users as ApiUser[];
    }
    if (Array.isArray(o.data)) {
      return o.data as ApiUser[];
    }
  }

  return [];
}

export { normalizeUserSearchResponse };
