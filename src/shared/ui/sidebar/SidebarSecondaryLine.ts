import { Block, type BlockOwnProps } from "../block/Block";
import template from "./SidebarSecondaryLine.hbs?raw";

import "./SidebarSecondaryLine.scss";

interface SidebarSecondaryLineProps {
  text: string;
}

type SidebarSecondaryLineBlockProps = SidebarSecondaryLineProps & BlockOwnProps;

class SidebarSecondaryLine extends Block<SidebarSecondaryLineBlockProps> {
  static componentName = "SidebarSecondaryLine";

  protected template = template;

  constructor(props: SidebarSecondaryLineProps) {
    super(props as SidebarSecondaryLineBlockProps);
  }
}
export { SidebarSecondaryLine };
export { type SidebarSecondaryLineProps };
