import { Block, type BlockOwnProps } from "../block/Block";
import type { SidebarStatusType } from "./SidebarPrimaryLine";
import template from "./SidebarUserStatus.hbs?raw";

import "./SidebarUserStatus.scss";

export interface SidebarUserStatusProps {
  text: string;
  statusDot?: SidebarStatusType;
}

type SidebarUserStatusBlockProps = SidebarUserStatusProps & {
  statusDot: SidebarStatusType;
} & BlockOwnProps;

class SidebarUserStatus extends Block<SidebarUserStatusBlockProps> {
  static componentName = "SidebarUserStatus";

  protected template = template;

  constructor(props: SidebarUserStatusProps) {
    super({
      ...props,
      statusDot: props.statusDot ?? "green",
    } as SidebarUserStatusBlockProps);
  }
}

export { SidebarUserStatus };
