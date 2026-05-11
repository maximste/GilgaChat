import type { ProfilePageProps } from "@/pages/profile/ui/ProfilePage";
import { resourceFileUrl } from "@/shared/config/api";
import type { ApiUser } from "@/shared/lib/api/types";
import type { Indexed } from "@/shared/lib/types";

type UserState = {
  profile?: ApiUser | null;
};

const EMPTY_PROFILE: ProfilePageProps = {
  name: "",
  username: "",
  displayName: "",
  login: "",
  email: "",
  firstName: "",
  surname: "",
  phone: "",
};

function mapProfilePageState(state: Indexed): ProfilePageProps {
  const profile = (state.user as UserState | undefined)?.profile;

  if (!profile) {
    return EMPTY_PROFILE;
  }

  return {
    name: profile.display_name,
    username: `@${profile.login}`,
    displayName: profile.display_name,
    login: profile.login,
    email: profile.email,
    firstName: profile.first_name,
    surname: profile.second_name,
    phone: profile.phone,
    avatarUrl: profile.avatar ? resourceFileUrl(profile.avatar) : undefined,
  };
}

export { mapProfilePageState };
