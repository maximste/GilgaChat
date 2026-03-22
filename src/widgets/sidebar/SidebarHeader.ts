import type { LinkProps } from "@/shared/lib/types";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./SidebarHeader.hbs?raw";

import "./SidebarHeader.scss";

export interface SidebarHeaderProps {
  topLinks: LinkProps[];
  appTitle: string;
  appTitleRightSection: string;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
}

type SidebarHeaderBlockProps = SidebarHeaderProps & BlockOwnProps;

class SidebarHeader extends Block<SidebarHeaderBlockProps> {
  static componentName = "SidebarHeader";

  protected template = template;

  constructor(props: SidebarHeaderProps) {
    const searchPlaceholder = props.searchPlaceholder ?? "Search";

    super({
      ...props,
      searchPlaceholder,
      searchAriaLabel: props.searchAriaLabel ?? searchPlaceholder,
    } as SidebarHeaderBlockProps);
  }
}

export { SidebarHeader };
