import { Block, type BlockOwnProps } from "@/shared/ui/block";

import { Route } from "./Route";

class StubPage extends Block<BlockOwnProps> {
  protected template = '<div class="stub-page"></div>';

  constructor() {
    super({});
  }
}

it("Route.match совпадает с нормализованным путём без учёта регистра", () => {
  const route = new Route("/Chat", StubPage as never, { rootQuery: "#app" });

  expect(route.match("/chat")).toBe(true);
  expect(route.match("/CHAT")).toBe(true);
  expect(route.match("/other")).toBe(false);
});
