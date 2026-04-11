import { createAppRouter, setupSpaLinks } from "./router";
import { bootstrapAppStore } from "./store";

function showError(message: string): void {
  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = `<p class="app-error">App error: ${message}</p>`;
  }

  console.error("[GilgaChat]", message);
}

export class App {
  constructor() {
    const run = (): void => {
      try {
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

        bootstrapAppStore();
        const router = createAppRouter();

        setupSpaLinks(router, basePath);
        router.start();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);

        showError(msg);
        throw err;
      }
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }
}
