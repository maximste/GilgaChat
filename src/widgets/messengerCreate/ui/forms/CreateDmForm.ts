import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { escapeHtml } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import { showErrorToast } from "@/shared/ui/toast";

import { normalizeUserSearchResponse } from "../../lib/normalizeUserSearchResponse";
import { userDisplayName } from "../../lib/userDisplayName";
import type { MessengerModalShell } from "../MessengerModalShell";
import template from "./CreateDmForm.hbs?raw";

const DEBOUNCE_MS = 320;

type CreateDmFormProps = BlockOwnProps;

export type CreateDmFormServices = {
  searchUsersByLogin: (login: string) => Promise<unknown>;
  openDmWithUser: (user: ApiUser) => Promise<number>;
  onDone: (chatId: number) => void;
  closeModal: () => void;
};

type DmUserRowVm = {
  id: number;
  displayName: string;
  login: string;
  active: boolean;
};

class CreateDmForm extends Block<CreateDmFormProps> {
  protected template = template;

  private readonly services: CreateDmFormServices;

  private readonly shell: MessengerModalShell;

  private selectedUser: ApiUser | null = null;

  private lastResults: ApiUser[] = [];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  private searchInputEl: HTMLInputElement | null = null;

  private listUi: { showHintOnly: boolean; listHint: string } = {
    showHintOnly: true,
    listHint: "Type a login to search (API /user/search).",
  };

  private userRows: DmUserRowVm[] = [];

  constructor(services: CreateDmFormServices, shell: MessengerModalShell) {
    super({} as CreateDmFormProps);
    this.services = services;
    this.shell = shell;
  }

  protected componentDidMount(): void {
    const input = this.refs.searchInput as HTMLInputElement | undefined;

    if (input) {
      this.searchInputEl = input;
      input.addEventListener("input", this.onSearchInput);
    }

    this.applyListFromSearch("", []);
    (this.refs.searchInput as HTMLInputElement | undefined)?.focus();
    this.shell.setSubmitDisabled(true);
  }

  protected componentWillUnmount(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchInputEl?.removeEventListener("input", this.onSearchInput);
    this.searchInputEl = null;
  }

  private mapUserRows(users: ApiUser[]): DmUserRowVm[] {
    return users.map((u) => ({
      id: u.id,
      displayName: escapeHtml(userDisplayName(u)),
      login: escapeHtml(u.login),
      active: this.selectedUser?.id === u.id,
    }));
  }

  private ensureListUl(): HTMLUListElement | null {
    const mount = this.refs.listMount as HTMLElement | undefined;

    if (!mount) {
      return null;
    }

    let ul = mount.querySelector<HTMLUListElement>(
      "ul.dm-user-pick-results__ul",
    );

    if (!ul) {
      ul = document.createElement("ul");
      ul.className = "messenger-modal__user-list dm-user-pick-results__ul";
      ul.setAttribute("role", "listbox");
      ul.setAttribute("aria-label", "Search results");
      mount.appendChild(ul);
    }

    return ul;
  }

  private syncListDom(): void {
    const ul = this.ensureListUl();

    if (!ul) {
      return;
    }

    ul.replaceChildren();

    if (this.listUi.showHintOnly) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = this.listUi.listHint;
      ul.appendChild(li);

      return;
    }

    for (const row of this.userRows) {
      const li = document.createElement("li");

      li.className = `messenger-modal__user-row${row.active ? " messenger-modal__user-row--active" : ""}`;
      li.setAttribute("role", "option");
      li.dataset.userId = String(row.id);
      li.innerHTML = `<span class="messenger-modal__user-dot messenger-modal__user-dot--gray" aria-hidden="true"></span><span class="messenger-modal__user-meta"><span class="messenger-modal__user-name">${row.displayName}</span><span class="messenger-modal__user-login">@${row.login}</span></span>`;
      ul.appendChild(li);
    }

    if (this.userRows.length === 0) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = "No users found.";
      ul.appendChild(li);
    }
  }

  private applyListFromSearch(login: string, apiUsers: ApiUser[]): void {
    const trimmed = login.trim();

    if (trimmed.length < 1) {
      this.lastResults = [];
      this.listUi = {
        showHintOnly: true,
        listHint: "Type a login to search (API /user/search).",
      };
      this.userRows = [];
      this.syncListDom();

      return;
    }

    this.lastResults = apiUsers;
    this.listUi = { showHintOnly: false, listHint: "" };
    this.userRows = this.mapUserRows(apiUsers);
    this.syncListDom();
  }

  private syncSubmit(): void {
    this.shell.setSubmitDisabled(this.selectedUser === null);
  }

  async submit(): Promise<void> {
    if (!this.selectedUser) {
      return;
    }

    this.shell.setSubmitDisabled(true);

    try {
      const chatId = await this.services.openDmWithUser(this.selectedUser);

      this.services.onDone(chatId);
      this.services.closeModal();
    } catch (e) {
      this.syncSubmit();
      showErrorToast(e instanceof ApiError ? e.message : String(e));
    }
  }

  private readonly onSearchInput = (): void => {
    const target = this.searchInputEl;

    if (!target) {
      return;
    }

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const value = target.value;

    this.searchTimer = setTimeout(() => {
      const login = value.trim();

      if (login.length < 1) {
        this.applyListFromSearch("", []);

        return;
      }

      void this.services
        .searchUsersByLogin(login)
        .then((response) => {
          const users = normalizeUserSearchResponse(response);

          this.applyListFromSearch(login, users);
        })
        .catch((err: unknown) => {
          showErrorToast(err instanceof ApiError ? err.message : String(err));
        });
    }, DEBOUNCE_MS);
  };

  private readonly onRootClick = (event: Event): void => {
    const root = event.currentTarget as HTMLElement;
    const target = event.target as HTMLElement;

    const row = target.closest<HTMLElement>("[data-user-id]");

    if (row && root.contains(row)) {
      const id = Number(row.dataset.userId);
      const user = this.lastResults.find((u) => u.id === id);

      if (!user) {
        return;
      }

      this.selectedUser = user;
      this.userRows = this.mapUserRows(this.lastResults);
      this.syncListDom();
      this.syncSubmit();
    }
  };

  protected events = {
    click: this.onRootClick,
  };
}

export { CreateDmForm };
