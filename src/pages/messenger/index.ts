import { NoChatStub } from "@/widgets/noChatStub";

/** Заполняет правую колонку мессенджера после монтирования MessengerLayout в #app */
export function setupMessengerNoChatStub(): void {
  const contentEl = document.getElementById("messenger-content");

  if (contentEl) {
    new NoChatStub(contentEl).render();
  }
}
