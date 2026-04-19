import { apiAbsolutePath } from "@/shared/config/api";
import { type HTTPRequestOptions, HTTPTransport } from "@/shared/lib/utils";

import { ApiError, parseReasonFromXhrResponseText } from "./ApiError";

const transport = new HTTPTransport();

type RejectionPayload = {
  status?: number;
  statusText?: string;
  response?: string;
  reason?: string;
};

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) {
    return err;
  }

  const p = err as RejectionPayload;
  const status = typeof p.status === "number" ? p.status : 0;
  const body = typeof p.response === "string" ? p.response : "";
  const reason = parseReasonFromXhrResponseText(body);
  const message =
    reason ?? p.statusText ?? (status ? `HTTP ${status}` : "Network error");

  return new ApiError(status, message, reason);
}

export async function apiRequest<T = unknown>(
  path: string,
  options: HTTPRequestOptions & {
    method: NonNullable<HTTPRequestOptions["method"]>;
  },
): Promise<T> {
  const url = apiAbsolutePath(path);

  const withCredentials = options.withCredentials ?? true;

  try {
    return (await transport.request(url, {
      ...options,
      withCredentials,
    })) as T;
  } catch (e) {
    throw toApiError(e);
  }
}

export const apiGet = <T = unknown>(
  path: string,
  data?: HTTPRequestOptions["data"],
) => apiRequest<T>(path, { method: "GET", data });

export const apiPost = <T = unknown>(
  path: string,
  data?: HTTPRequestOptions["data"],
) => apiRequest<T>(path, { method: "POST", data });

export const apiPut = <T = unknown>(
  path: string,
  data?: HTTPRequestOptions["data"],
) => apiRequest<T>(path, { method: "PUT", data });

export const apiDelete = <T = unknown>(
  path: string,
  data?: HTTPRequestOptions["data"],
) => apiRequest<T>(path, { method: "DELETE", data });
