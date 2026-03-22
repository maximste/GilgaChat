import { registerComponent } from "@/shared/ui/block";
import { MessageComposer } from "@/widgets/messageComposer";
import { NoChatStub } from "@/widgets/noChatStub";
import {
  Sidebar,
  SidebarChatListItem,
  SidebarChatSection,
  SidebarHeader,
  SidebarUserPanel,
} from "@/widgets/sidebar";

import "@/shared/ui/block/registerBlocks";
import "@fontsource/inter";
import { App } from "./App";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/shared/styles/global.scss";

registerComponent(MessageComposer);
registerComponent(NoChatStub);
registerComponent(Sidebar);
registerComponent(SidebarHeader);
registerComponent(SidebarChatSection);
registerComponent(SidebarChatListItem);
registerComponent(SidebarUserPanel);

try {
  new App();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = `<p class="app-error">App error: ${msg}</p>`;
  }
  console.error("[GilgaChat]", msg);
}
