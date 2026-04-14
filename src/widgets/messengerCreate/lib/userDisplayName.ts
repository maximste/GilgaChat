import type { ApiUser } from "@/shared/lib/api/types";

export function userDisplayName(u: ApiUser): string {
  return (
    u.display_name?.trim() ||
    `${u.first_name} ${u.second_name}`.trim() ||
    u.login
  );
}
