import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type {
  DirectMessageItem,
  GroupItem,
  SidebarProps,
} from "@/widgets/sidebar";

import template from "./MessengerLayout.hbs?raw";

import "./MessengerLayout.scss";

export type { DirectMessageItem, GroupItem };

export interface MessengerLayoutProps extends SidebarProps {
  content?: string;
}

type MessengerLayoutBlockProps = MessengerLayoutProps & BlockOwnProps;

const defaultDirectMessages: DirectMessageItem[] = [
  {
    firstName: "Sarah",
    lastName: "Chen",
    preview: "typing...",
    statusType: "green",
  },
  {
    firstName: "Marcus",
    lastName: "Johnson",
    preview: "Sure, I'll check it out later today",
    statusType: "yellow",
  },
];

const defaultGroups: GroupItem[] = [
  {
    name: "Project Alpha Team",
    preview: "Tomorrow's meeting is at 2 PM",
    iconClass: "fa-user-group",
  },
  {
    name: "Weekend Plans",
    preview: "I'm in! What time? 1h",
    iconClass: "fa-bolt",
  },
];

class MessengerLayout extends Block<MessengerLayoutBlockProps> {
  protected template = template;

  constructor(props: Partial<MessengerLayoutProps> = {}) {
    super({
      appTitle: props.appTitle ?? "GilgaChat",
      currentUser: props.currentUser ?? {
        firstName: "Alex",
        lastName: "Morgan",
        status: "Playing games",
      },
      directMessages: props.directMessages ?? defaultDirectMessages,
      groups: props.groups ?? defaultGroups,
      content: props.content ?? "",
    } as MessengerLayoutBlockProps);
  }
}

export { MessengerLayout };
