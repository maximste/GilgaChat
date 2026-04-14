import { Block, type BlockOwnProps } from "../block/Block";
import template from "./SidebarAvatar.hbs?raw";

import "./SidebarAvatar.scss";

export type SidebarAvatarSize = "list" | "panel";
export type SidebarAvatarVariant = "user" | "icon";

export interface SidebarAvatarProps {
  variant: SidebarAvatarVariant;
  size: SidebarAvatarSize;
  /** Для variant=user: URL фото; иначе плейсхолдер. */
  avatarUrl?: string;
  /** Для variant=icon: класс иконки FA без префикса fa-solid */
  iconClass?: string;
}

type SidebarAvatarBlockProps = SidebarAvatarProps & {
  isUserVariant: boolean;
  hasUserAvatar: boolean;
  rootClassName: string;
} & BlockOwnProps;

function resolveAvatarClass(
  variant: SidebarAvatarVariant,
  size: SidebarAvatarSize,
): string {
  if (size === "panel") {
    return "messenger-sidebar__user-avatar";
  }

  if (variant === "user") {
    return "messenger-sidebar__item-avatar messenger-sidebar__item-avatar--user";
  }

  return "messenger-sidebar__item-avatar";
}

class SidebarAvatar extends Block<SidebarAvatarBlockProps> {
  static componentName = "SidebarAvatar";

  protected template = template;

  constructor(props: SidebarAvatarProps) {
    super({
      ...props,
      iconClass: props.iconClass ?? "",
      isUserVariant: props.variant === "user",
      hasUserAvatar: Boolean(props.avatarUrl?.trim()),
      rootClassName: resolveAvatarClass(props.variant, props.size),
    } as SidebarAvatarBlockProps);
  }
}

export { SidebarAvatar };
