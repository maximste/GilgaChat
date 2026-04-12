import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./SidebarHeader.hbs?raw";

import "./SidebarHeader.scss";

export interface SidebarHeaderProps {
  appTitle: string;
}

type SidebarHeaderBlockProps = SidebarHeaderProps & BlockOwnProps;

class SidebarHeader extends Block<SidebarHeaderBlockProps> {
  static componentName = "SidebarHeader";

  protected template = template;

  constructor(props: SidebarHeaderProps) {
    super(props as SidebarHeaderBlockProps);
  }
}

export { SidebarHeader };
