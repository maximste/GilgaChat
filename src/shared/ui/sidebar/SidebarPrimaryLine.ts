import { Block, type BlockOwnProps } from "../block/Block";
import template from "./SidebarPrimaryLine.hbs?raw";

import "./SidebarPrimaryLine.scss";

type SidebarStatusType = "green" | "yellow" | "gray";

interface SidebarPrimaryLineProps {
  text: string;
  wrapClassName:
    | `messenger-sidebar__item-name`
    | `messenger-sidebar__user-name`;
  statusType?: SidebarStatusType;
}

type SidebarPrimaryLineBlockProps = SidebarPrimaryLineProps & BlockOwnProps;

class SidebarPrimaryLine extends Block<SidebarPrimaryLineBlockProps> {
  static componentName = "SidebarPrimaryLine";

  protected template = template;

  constructor(props: SidebarPrimaryLineProps) {
    super(props as SidebarPrimaryLineBlockProps);
  }
}
export { SidebarPrimaryLine };
export { type SidebarPrimaryLineProps, type SidebarStatusType };
