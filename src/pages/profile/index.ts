import { mapProfilePageState } from "@/app/store/mapProfilePageState";
import { connect } from "@/shared/ui/block";

import type { ProfilePageProps } from "./ui/ProfilePage";
import { ProfilePage } from "./ui/ProfilePage";

export type { ProfilePageProps };
export { ProfilePage };

export const DEMO_PROFILE_PROPS: ProfilePageProps = {
  name: "John Smith",
  username: "@johnsmith",
  displayName: "John Smith",
  login: "johnsmith",
  email: "john.smith@example.com",
  firstName: "John",
  surname: "Smith",
  phone: "+1 (555) 123-4567",
};

const ConnectedProfilePage = connect(mapProfilePageState)(ProfilePage);

// @ts-expect-error TS2515 — конкретный Block с template; TS обрезает тип базы.
export class ProfileRoutePage extends ConnectedProfilePage {}
