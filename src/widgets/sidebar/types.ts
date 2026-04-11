export interface SidebarCurrentUser {
  firstName: string;
  lastName: string;
  status: string;
}

export interface DirectMessageItem {
  chatId?: string;
  firstName: string;
  lastName: string;
  preview: string;
  statusType: "green" | "yellow" | "gray";
}

export interface GroupItem {
  chatId?: string;
  name: string;
  preview: string;
  iconClass: string;
}
