import { AuthForm } from './pages/Auth/AuthForm'
import './style.scss'

class App {
  private authForm: AuthForm | null = null;
  constructor() {
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      // TODO временная заглушка, пока не реализован лейаут
      this.renderAuthForm();
    })
  }

  private renderAuthForm(): void {
    const container = document.getElementById('app');

    if(!container) {
      console.error('App container not found');
      return
    }

    this.authForm = new AuthForm(container, {
      title: 'Welcome back',
      subtitle: 'Sign in to continue to GilgaChat',
    })

    this.authForm.render();
  }
}

new App()
