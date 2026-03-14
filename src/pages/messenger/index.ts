import { MessengerLayout } from "@/widgets/messengerLayout";
import { NoChatStub } from "@/widgets/noChatStub";

export function renderMessengerPage(container: HTMLElement): void {
  const layout = new MessengerLayout();
  container.innerHTML = layout.render();
  const contentEl = document.getElementById("messenger-content");
  if (contentEl) {
    new NoChatStub(contentEl).render();
  }
}
