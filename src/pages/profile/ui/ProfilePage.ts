import { EditProfileForm } from "@/features/editProfile";
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

  private container: HTMLElement;

  protected events = {
    click: (event: Event) => {
      const btn = (event.target as HTMLElement).closest(
        ".profile-page__btn--primary",
      );

      if (btn) {
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
        onSave: () => this.render(),
      },
    ).render();
  };

  constructor(container: HTMLElement, pageProps: ProfilePageProps) {
    super({
      ...pageProps,
      backLink: {
        href: "#",
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
    } as ProfilePageBlockProps);
    this.container = container;
  }

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }
  }
}
