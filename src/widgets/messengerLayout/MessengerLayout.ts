import Handlebars from "handlebars";

import template from "./MessengerLayout.hbs?raw";
import { LinkTemplate } from "@/shared/ui";
import type { LinkProps } from "@/shared/lib/types";

import "./MessengerLayout.scss";

export interface DirectMessageItem {
  firstName: string;
  lastName: string;
  preview: string;
  statusType: "green" | "yellow" | "gray";
}

export interface GroupItem {
  name: string;
  preview: string;
  iconClass: string;
}

export interface MessengerLayoutProps {
  appTitle: string;
  topLinks: LinkProps[];
  currentUser: {
    firstName: string;
    lastName: string;
    status: string;
  };
  directMessages: DirectMessageItem[];
  groups: GroupItem[];
  content?: string;
}

const defaultTopLinks: LinkProps[] = [
  { href: "#auth", text: "Sign in", className: "messenger-sidebar__top-link" },
  {
    href: "#register",
    text: "Sign up",
    className: "messenger-sidebar__top-link",
  },
  { href: "#404", text: "404", className: "messenger-sidebar__top-link" },
  { href: "#500", text: "500", className: "messenger-sidebar__top-link" },
];

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

class MessengerLayout {
  private props: MessengerLayoutProps;

  constructor(props: Partial<MessengerLayoutProps> = {}) {
    this.props = {
      appTitle: props.appTitle ?? "Messenger",
      topLinks: props.topLinks ?? defaultTopLinks,
      currentUser: props.currentUser ?? {
        firstName: "Alex",
        lastName: "Morgan",
        status: "Playing games",
      },
      directMessages: props.directMessages ?? defaultDirectMessages,
      groups: props.groups ?? defaultGroups,
      content: props.content ?? "",
    };
  }

  public render(): string {
    Handlebars.registerPartial("Link", LinkTemplate);
    return Handlebars.compile(template)(this.props);
  }
}

export { MessengerLayout };
