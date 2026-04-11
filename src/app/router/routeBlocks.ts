import { AuthForm } from "@/features/auth";
import { RegisterForm } from "@/features/registration";
import { setupMessengerChatPage } from "@/pages/messenger";
import { APP_PATHS, appHref } from "@/shared/config/routes";
import { connect } from "@/shared/ui/block";
import { MainLayout } from "@/widgets/mainLayout";
import { MessengerLayout } from "@/widgets/messengerLayout";

import { mapMessengerLayoutState } from "../store";

const ConnectedMessengerLayout = connect(mapMessengerLayoutState)(
  MessengerLayout,
);

// @ts-expect-error TS2515 — база из `connect` (конкретный Block с template); TS обрезает тип до абстрактного Block.
export class MessengerRouteBlock extends ConnectedMessengerLayout {
  protected componentDidMount(): void {
    super.componentDidMount();
    const root = this.element();

    if (root instanceof HTMLElement) {
      setupMessengerChatPage(root);
    }
  }
}

export class AuthScreenBlock extends MainLayout {
  constructor() {
    super({
      goBackLink: {
        href: appHref(APP_PATHS.messenger),
        text: "Go back",
        className: "main-layout__go-back",
      },
      content: "",
    });
  }

  protected componentDidMount(): void {
    super.componentDidMount();
    const slot = this.element()?.querySelector("#layout-content");

    if (!(slot instanceof HTMLElement)) {
      return;
    }

    const form = new AuthForm({
      title: "Welcome back",
      subtitle: "Sign in to continue to GilgaChat",
    });
    const el = form.element();

    if (el) {
      slot.replaceChildren(el);
    }
  }
}

export class RegisterScreenBlock extends MainLayout {
  constructor() {
    super({
      goBackLink: {
        href: appHref(APP_PATHS.login),
        text: "Go back",
        className: "main-layout__go-back",
      },
      content: "",
    });
  }

  protected componentDidMount(): void {
    super.componentDidMount();
    const slot = this.element()?.querySelector("#layout-content");

    if (!(slot instanceof HTMLElement)) {
      return;
    }

    const form = new RegisterForm({
      title: "Create Account",
      subtitle: "Sign up to get started",
    });
    const el = form.element();

    if (el) {
      slot.replaceChildren(el);
    }
  }
}
