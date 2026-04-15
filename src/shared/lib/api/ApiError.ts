export type ApiErrorBody = {
  reason?: string;
};

export class ApiError extends Error {
  readonly status: number;

  readonly reason?: string;

  constructor(status: number, message: string, reason?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.reason = reason;
  }
}

export function parseReasonFromXhrResponseText(
  text: string,
): string | undefined {
  try {
    const data = JSON.parse(text) as ApiErrorBody;

    if (typeof data?.reason === "string") {
      return data.reason;
    }
  } catch {
    /* не JSON */
  }

  return undefined;
}
