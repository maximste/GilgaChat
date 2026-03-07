import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthForm } from './components/AuthForm/AuthForm';
import { ProfilePage } from './components/ProfilePage/ProfilePage';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import { MainLayout } from './layout/main/MainLayout';
import './style.scss';

class App {
  private layoutContent: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.renderLayout();
      this.setupNavigation();
      this.renderCurrentView();
    });
  }

  private renderLayout(): void {
    const container = document.getElementById('app');
    if (!container) {
      console.error('App container not found');
      return;
    }

    const layout = new MainLayout({
      signInLink: {
        href: '#auth',
        text: 'Sign in',
        className: 'main-layout__sign-in',
      },
      signUpLink: {
        href: '#register',
        text: 'Sign up',
        className: 'main-layout__sign-up',
      },
      profileLink: {
        href: '#profile',
        text: 'Profile',
        className: 'main-layout__profile',
      },
      content: '',
    });

    container.innerHTML = layout.render();
    this.layoutContent = document.getElementById('layout-content');
  }

  private setupNavigation(): void {
    window.addEventListener('hashchange', () => this.renderCurrentView());
  }

  // TODO: временное решение до внедрения роутинга
  private renderCurrentView(): void {
    if (!this.layoutContent) return;

    const hash = window.location.hash;

    if (hash === '#auth') {
      const authForm = new AuthForm(this.layoutContent, {
        title: 'Welcome back',
        subtitle: 'Sign in to continue to GilgaChat',
      });
      authForm.render();
    } else if (hash === '#register') {
      const registerForm = new RegisterForm(this.layoutContent, {
        title: 'Create Account',
        subtitle: 'Sign up to get started',
      });
      registerForm.render();
    } else if (hash === '#profile') {
      const profilePage = new ProfilePage(this.layoutContent, {
        name: 'John Smith',
        username: '@johnsmith',
        login: 'johnsmith',
        email: 'john.smith@example.com',
        firstName: 'John',
        surname: 'Smith',
        phone: '+1 (555) 123-4567',
      });
      profilePage.render();
    } else {
      this.layoutContent.innerHTML = '<p class="main-layout__welcome">Welcome to GilgaChat. <a href="#auth" class="link">Sign in</a>, <a href="#register" class="link">Sign up</a>, or <a href="#profile" class="link">Profile</a>.</p>';
    }
  }
}

new App();
