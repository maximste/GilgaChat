import { AuthForm } from '@/features/auth';

export interface AuthPageProps {
  title?: string;
  subtitle?: string;
}

export function renderAuthPage(container: HTMLElement, props: AuthPageProps = {}): void {
  const form = new AuthForm(container, {
    title: props.title ?? 'Welcome back',
    subtitle: props.subtitle ?? 'Sign in to continue to GilgaChat',
  });
  form.render();
}
