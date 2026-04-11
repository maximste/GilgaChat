import type { ApiUser } from "@/shared/lib/api/types";
import type { SidebarCurrentUser } from "@/widgets/sidebar";

export function apiUserToSidebar(user: ApiUser): SidebarCurrentUser {
  return {
    firstName: user.first_name,
    lastName: user.second_name,
    status: "Online",
  };
}
