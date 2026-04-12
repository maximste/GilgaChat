import { signIn, signUp } from "@/app/controllers";
import { AuthForm } from "@/features/auth";
import { RegisterForm } from "@/features/registration";
import { setupMessengerChatPage } from "@/pages/messenger";
import { ApiError } from "@/shared/lib/api";
import { connect } from "@/shared/ui/block";
import { MainLayout } from "@/widgets/mainLayout";
import { MessengerLayout } from "@/widgets/messengerLayout";

import { mapMessengerLayoutState } from "../store";
import { getAppRouter } from "./routerHolder";

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
      onSignIn: async (payload) => {
        try {
          await signIn(payload, getAppRouter());
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : "Sign in failed";

          window.alert(msg);
        }
      },
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
      onSignUp: async (payload) => {
        try {
          await signUp(payload, getAppRouter());
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : "Registration failed";

          window.alert(msg);
        }
      },
    });
    const el = form.element();

    if (el) {
      slot.replaceChildren(el);
    }
  }
}
