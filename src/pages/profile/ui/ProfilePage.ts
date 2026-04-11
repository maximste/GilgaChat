import {
  changePassword,
  logout,
  updateProfile,
  uploadAvatar,
} from "@/app/controllers";
import { getAppRouter } from "@/app/router/routerHolder";
import { EditProfileForm } from "@/features/editProfile";
import { APP_PATHS, appHref } from "@/shared/config/routes";
import { ApiError } from "@/shared/lib/api";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ProfilePage.hbs?raw";

import "./ProfilePage.scss";

export interface ProfilePageProps {
  name: string;
  username: string;
  displayName: string;
  login: string;
  email: string;
  firstName: string;
  surname: string;
  phone: string;
  /** Полный URL для отображения аватара. */
  avatarUrl?: string;
}

type ProfilePageBlockProps = ProfilePageProps & {
  backLink: { href: string; text: string; className: string };
  editProfileButton: {
    type: "button";
    text: string;
    className: string;
  };
  logoutButton: {
    type: "button";
    text: string;
    className: string;
  };
} & BlockOwnProps;

export class ProfilePage extends Block<ProfilePageBlockProps> {
  protected template = template;

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest(".profile-page__btn--danger")) {
        void logout(getAppRouter());

        return;
      }

      if (target.closest(".profile-page__btn--primary")) {
        this.handleEditProfile();
      }
    },
  };

  private readonly handleEditProfile = (): void => {
    const root = this.element();
    const contentEl = root?.querySelector(".profile-page__content");

    if (!contentEl || !(contentEl instanceof HTMLElement)) return;

    new EditProfileForm(
      contentEl,
      {
        login: this.props.login,
        displayName: this.props.displayName,
        email: this.props.email,
        firstName: this.props.firstName,
        surname: this.props.surname,
        phone: this.props.phone,
      },
      {
        onCancel: () => this.render(),
        onSave: async (data) => {
          try {
            if (data.avatarFile) {
              await uploadAvatar(data.avatarFile);
            }

            await updateProfile({
              first_name: data.firstName,
              second_name: data.surname,
              display_name: data.displayName,
              login: data.login,
              email: data.email,
              phone: data.phone,
            });

            if (data.oldPassword && data.newPassword) {
              await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
              });
            }

            this.render();
          } catch (e) {
            window.alert(
              e instanceof ApiError ? e.message : "Failed to save profile",
            );
          }
        },
      },
    ).render();
  };

  constructor(pageProps?: ProfilePageBlockProps) {
    super({
      name: "",
      username: "",
      displayName: "",
      login: "",
      email: "",
      firstName: "",
      surname: "",
      phone: "",
      ...pageProps,
      backLink: {
        href: appHref(APP_PATHS.messenger),
        text: "← Back to Messenger",
        className: "profile-page__back-link",
      },
      editProfileButton: {
        type: "button",
        text: "Edit Profile",
        className: "profile-page__btn profile-page__btn--primary",
      },
      logoutButton: {
        type: "button",
        text: "Logout",
        className: "profile-page__btn profile-page__btn--danger",
      },
    });
  }
}
