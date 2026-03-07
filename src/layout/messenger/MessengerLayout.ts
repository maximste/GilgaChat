import Handlebars from 'handlebars';

import template from './MessengerLayout.hbs?raw';

import './MessengerLayout.scss';

export interface DirectMessageItem {
  firstName: string;
  lastName: string;
  preview: string;
  statusType: 'green' | 'yellow' | 'gray';
}

export interface GroupItem {
  name: string;
  preview: string;
  iconClass: string;
}

export interface MessengerLayoutProps {
  appTitle: string;
  currentUser: {
    firstName: string;
    lastName: string;
    status: string;
  };
  directMessages: DirectMessageItem[];
  groups: GroupItem[];
  content?: string;
}

const defaultDirectMessages: DirectMessageItem[] = [
  { firstName: 'Sarah', lastName: 'Chen', preview: 'typing...', statusType: 'green' },
  { firstName: 'Marcus', lastName: 'Johnson', preview: "Sure, I'll check it out later today", statusType: 'yellow' },
];

const defaultGroups: GroupItem[] = [
  { name: 'Project Alpha Team', preview: "Tomorrow's meeting is at 2 PM", iconClass: 'fa-user-group' },
  { name: 'Weekend Plans', preview: "I'm in! What time? 1h", iconClass: 'fa-bolt' },
];

class MessengerLayout {
  private props: MessengerLayoutProps;

  constructor(props: Partial<MessengerLayoutProps> = {}) {
    this.props = {
      appTitle: props.appTitle ?? 'Messenger',
      currentUser: props.currentUser ?? {
        firstName: 'Alex',
        lastName: 'Morgan',
        status: 'Playing games',
      },
      directMessages: props.directMessages ?? defaultDirectMessages,
      groups: props.groups ?? defaultGroups,
      content: props.content ?? '',
    };
  }

  public render(): string {
    return Handlebars.compile(template)(this.props);
  }
}

export { MessengerLayout };
