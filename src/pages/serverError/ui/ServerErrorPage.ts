import template from "./ServerErrorPage.hbs?raw";
import Handlebars from "handlebars";

import "./ServerErrorPage.scss";

export class ServerErrorPage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    this.container.innerHTML = Handlebars.compile(template)({});

    this.container
      .querySelector("[data-go-home]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.hash = "";
      });

    this.container
      .querySelector("[data-try-again]")
      ?.addEventListener("click", () => {
        window.location.reload();
      });
  }
}
