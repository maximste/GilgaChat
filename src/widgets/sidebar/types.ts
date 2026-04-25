interface SidebarCurrentUser {
  firstName: string;
  lastName: string;
  status: string;
  /** Полный URL для `<img>` (из `resourceFileUrl(profile.avatar)`). */
  avatarUrl?: string;
}

interface GroupItem {
  chatId?: string;
  name: string;
  preview: string;
  iconClass: string;
  avatarUrl?: string;
}

export { type GroupItem, type SidebarCurrentUser };
