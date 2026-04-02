export interface SidebarCurrentUser {
  firstName: string;
  lastName: string;
  status: string;
}

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
