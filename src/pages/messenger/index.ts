import { MOCK_MESSENGER_CHATS } from "@/shared/lib/mocks";
import type { Block } from "@/shared/ui/block";
import { ChatPage } from "@/widgets/chatPage";
import { NoChatStub } from "@/widgets/noChatStub";
import {
  SIDEBAR_SELECT_CHAT_EVENT,
  type SidebarSelectChatDetail,
} from "@/widgets/sidebar";

/** Монтирует правую колонку: заглушка без выбора, по клику — чат или заглушка «нет сообщений». */
export function setupMessengerChatPage(): void {
  const contentEl = document.getElementById("messenger-content");
  const layout = document.querySelector<HTMLElement>(".messenger-layout");

  if (!contentEl || !layout) {
    return;
  }

  const mainEl = contentEl;
  const sidebarEl = layout;

  let currentBlock: Block | null = null;

  function mount(block: Block): void {
    currentBlock?.destroy();
    currentBlock = block;
    const el = block.element();

    if (el) {
      mainEl.replaceChildren(el);
    }
  }

  function setActiveItem(chatId: string): void {
    sidebarEl
      .querySelectorAll(".messenger-sidebar__item--active")
      .forEach((node) => {
        node.classList.remove("messenger-sidebar__item--active");
      });

    const item = sidebarEl.querySelector<HTMLButtonElement>(
      `.messenger-sidebar__item[data-chat="${CSS.escape(chatId)}"]`,
    );

    item?.classList.add("messenger-sidebar__item--active");
  }

  function selectChat(chatId: string): void {
    setActiveItem(chatId);
    const meta = MOCK_MESSENGER_CHATS[chatId];

    if (!meta) {
      mount(
        new NoChatStub({
          title: "Чат не найден",
          description: "Выберите другой диалог в списке слева.",
          fillVertical: true,
        }),
      );

      return;
    }

    mount(
      new ChatPage(mainEl, {
        peerName: meta.peerName,
        timeline: meta.timeline,
      }),
    );
  }

  mount(
    new NoChatStub({
      title: "Выберите чат",
      description: "Выберите диалог или группу в списке слева.",
      fillVertical: true,
    }),
  );

  sidebarEl.addEventListener(SIDEBAR_SELECT_CHAT_EVENT, (event: Event) => {
    const { chatId } = (event as CustomEvent<SidebarSelectChatDetail>).detail;

    if (chatId) {
      selectChat(chatId);
    }
  });
}
