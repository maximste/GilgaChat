import type { ApiChatMember, ApiUser } from "@/shared/lib/api/types";

function userDisplayName(u: ApiUser | ApiChatMember): string {
  return (
    u.display_name?.trim() ||
    `${u.first_name} ${u.second_name}`.trim() ||
    u.login
  );
}

export { userDisplayName };
