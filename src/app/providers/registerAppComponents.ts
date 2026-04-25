import { mapMessengerLayoutState } from "@/app/store";
import { connect, registerComponent } from "@/shared/ui/block";
import { ChatFooter } from "@/widgets/chatPage/ChatFooter";
import { ChatHeader } from "@/widgets/chatPage/ChatHeader";
import { ChatThread } from "@/widgets/chatPage/ChatThread";
import { ChatTimelineRow } from "@/widgets/chatPage/ChatTimelineRow";
import { MessageComposer } from "@/widgets/messageComposer";
import { NoChatStub } from "@/widgets/noChatStub";
import {
  Sidebar,
  SidebarChatListItem,
  SidebarChatSection,
  SidebarHeader,
  SidebarUserPanel,
} from "@/widgets/sidebar";

const ConnectedSidebar = connect(mapMessengerLayoutState)(Sidebar);

/** Регистрация Handlebars-хелперов для вложенных Block на уровне приложения. */
function registerAppComponents(): void {
  registerComponent(ChatHeader);
  registerComponent(ChatThread);
  registerComponent(ChatFooter);
  registerComponent(ChatTimelineRow);
  registerComponent(MessageComposer);
  registerComponent(NoChatStub);
  registerComponent(ConnectedSidebar);
  registerComponent(SidebarHeader);
  registerComponent(SidebarChatSection);
  registerComponent(SidebarChatListItem);
  registerComponent(SidebarUserPanel);
}

export { registerAppComponents };
