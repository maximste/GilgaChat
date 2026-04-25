import { resourceFileUrl } from "@/shared/config/api";
import type { ApiUser } from "@/shared/lib/api/types";
import type { SidebarCurrentUser } from "@/widgets/sidebar";

function apiUserToSidebar(user: ApiUser): SidebarCurrentUser {
  return {
    firstName: user.first_name,
    lastName: user.second_name,
    status: "Online",
    avatarUrl: user.avatar ? resourceFileUrl(user.avatar) : undefined,
  };
}

export { apiUserToSidebar };
