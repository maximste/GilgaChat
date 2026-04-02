import { ServerErrorPage } from "./ui/ServerErrorPage";

export function renderServerErrorPage(container: HTMLElement): void {
  new ServerErrorPage(container).render();
}
