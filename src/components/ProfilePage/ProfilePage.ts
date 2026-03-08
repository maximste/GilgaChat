import Handlebars from 'handlebars';

import template from './ProfilePage.hbs?raw';
import { Button, ButtonTemplate, EditProfileForm, LinkTemplate } from '..';

import './ProfilePage.scss';

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

export class ProfilePage {
  private container: HTMLElement;
  private props: ProfilePageProps;
  private backLink: { href: string; text: string; className: string };
  private editProfileButton: Button;
  private logoutButton: Button;

  constructor(container: HTMLElement, props: ProfilePageProps) {
    this.container = container;
    this.props = props;

    this.backLink = {
      href: '#',
      text: '← Back to Messenger',
      className: 'profile-page__back-link',
    };

    this.editProfileButton = new Button({
      type: 'button',
      text: 'Edit Profile',
      className: 'profile-page__btn profile-page__btn--primary',
    });

    this.logoutButton = new Button({
      type: 'button',
      text: 'Logout',
      className: 'profile-page__btn profile-page__btn--danger',
    });
  }

  public render(): void {
    Handlebars.registerPartial('Link', LinkTemplate);
    Handlebars.registerPartial('Button', ButtonTemplate);

    const compiledTemplate = Handlebars.compile(template)({
      ...this.props,
      backLink: this.backLink,
      editProfileButton: this.editProfileButton.getData(),
      logoutButton: this.logoutButton.getData(),
    });

    this.container.innerHTML = compiledTemplate;

    const contentEl = this.container.querySelector('.profile-page__content');
    this.container.querySelector('.profile-page__btn--primary')?.addEventListener('click', () => {
      if (!contentEl || !(contentEl instanceof HTMLElement)) return;
      const editForm = new EditProfileForm(
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
        }
      );
      editForm.render();
    });
  }
}
