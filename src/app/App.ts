import { MainLayout } from "@/widgets/mainLayout";
import { renderAuthPage } from "@/pages/auth";
import { renderRegisterPage } from "@/pages/register";
import { renderProfilePage } from "@/pages/profile";
import { renderMessengerPage } from "@/pages/messenger";
import { renderNotFoundPage } from "@/pages/notFound";
import { renderServerErrorPage } from "@/pages/serverError";

function showError(message: string): void {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `<p class="app-error">App error: ${message}</p>`;
  }
  console.error("[GilgaChat]", message);
}

const DEFAULT_PROFILE_PROPS = {
  name: "John Smith",
  username: "@johnsmith",
  displayName: "John Smith",
  login: "johnsmith",
  email: "john.smith@example.com",
  firstName: "John",
  surname: "Smith",
  phone: "+1 (555) 123-4567",
};

export class App {
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
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  private renderLayout(): void {
    const container = document.getElementById("app");
    if (!container) {
      showError("App container #app not found");
      return;
    }

    const layout = new MainLayout({
      goBackLink: {
        href: "#",
        text: "Go back",
        className: "main-layout__go-back",
      },
      content: "",
    });

    container.innerHTML = layout.render();
    this.layoutContent = document.getElementById("layout-content");
    if (!this.layoutContent) {
      showError("Layout content #layout-content not found");
    }
  }

  private setupNavigation(): void {
    window.addEventListener("hashchange", () => this.renderCurrentView());
  }

  private renderCurrentView(): void {
    const container = document.getElementById("app");
    if (!container) return;

    const hash = window.location.hash;
    const isMessengerView = hash === "" || hash === "#messenger";

    if (isMessengerView) {
      renderMessengerPage(container);
      this.layoutContent = null;
      return;
    }

    if (!this.layoutContent) {
      this.renderLayout();
    }
    if (!this.layoutContent) return;

    if (hash === "#auth") {
      renderAuthPage(this.layoutContent);
    } else if (hash === "#register") {
      renderRegisterPage(this.layoutContent);
    } else if (hash === "#profile") {
      renderProfilePage(this.layoutContent, DEFAULT_PROFILE_PROPS);
    } else if (hash === "#404") {
      renderNotFoundPage(this.layoutContent);
    } else if (hash === "#500") {
      renderServerErrorPage(this.layoutContent);
    } else {
      renderMessengerPage(container);
      this.layoutContent = null;
    }
  }
}
