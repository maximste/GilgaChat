import template from "./NotFoundPage.hbs?raw";
import Handlebars from "handlebars";

import "./NotFoundPage.scss";

export class NotFoundPage {
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
      .querySelector("[data-go-back]")
      ?.addEventListener("click", () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = "";
        }
      });
  }
}
