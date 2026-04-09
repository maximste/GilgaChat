import { MOCK_MESSENGER_CHATS } from "@/shared/lib/mocks";
import type { Block } from "@/shared/ui/block";
import { ChatPage } from "@/widgets/chatPage";
import { NoChatStub } from "@/widgets/noChatStub";
import {
  SIDEBAR_SELECT_CHAT_EVENT,
  type SidebarSelectChatDetail,
} from "@/widgets/sidebar";

/**
 * Монтирует правую колонку: заглушка без выбора, по клику — чат или заглушка «нет сообщений».
 *
 * @param layoutRoot Корень `MessengerLayout` (`.messenger-layout`). Нужен явно: `componentDidMount`
 * срабатывает до вставки блока в `document`, поэтому `document.getElementById` в этот момент не находит `#messenger-content`.
 */
export function setupMessengerChatPage(layoutRoot: HTMLElement): void {
  const contentEl = layoutRoot.querySelector("#messenger-content");

  if (!(contentEl instanceof HTMLElement)) {
    return;
  }

  const maybeSidebar = layoutRoot.classList.contains("messenger-layout")
    ? layoutRoot
    : layoutRoot.querySelector<HTMLElement>(".messenger-layout");

  if (!maybeSidebar) {
    return;
  }

  const sidebar = maybeSidebar;
  const mainEl = contentEl;

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
    sidebar
      .querySelectorAll(".messenger-sidebar__item--active")
      .forEach((node) => {
        node.classList.remove("messenger-sidebar__item--active");
      });

    const item = sidebar.querySelector<HTMLButtonElement>(
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

  sidebar.addEventListener(SIDEBAR_SELECT_CHAT_EVENT, (event: Event) => {
    const { chatId } = (event as CustomEvent<SidebarSelectChatDetail>).detail;

    if (chatId) {
      selectChat(chatId);
    }
  });
}
