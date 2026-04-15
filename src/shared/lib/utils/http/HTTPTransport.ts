import { type QueryStringData, queryStringify } from "../string/queryStringify";
import { HttpStatus } from "./httpStatus";

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

type HttpMethod = (typeof METHODS)[keyof typeof METHODS];

export type RequestBodyData =
  | Record<string, unknown>
  | FormData
  | string
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | URLSearchParams;

export interface HTTPRequestOptions {
  headers?: Record<string, string>;
  method?: HttpMethod;
  data?: RequestBodyData;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  withCredentials?: boolean;
}

/** Один HTTP-глагол: URL, опции без обязательного `method` (подставляется фабрикой). */
export type HTTPMethodFn = <R = unknown>(
  url: string,
  options?: Partial<HTTPRequestOptions>,
) => Promise<R>;

class HTTPTransport {
  private createMethod(method: HttpMethod): HTTPMethodFn {
    return <R = unknown>(
      url: string,
      options: Partial<HTTPRequestOptions> = {},
    ) => this.request<R>(url, { ...options, method });
  }

  protected readonly get = this.createMethod(METHODS.GET);

  protected readonly post = this.createMethod(METHODS.POST);

  protected readonly put = this.createMethod(METHODS.PUT);

  protected readonly delete = this.createMethod(METHODS.DELETE);

  request<R = unknown>(
    url: string,
    options: HTTPRequestOptions = {},
  ): Promise<R> {
    const {
      headers = {},
      method,
      data,
      responseType,
      withCredentials,
      timeout: optTimeout,
    } = options;

    const timeout = optTimeout ?? 5000;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("HTTP method is required"));

        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      const urlWithQuery =
        isGet && data && typeof data === "object" && !(data instanceof FormData)
          ? `${url}${queryStringify(data as QueryStringData)}`
          : url;

      xhr.open(method, urlWithQuery);
      xhr.withCredentials = withCredentials ?? false;

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (
          xhr.status >= HttpStatus.Ok &&
          xhr.status < HttpStatus.MultipleChoices
        ) {
          let response: unknown;

          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
              const contentType = xhr.getResponseHeader("Content-Type");

              if (contentType && contentType.includes("application/json")) {
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } catch {
              response = xhr.responseText;
            }
          }

          resolve(response as R);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr,
          });
        }
      };

      xhr.onabort = () =>
        reject({
          reason: "Request aborted",
          request: xhr,
        });

      xhr.onerror = () =>
        reject({
          reason: "Network error",
          request: xhr,
        });

      xhr.timeout = timeout;

      xhr.ontimeout = () =>
        reject({
          reason: "Request timeout",
          timeout: timeout,
          request: xhr,
        });

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else if (typeof data === "object") {
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data);
      }
    });
  }
}

export { HTTPTransport };
