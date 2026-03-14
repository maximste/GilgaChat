import { NotFoundPage } from "./ui/NotFoundPage";

export function renderNotFoundPage(container: HTMLElement): void {
  new NotFoundPage(container).render();
}
