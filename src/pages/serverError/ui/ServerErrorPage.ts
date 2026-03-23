import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ServerErrorPage.hbs?raw";

import "./ServerErrorPage.scss";

type ServerErrorPageBlockProps = BlockOwnProps;

export class ServerErrorPage extends Block<ServerErrorPageBlockProps> {
  protected template = template;

  private container: HTMLElement;

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-try-again]")) {
        window.location.reload();

        return;
      }

      if (target.closest("[data-go-home]")) {
        event.preventDefault();
        window.location.hash = "";
      }
    },
  };

  constructor(container: HTMLElement) {
    super({} as ServerErrorPageBlockProps);
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
