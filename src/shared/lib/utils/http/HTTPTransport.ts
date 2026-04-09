import { type QueryStringData,queryStringify } from "../string/queryStringify";

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
}

class HTTPTransport {
  get = (url: string, options: HTTPRequestOptions = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.GET },
      options.timeout,
    );
  };

  post = (url: string, options: HTTPRequestOptions = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout,
    );
  };

  put = (url: string, options: HTTPRequestOptions = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout,
    );
  };

  delete = (url: string, options: HTTPRequestOptions = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout,
    );
  };

  request = (
    url: string,
    options: HTTPRequestOptions = {},
    timeout = 5000,
  ): Promise<unknown> => {
    const { headers = {}, method, data, responseType } = options;

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

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
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

          resolve(response);
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
  };
}

export { HTTPTransport };
