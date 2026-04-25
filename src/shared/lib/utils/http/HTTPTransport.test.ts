import { HTTPTransport } from "./HTTPTransport";

const originalXmlHttpRequest = globalThis.XMLHttpRequest;

type XhrMock = {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  getResponseHeader: jest.Mock;
  status: number;
  statusText: string;
  responseText: string;
  responseType: XMLHttpRequestResponseType;
  response: unknown;
  timeout: number;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  ontimeout: (() => void) | null;
  onabort: (() => void) | null;
};

function installXhrMock(xhrMock: XhrMock): void {
  globalThis.XMLHttpRequest = jest.fn(
    () => xhrMock,
  ) as unknown as typeof XMLHttpRequest;
}

function createJsonXhrMock(overrides: Partial<XhrMock> = {}): XhrMock {
  const xhrMock: XhrMock = {
    open: jest.fn(),
    send: jest.fn(() => {
      queueMicrotask(() => {
        xhrMock.onload?.();
      });
    }),
    setRequestHeader: jest.fn(),
    getResponseHeader: jest.fn(() => "application/json; charset=utf-8"),
    status: 200,
    statusText: "OK",
    responseText: '{"ok":true}',
    responseType: "",
    response: '{"ok":true}',
    timeout: 5000,
    onload: null,
    onerror: null,
    ontimeout: null,
    onabort: null,
    ...overrides,
  };

  return xhrMock;
}

afterEach(() => {
  globalThis.XMLHttpRequest = originalXmlHttpRequest;
  jest.restoreAllMocks();
});

it("HTTPTransport.request отклоняет запрос без метода", async () => {
  const xhrMock = createJsonXhrMock();

  installXhrMock(xhrMock);
  const transport = new HTTPTransport();

  await expect(transport.request("/api", {})).rejects.toThrow(
    "HTTP method is required",
  );
});

it("HTTPTransport.request разбирает JSON при 2xx", async () => {
  const xhrMock = createJsonXhrMock();

  installXhrMock(xhrMock);
  const transport = new HTTPTransport();
  const body = await transport.request<{ ok: boolean }>("/users", {
    method: "GET",
  });

  expect(body).toEqual({ ok: true });
  expect(xhrMock.open).toHaveBeenCalledWith("GET", "/users");
});

it("HTTPTransport.request добавляет query для GET с объектом data", async () => {
  const xhrMock = createJsonXhrMock();

  installXhrMock(xhrMock);
  const transport = new HTTPTransport();

  await transport.request("/search", {
    method: "GET",
    data: { q: "hi", n: 1 },
  });

  const calledUrl = xhrMock.open.mock.calls[0][1] as string;

  expect(calledUrl.startsWith("/search")).toBe(true);
  expect(calledUrl).toContain("q=hi");
  expect(calledUrl).toContain("n=1");
});

it("HTTPTransport.request отклоняет ответ с кодом вне 2xx", async () => {
  const xhrMock = createJsonXhrMock({
    status: 404,
    statusText: "Not Found",
    responseText: "missing",
    getResponseHeader: jest.fn(() => "text/plain"),
  });

  installXhrMock(xhrMock);
  const transport = new HTTPTransport();

  await expect(
    transport.request("/missing", { method: "GET" }),
  ).rejects.toMatchObject({ status: 404 });
});
