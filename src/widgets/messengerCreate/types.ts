import type { ApiUser } from "@/shared/lib/api/types";

/** Зависимости со страницы/app — виджет не импортирует `@/app`. */
export type MessengerCreateDeps = {
  searchUsersByLogin: (login: string) => Promise<ApiUser[]>;
  createGroupWithMembers: (options: {
    title: string;
    userIds: number[];
    avatarFile?: File;
  }) => Promise<number>;
  getProfileFromStore: () => ApiUser | null;
};
