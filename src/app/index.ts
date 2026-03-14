import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fontsource/inter';
import '@/shared/styles/global.scss';
import { App } from './App';

try {
  new App();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<p class="app-error">App error: ${msg}</p>`;
  }
  console.error('[GilgaChat]', msg);
}
