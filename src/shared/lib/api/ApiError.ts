type ApiErrorBody = {
  reason?: string;
};

class ApiError extends Error {
  readonly status: number;

  readonly reason?: string;

  constructor(status: number, message: string, reason?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.reason = reason;
  }
}

function parseReasonFromXhrResponseText(text: string): string | undefined {
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

export { ApiError, type ApiErrorBody, parseReasonFromXhrResponseText };
