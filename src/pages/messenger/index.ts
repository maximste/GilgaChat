import {
  chatsController,
  getProfileFromStore,
  searchUsersByLogin,
} from "@/app/controllers";
import { createDemoChatTimeline } from "@/shared/lib/mocks";
import type { Block } from "@/shared/ui/block";
import { ChatPage } from "@/widgets/chatPage";
import { setupMessengerCreateUi } from "@/widgets/messengerCreate";
import { NoChatStub } from "@/widgets/noChatStub";
import {
  SIDEBAR_SELECT_CHAT_EVENT,
  type SidebarSelectChatDetail,
} from "@/widgets/sidebar";

export { setupMessengerCreateUi } from "@/widgets/messengerCreate";

/**
 * Монтирует правую колонку: заглушка без выбора, по клику — чат или заглушка «нет сообщений».
 *
 * @param layoutRoot Корень `MessengerLayout` (`.messenger-layout`). Нужен явно: `componentDidMount`
 * срабатывает до вставки блока в `document`, поэтому `document.getElementById` в этот момент не находит `#messenger-content`.
 */
export function setupMessengerChatPage(layoutRoot: HTMLElement): {
  selectChat: (chatId: string) => void;
} {
  const noop = (): void => {};
  const contentEl = layoutRoot.querySelector("#messenger-content");

  if (!(contentEl instanceof HTMLElement)) {
    return { selectChat: noop };
  }

  const maybeSidebar = layoutRoot.classList.contains("messenger-layout")
    ? layoutRoot
    : layoutRoot.querySelector<HTMLElement>(".messenger-layout");

  if (!maybeSidebar) {
    return { selectChat: noop };
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
    const idNum = Number(chatId);

    if (Number.isNaN(idNum)) {
      mount(
        new NoChatStub({
          title: "Чат не найден",
          description: "Выберите другой диалог в списке слева.",
          fillVertical: true,
        }),
      );

      return;
    }

    const chat = chatsController.findChatById(idNum);

    if (!chat) {
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
        peerName: chat.title,
        timeline: createDemoChatTimeline(chat.title),
        showStatusDot: chatsController.chatHeaderShowsStatusDot(idNum),
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

  setupMessengerCreateUi(layoutRoot, {
    selectChat,
    searchUsersByLogin,
    openDmWithUser: (user) => chatsController.openDmWithUser(user),
    createGroupWithMembers: (opts) =>
      chatsController.createGroupWithMembers(opts),
    getProfileFromStore,
  });

  return { selectChat };
}
