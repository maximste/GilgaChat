import type { Indexed } from "@/shared/lib/types";
import type { MessengerLayoutProps } from "@/widgets/messengerLayout";
import type { SidebarCurrentUser } from "@/widgets/sidebar";

const DEFAULT_SIDEBAR_USER: SidebarCurrentUser = {
  firstName: "Alex",
  lastName: "Morgan",
  status: "Playing games",
};

type UserSlice = {
  sidebar?: SidebarCurrentUser;
};

export function mapMessengerLayoutState(
  state: Indexed,
): Pick<MessengerLayoutProps, "currentUser"> {
  const user = state.user as UserSlice | undefined;

  return {
    currentUser: user?.sidebar ?? DEFAULT_SIDEBAR_USER,
  };
}
