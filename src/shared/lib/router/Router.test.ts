/** @jest-environment jsdom */

import { Block, type BlockOwnProps } from "@/shared/ui/block";

import { Router } from "./Router";

class StubPage extends Block<BlockOwnProps> {
  protected template = '<div class="stub-page"></div>';

  constructor() {
    super({});
  }
}

function resetRouterSingleton(): void {
  const ctor = Router as unknown as { __instance?: unknown };

  ctor.__instance = undefined;
}

beforeEach(() => {
  resetRouterSingleton();
  document.body.innerHTML = '<div id="root"></div>';
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  jest.restoreAllMocks();
  resetRouterSingleton();
  window.onpopstate = null;
});

it("Router.use регистрирует маршрут и getRoute его находит", () => {
  const router = new Router("#root", {});

  router.use("/messenger", StubPage as never);

  expect(router.getRoute("/messenger")).toBeDefined();
  expect(router.getRoute("/unknown")).toBeUndefined();
});

it("Router.go вызывает history.pushState и монтирует страницу в корень", () => {
  const pushState = jest.spyOn(window.history, "pushState");
  const router = new Router("#root", {});

  router.use("/messenger", StubPage as never);
  router.start();
  router.go("/messenger");

  expect(pushState).toHaveBeenCalled();
  expect(document.querySelector("#root .stub-page")).not.toBeNull();
});

it("Router с notFoundPath отдаёт запасной маршрут для неизвестного пути через go", () => {
  const router = new Router("#root", { notFoundPath: "/404" });

  router.use("/404", StubPage as never);
  router.use("/home", StubPage as never);
  router.start();
  router.go("/unknown-route");

  expect(document.querySelector("#root .stub-page")).not.toBeNull();
});
