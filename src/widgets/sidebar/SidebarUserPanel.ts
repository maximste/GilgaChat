import { APP_PATHS, appHref } from "@/shared/config/routes";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./SidebarUserPanel.hbs?raw";
import type { SidebarCurrentUser } from "./types";

import "./SidebarUserPanel.scss";

export interface SidebarUserPanelProps {
  currentUser: SidebarCurrentUser;
  settingsHref?: string;
  settingsAriaLabel?: string;
}

type SidebarUserPanelBlockProps = SidebarUserPanelProps & {
  displayName: string;
  statusLine: string;
  settingsHref: string;
  settingsAriaLabel: string;
} & BlockOwnProps;

class SidebarUserPanel extends Block<SidebarUserPanelBlockProps> {
  static componentName = "SidebarUserPanel";

  protected template = template;

  constructor(props: SidebarUserPanelProps) {
    const { firstName, lastName, status } = props.currentUser;

    super({
      ...props,
      displayName: `${firstName} ${lastName}`.trim(),
      statusLine: status,
      settingsHref: props.settingsHref ?? appHref(APP_PATHS.settings),
      settingsAriaLabel: props.settingsAriaLabel ?? "Settings",
    } as SidebarUserPanelBlockProps);
  }
}

export { SidebarUserPanel };
