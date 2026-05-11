import { chatsController } from "@/app/controllers";
import { resourceFileUrl } from "@/shared/config/api";
import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { ChatMessagesSession } from "@/shared/lib/chat";
import { createDemoChatTimeline } from "@/shared/lib/mocks";
import type { ChatTimelineItem } from "@/shared/lib/types/ChatTimelineTypes";
import { mapChatTimelineToRows, timelineHasMessages } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import { showConfirmDialog } from "@/shared/ui/confirmDialog";
import { showErrorToast } from "@/shared/ui/toast";

import {
  CHAT_MESSAGE_SENT_EVENT,
  type ChatMessageSentDetail,
} from "./chatMessageEvents";
import template from "./ChatPage.hbs?raw";
import { openChatGroupMembersDrawer } from "./openChatGroupMembersDrawer";

import "./ChatPage.scss";

interface ChatPageProps {
  peerName?: string;
  avatarUrl?: string;
  chatId?: number;
  isGroup?: boolean;
  /** Лента сообщений; без передачи подставляется демо-лента */
  timeline?: ChatTimelineItem[];
  showStatusDot?: boolean;
}

/** Зависимости от экрана мессенджера (модалки, очистка выбора, поиск пользователей). */
type ChatPageHostDeps = {
  /** Корень layout: отсюда ищется `[data-messenger-modals]` (оверлеи и выезжающие панели). */
  layoutRoot: HTMLElement;
  clearChatSelection: () => void;
  searchUsersByLogin: (login: string) => Promise<unknown>;
  getProfileFromStore: () => ApiUser | null;
};

type ChatPageBlockProps = ChatPageProps & {
  peerName: string;
  avatarUrl?: string;
  showStatusDot: boolean;
  showGroupMemberActions: boolean;
  canChangeAvatar: boolean;
  timeline: ChatTimelineItem[];
  hasMessages: boolean;
  timelineRows: ReturnType<typeof mapChatTimelineToRows>;
} & BlockOwnProps;

type ThreadScrollSnapshot = {
  distanceFromBottom: number;
  wasNearBottom: boolean;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

class ChatPage extends Block<ChatPageBlockProps> {
  protected template = template;

  private container: HTMLElement;

  private readonly hostDeps: ChatPageHostDeps | null;

  private readonly routeChatId: number | null;

  private readonly routeIsGroup: boolean;

  private messageSession: ChatMessagesSession | null = null;

  private readonly groupMemberDirectory = new Map<
    string,
    {
      displayName: string;
      avatarUrl?: string;
    }
  >();

  private isGroupMemberDirectoryLoading = false;

  private isGroupMemberDirectoryLoaded = false;

  private isUploadingAvatar = false;

  private readonly onChatMessageSent = (event: Event): void => {
    const { text } = (event as CustomEvent<ChatMessageSentDetail>).detail;

    if (!text?.trim()) {
      return;
    }
    if (this.routeChatId !== null && this.messageSession) {
      this.messageSession.sendText(text.trim());

      return;
    }
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const newItem: ChatTimelineItem = {
      incoming: false,
      time,
      text: text.trim(),
    };
    const timeline = [...this.props.timeline, newItem];

    this.updateTimelineWithScroll(timeline);
  };

  constructor(
    container: HTMLElement,
    props: ChatPageProps = {},
    hostDeps: ChatPageHostDeps | null = null,
  ) {
    const peerName = props.peerName ?? "Sarah Chen";
    const hasNumericChatId =
      typeof props.chatId === "number" && !Number.isNaN(props.chatId);
    const timeline =
      props.timeline ??
      (hasNumericChatId ? [] : createDemoChatTimeline(peerName));
    const hasMessages = timelineHasMessages(timeline);
    const timelineRows = mapChatTimelineToRows(timeline);
    const routeChatId =
      typeof props.chatId === "number" && !Number.isNaN(props.chatId)
        ? props.chatId
        : null;
    const routeIsGroup = Boolean(props.isGroup);

    super({
      peerName,
      avatarUrl: props.avatarUrl,
      chatId: props.chatId,
      isGroup: routeIsGroup,
      showStatusDot: props.showStatusDot ?? true,
      showGroupMemberActions: routeIsGroup,
      canChangeAvatar: routeIsGroup && routeChatId !== null,
      timeline,
      hasMessages,
      timelineRows,
    } as ChatPageBlockProps);
    this.container = container;
    this.hostDeps = hostDeps;
    this.routeChatId = routeChatId;
    this.routeIsGroup = routeIsGroup;
  }

  protected componentDidMount(): void {
    this.element()?.addEventListener(
      CHAT_MESSAGE_SENT_EVENT,
      this.onChatMessageSent as EventListener,
    );
    void this.loadGroupMemberDirectory();
    this.ensureRemoteMessageSession();
  }

  protected componentWillUnmount(): void {
    this.element()?.removeEventListener(
      CHAT_MESSAGE_SENT_EVENT,
      this.onChatMessageSent as EventListener,
    );
  }

  public destroy(): void {
    this.messageSession?.destroy();
    this.messageSession = null;
    super.destroy();
  }

  private ensureRemoteMessageSession(): void {
    const deps = this.hostDeps;
    const chatId = this.routeChatId;

    if (!deps || chatId === null) {
      return;
    }
    if (this.messageSession?.chatId === chatId) {
      return;
    }
    this.messageSession?.destroy();
    this.messageSession = null;
    const session = new ChatMessagesSession({
      chatId,
      peerDisplayName: this.props.peerName,
      isGroup: this.routeIsGroup,
      resolveGroupAuthor: (userId) =>
        this.groupMemberDirectory.get(userId) ?? null,
      getCurrentUser: () => deps.getProfileFromStore(),
      onTimelineChange: (items) => {
        this.updateTimelineWithScroll(items);
      },
      onError: (message) => {
        showErrorToast(message);
      },
    });

    this.messageSession = session;
    void session.start();
  }

  private async loadGroupMemberDirectory(force = false): Promise<void> {
    if (!this.routeIsGroup || this.routeChatId === null) {
      return;
    }
    if (!force) {
      if (
        this.isGroupMemberDirectoryLoading ||
        this.isGroupMemberDirectoryLoaded
      ) {
        return;
      }
    } else if (this.isGroupMemberDirectoryLoading) {
      return;
    }

    this.isGroupMemberDirectoryLoading = true;
    try {
      const members = await chatsController.getChatUsers(this.routeChatId, {
        limit: 500,
      });

      this.groupMemberDirectory.clear();
      for (const member of members) {
        const displayName =
          member.display_name?.trim() || member.login || `User ${member.id}`;
        const avatarPathRaw = member.avatar?.trim();
        const avatarPath =
          avatarPathRaw &&
          avatarPathRaw !== "null" &&
          avatarPathRaw !== "undefined"
            ? avatarPathRaw
            : undefined;

        this.groupMemberDirectory.set(String(member.id), {
          displayName,
          avatarUrl: avatarPath ? resourceFileUrl(avatarPath) : undefined,
        });
      }
      this.isGroupMemberDirectoryLoaded = true;
      this.messageSession?.refreshTimeline();
    } catch {
      // Quietly keep fallback labels if participant list is unavailable.
    } finally {
      this.isGroupMemberDirectoryLoading = false;
    }
  }

  private captureThreadScrollSnapshot(): ThreadScrollSnapshot | null {
    const thread =
      this.element()?.querySelector<HTMLElement>(".chat-page__thread");

    if (!thread) {
      return null;
    }
    const distanceFromBottom =
      thread.scrollHeight - thread.clientHeight - thread.scrollTop;

    return {
      distanceFromBottom: Math.max(0, distanceFromBottom),
      wasNearBottom: distanceFromBottom <= 24,
    };
  }

  private restoreThreadScroll(snapshot: ThreadScrollSnapshot | null): void {
    if (!snapshot) {
      return;
    }
    const thread =
      this.element()?.querySelector<HTMLElement>(".chat-page__thread");

    if (!thread) {
      return;
    }
    if (snapshot.wasNearBottom) {
      thread.scrollTop = thread.scrollHeight;

      return;
    }
    thread.scrollTop = Math.max(
      0,
      thread.scrollHeight - thread.clientHeight - snapshot.distanceFromBottom,
    );
  }

  private updateTimelineWithScroll(timeline: ChatTimelineItem[]): void {
    const scrollSnapshot = this.captureThreadScrollSnapshot();

    this.setProps({
      timeline,
      hasMessages: timelineHasMessages(timeline),
      timelineRows: mapChatTimelineToRows(timeline),
    });
    this.restoreThreadScroll(scrollSnapshot);
  }

  private triggerAvatarFileSelect(): void {
    const input = this.element()?.querySelector<HTMLInputElement>(
      "[data-chat-avatar-input]",
    );

    if (!input || this.isUploadingAvatar) {
      return;
    }
    input.click();
  }

  private async handleAvatarInputChange(
    input: HTMLInputElement,
  ): Promise<void> {
    const chatId = this.routeChatId;
    const deps = this.hostDeps;
    const file = input.files?.[0] ?? null;

    input.value = "";
    if (chatId === null || !deps || !file || this.isUploadingAvatar) {
      return;
    }
    this.isUploadingAvatar = true;
    try {
      await chatsController.updateChatAvatar(chatId, file);
      const refreshed = chatsController.findChatById(chatId);
      const avatarPathRaw = refreshed?.avatar?.trim();
      const avatarPath =
        avatarPathRaw &&
        avatarPathRaw !== "null" &&
        avatarPathRaw !== "undefined"
          ? avatarPathRaw
          : undefined;

      this.setProps({
        avatarUrl: avatarPath ? resourceFileUrl(avatarPath) : undefined,
      });
    } catch (error: unknown) {
      const errorMessage = toErrorMessage(error);

      showErrorToast(errorMessage);
    } finally {
      this.isUploadingAvatar = false;
    }
  }

  protected events = {
    click: (event: Event) => {
      const target = (event.target as HTMLElement).closest(
        "[data-chat-action]",
      );
      const action = target?.getAttribute("data-chat-action");
      const chatId = this.routeChatId;
      const deps = this.hostDeps;

      if (!action || chatId === null || !deps) {
        return;
      }
      if (action === "change-avatar") {
        this.triggerAvatarFileSelect();

        return;
      }
      if (action === "group-members") {
        if (!this.routeIsGroup) {
          return;
        }
        const modalsHost =
          deps.layoutRoot.querySelector<HTMLElement>(
            "[data-messenger-modals]",
          ) ?? deps.layoutRoot;

        openChatGroupMembersDrawer(modalsHost, {
          chatId,
          searchUsersByLogin: deps.searchUsersByLogin,
          getProfileFromStore: deps.getProfileFromStore,
          getChatUsers: (id) =>
            chatsController.getChatUsers(id, { limit: 500 }),
          addUsersToChat: async (id, userIds) => {
            await chatsController.addUsersToChat({
              chatId: id,
              users: userIds,
            });
            await this.loadGroupMemberDirectory(true);
          },
          removeUsersFromChat: async (id, userIds) => {
            await chatsController.removeUsersFromChat({
              chatId: id,
              users: userIds,
            });
            await this.loadGroupMemberDirectory(true);
          },
        });

        return;
      }
      if (action === "delete-chat") {
        void (async () => {
          const ok = await showConfirmDialog({
            title: "Удалить чат?",
            message: "Это действие необратимо.",
            confirmLabel: "Удалить",
            cancelLabel: "Отмена",
            isDanger: true,
          });

          if (!ok) {
            return;
          }
          try {
            await chatsController.deleteChat({ chatId });
            deps.clearChatSelection();
          } catch (error: unknown) {
            const errorMessage = toErrorMessage(error);

            showErrorToast(errorMessage);
          }
        })();
      }
    },
    change: (event: Event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.matches("[data-chat-avatar-input]")
      ) {
        void this.handleAvatarInputChange(target);
      }
    },
  };

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }
  }
}
export { ChatPage, type ChatPageHostDeps, type ChatPageProps };
