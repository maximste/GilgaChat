import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./NotFoundPage.hbs?raw";

import "./NotFoundPage.scss";

type NotFoundPageBlockProps = BlockOwnProps;

export class NotFoundPage extends Block<NotFoundPageBlockProps> {
  protected template = template;

  private container: HTMLElement;

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-go-home]")) {
        event.preventDefault();
        window.location.hash = "";

        return;
      }

      if (target.closest("[data-go-back]")) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = "";
        }
      }
    },
  };

  constructor(container: HTMLElement) {
    super({} as NotFoundPageBlockProps);
    this.container = container;
  }

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }
  }
}
