import { APP_PATHS, appHref } from "@/shared/config/routes";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./NotFoundPage.hbs?raw";

import "./NotFoundPage.scss";

type NotFoundPageBlockProps = BlockOwnProps & { homeHref: string };

export class NotFoundPage extends Block<NotFoundPageBlockProps> {
  protected template = template;

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-go-back]")) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.assign(appHref(APP_PATHS.home));
        }
      }
    },
  };

  constructor() {
    super({ homeHref: appHref(APP_PATHS.home) } as NotFoundPageBlockProps);
  }
}
