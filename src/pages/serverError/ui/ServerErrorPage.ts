import { APP_PATHS, appHref } from "@/shared/config/routes";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ServerErrorPage.hbs?raw";

import "./ServerErrorPage.scss";

type ServerErrorPageBlockProps = BlockOwnProps & {
  homeHref: string;
};

class ServerErrorPage extends Block<ServerErrorPageBlockProps> {
  protected template = template;

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-try-again]")) {
        window.location.reload();
      }
    },
  };

  constructor() {
    super({
      homeHref: appHref(APP_PATHS.messenger),
    } as ServerErrorPageBlockProps);
  }
}
export { ServerErrorPage };
