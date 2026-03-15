import template from "./NoChatStub.hbs?raw";
import Handlebars from "handlebars";

import "./NoChatStub.scss";

export class NoChatStub {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    this.container.innerHTML = Handlebars.compile(template)({});
  }
}
