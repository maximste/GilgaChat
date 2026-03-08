import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthForm } from './components/AuthForm/AuthForm';
import { MainLayout } from './layout/main/MainLayout';
import { MessengerLayout } from './layout/messenger/MessengerLayout';
import { NoChatStub } from './components/NoChatStub/NoChatStub';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { ProfilePage } from './components/ProfilePage/ProfilePage';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import { ServerErrorPage } from './components/ServerErrorPage/ServerErrorPage';
import './style.scss';

function showError(message: string): void {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<p style="padding:2rem;color:#fff;font-family:sans-serif;">App error: ${message}</p>`;
  }
  console.error('[GilgaChat]', message);
}

class App {
  private layoutContent: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    const run = (): void => {
      try {
        this.renderLayout();
        this.setupNavigation();
        this.renderCurrentView();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        showError(msg);
        throw err;
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  private renderLayout(): void {
    const container = document.getElementById('app');
    if (!container) {
      showError('App container #app not found');
      return;
    }

    const layout = new MainLayout({
      goBackLink: {
        href: '#',
        text: 'Go back',
        className: 'main-layout__go-back',
      },
      content: '',
    });

    container.innerHTML = layout.render();
    this.layoutContent = document.getElementById('layout-content');
    if (!this.layoutContent) {
      showError('Layout content #layout-content not found');
    }
  }

  private setupNavigation(): void {
    window.addEventListener('hashchange', () => this.renderCurrentView());
  }

  // TODO: временное решение до внедрения роутинга
  private renderCurrentView(): void {
    const container = document.getElementById('app');
    if (!container) return;

    const hash = window.location.hash;
    const isMessengerView = hash === '' || hash === '#messenger';

    if (isMessengerView) {
      const layout = new MessengerLayout();
      container.innerHTML = layout.render();
      const contentEl = document.getElementById('messenger-content');
      if (contentEl) new NoChatStub(contentEl).render();
      this.layoutContent = null;
      return;
    }

    if (!this.layoutContent) {
      this.renderLayout();
    }
    if (!this.layoutContent) return;

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
    } else if (hash === '#404') {
      const notFoundPage = new NotFoundPage(this.layoutContent);
      notFoundPage.render();
    } else if (hash === '#500') {
      const serverErrorPage = new ServerErrorPage(this.layoutContent);
      serverErrorPage.render();
    } else {
      // Unknown hash — show messenger as default
      const layout = new MessengerLayout();
      container.innerHTML = layout.render();
      const contentEl = document.getElementById('messenger-content');
      if (contentEl) new NoChatStub(contentEl).render();
      this.layoutContent = null;
      return;
    }
  }
}

try {
  new App();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  showError(msg);
}
