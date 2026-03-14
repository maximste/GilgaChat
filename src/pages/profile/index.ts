import { ProfilePage } from "./ui/ProfilePage";
import type { ProfilePageProps } from "./ui/ProfilePage";

export type { ProfilePageProps };

export function renderProfilePage(
  container: HTMLElement,
  props: ProfilePageProps,
): void {
  new ProfilePage(container, props).render();
}
