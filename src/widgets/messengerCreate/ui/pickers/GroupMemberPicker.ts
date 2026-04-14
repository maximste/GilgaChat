import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { escapeHtml } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import { showErrorToast } from "@/shared/ui/toast";

import { normalizeUserSearchResponse } from "../../lib/normalizeUserSearchResponse";
import { userDisplayName } from "../../lib/userDisplayName";
import template from "./GroupMemberPicker.hbs?raw";

import "./groupMemberPickerDropdown.scss";

const DEBOUNCE_MS = 320;

type GroupMemberPickerProps = BlockOwnProps;

export type GroupMemberPickerServices = {
  searchUsersByLogin: (login: string) => Promise<unknown>;
  getProfileFromStore: () => ApiUser | null;
  onSelectionChange: () => void;
  /** id пользователей, которых не показывать в результатах поиска (уже в чате). */
  getExcludeUserIds?: () => number[];
};

type ChipVm = { id: number; label: string };

type MemberRowVm = {
  id: number;
  displayName: string;
  login: string;
  picked: boolean;
};

/**
 * Поиск участников, чипы и выпадающий список результатов (fixed + портал в body, без места в вёрстке).
 */
class GroupMemberPicker extends Block<GroupMemberPickerProps> {
  protected template = template;

  private readonly services: GroupMemberPickerServices;

  private readonly selected = new Map<number, ApiUser>();

  private lastMemberResults: ApiUser[] = [];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  private listUi: {
    showMemberHintOnly: boolean;
    memberListHint: string;
  } = {
    showMemberHintOnly: true,
    memberListHint: "Type a login to search.",
  };

  private memberRows: MemberRowVm[] = [];

  private memberSearchEl: HTMLInputElement | null = null;

  private dropdownPanelEl: HTMLDivElement | null = null;

  private dropdownOpen = false;

  constructor(services: GroupMemberPickerServices) {
    super({} as GroupMemberPickerProps);
    this.services = services;
  }

  protected componentDidMount(): void {
    const panel = document.createElement("div");

    panel.id = `gmp-results-${Math.random().toString(36).slice(2, 11)}`;
    panel.className = "group-member-picker__dropdown-panel";
    panel.hidden = true;
    panel.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    panel.addEventListener("click", this.onDropdownPanelClick);
    document.body.appendChild(panel);
    this.dropdownPanelEl = panel;

    document.addEventListener("pointerdown", this.onDocPointerDown, true);
    window.addEventListener("scroll", this.onWindowScrollOrResize, true);
    window.addEventListener("resize", this.onWindowScrollOrResize);

    const searchInput = this.refs.memberSearchInput as
      | HTMLInputElement
      | undefined;

    if (searchInput) {
      this.memberSearchEl = searchInput;
      searchInput.setAttribute("aria-controls", panel.id);
      searchInput.addEventListener("input", this.onMemberSearchInput);
      searchInput.addEventListener("focus", this.onSearchFocus);
      searchInput.addEventListener("focusout", this.onSearchFocusOut);
      searchInput.addEventListener("keydown", this.onSearchKeydown);
    }

    this.pushResults({ memberRows: [] });
    this.updateMembersLabel();
  }

  protected componentWillUnmount(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    document.removeEventListener("pointerdown", this.onDocPointerDown, true);
    window.removeEventListener("scroll", this.onWindowScrollOrResize, true);
    window.removeEventListener("resize", this.onWindowScrollOrResize);

    this.memberSearchEl?.removeEventListener("input", this.onMemberSearchInput);
    this.memberSearchEl?.removeEventListener("focus", this.onSearchFocus);
    this.memberSearchEl?.removeEventListener("focusout", this.onSearchFocusOut);
    this.memberSearchEl?.removeEventListener("keydown", this.onSearchKeydown);
    this.memberSearchEl = null;

    this.dropdownPanelEl?.removeEventListener(
      "click",
      this.onDropdownPanelClick,
    );
    this.dropdownPanelEl?.remove();
    this.dropdownPanelEl = null;
  }

  getSelectedUserIds(): number[] {
    return [...this.selected.keys()];
  }

  clearSelection(): void {
    this.selected.clear();
    this.pushResults({
      memberRows: this.buildMemberRows(this.lastMemberResults),
    });
    this.updateMembersLabel();
  }

  /** Сброс строки поиска и выпадающего списка (например после успешного добавления в чат). */
  clearSearchInput(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    if (this.memberSearchEl) {
      this.memberSearchEl.value = "";
    }

    this.lastMemberResults = [];
    this.listUi = {
      showMemberHintOnly: true,
      memberListHint: "Type a login to search.",
    };
    this.dropdownOpen = false;
    this.pushResults({ memberRows: [] });
    this.syncDropdownShell();
  }

  /** Вызвать после смены `getExcludeUserIds`, чтобы скрыть уже добавленных в списке поиска. */
  refreshAfterExcludeChange(): void {
    this.pushResults({
      memberRows: this.buildMemberRows(this.lastMemberResults),
    });
  }

  private selfId(): number | null {
    return this.services.getProfileFromStore()?.id ?? null;
  }

  private buildChips(): ChipVm[] {
    return [...this.selected.values()].map((u) => ({
      id: u.id,
      label: escapeHtml(userDisplayName(u)),
    }));
  }

  private buildMemberRows(users: ApiUser[]): MemberRowVm[] {
    const self = this.selfId();
    const exclude = new Set(this.services.getExcludeUserIds?.() ?? []);
    const rows: MemberRowVm[] = [];

    for (const u of users) {
      if (self !== null && u.id === self) {
        continue;
      }

      if (exclude.has(u.id)) {
        continue;
      }

      rows.push({
        id: u.id,
        displayName: escapeHtml(userDisplayName(u)),
        login: escapeHtml(u.login),
        picked: this.selected.has(u.id),
      });
    }

    return rows;
  }

  private updateMembersLabel(): void {
    const el = this.refs.membersLabel as HTMLElement | undefined;

    if (el) {
      el.textContent = `Add members (${this.selected.size})`;
    }
  }

  private updateSearchAriaExpanded(): void {
    const input = this.memberSearchEl;

    if (input) {
      input.setAttribute(
        "aria-expanded",
        this.dropdownOpen && !this.dropdownPanelEl?.hidden ? "true" : "false",
      );
    }
  }

  private positionDropdownPanel(): void {
    const input = this.memberSearchEl;
    const panel = this.dropdownPanelEl;

    if (!input || !panel || panel.hidden) {
      return;
    }

    const r = input.getBoundingClientRect();
    const gap = 4;
    const margin = 8;
    const maxPanelH = Math.min(window.innerHeight * 0.4, 280);
    let top = r.bottom + gap;
    let maxHeight = maxPanelH;

    const spaceBelow = window.innerHeight - top - margin;
    const spaceAbove = r.top - margin;

    if (spaceBelow < 120 && spaceAbove > spaceBelow) {
      maxHeight = Math.min(maxPanelH, spaceAbove - gap);
      top = Math.max(margin, r.top - gap - maxHeight);
    } else {
      maxHeight = Math.min(maxPanelH, spaceBelow);
    }

    panel.style.left = `${r.left}px`;
    panel.style.top = `${top}px`;
    panel.style.width = `${r.width}px`;
    panel.style.maxHeight = `${Math.max(80, maxHeight)}px`;
  }

  private syncDropdownShell(): void {
    const panel = this.dropdownPanelEl;

    if (!panel) {
      return;
    }

    if (this.dropdownOpen) {
      panel.hidden = false;
      this.positionDropdownPanel();
      requestAnimationFrame(() => {
        this.positionDropdownPanel();
      });
    } else {
      panel.hidden = true;
    }

    this.updateSearchAriaExpanded();
  }

  private readonly onSearchFocus = (): void => {
    this.dropdownOpen = true;
    this.syncDropdownShell();
  };

  private readonly onSearchFocusOut = (e: FocusEvent): void => {
    const related = e.relatedTarget as Node | null;
    const pickerRoot = this.element();

    if (
      related &&
      (this.dropdownPanelEl?.contains(related) || pickerRoot?.contains(related))
    ) {
      return;
    }

    this.dropdownOpen = false;
    this.syncDropdownShell();
  };

  private readonly onSearchKeydown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") {
      return;
    }

    if (!this.dropdownOpen || this.dropdownPanelEl?.hidden) {
      return;
    }

    e.stopPropagation();
    this.dropdownOpen = false;
    this.syncDropdownShell();
  };

  private readonly onDocPointerDown = (e: PointerEvent): void => {
    if (!this.dropdownOpen) {
      return;
    }

    const t = e.target as Node;
    const pickerRoot = this.element();

    if (pickerRoot?.contains(t) || this.dropdownPanelEl?.contains(t)) {
      return;
    }

    this.dropdownOpen = false;
    this.syncDropdownShell();
  };

  private readonly onWindowScrollOrResize = (): void => {
    if (
      this.dropdownOpen &&
      this.dropdownPanelEl &&
      !this.dropdownPanelEl.hidden
    ) {
      this.positionDropdownPanel();
    }
  };

  private renderChips(): void {
    const host = this.refs.chipsMount as HTMLElement | undefined;

    if (!host) {
      return;
    }

    host.replaceChildren();

    for (const c of this.buildChips()) {
      const span = document.createElement("span");

      span.className = "messenger-modal__chip";
      span.innerHTML = `${c.label}<button type="button" class="messenger-modal__chip-remove" data-chip-remove="${c.id}" aria-label="Remove">&times;</button>`;
      host.appendChild(span);
    }
  }

  private ensureListUl(): HTMLUListElement | null {
    const mount = this.dropdownPanelEl;

    if (!mount) {
      return null;
    }

    let ul = mount.querySelector<HTMLUListElement>(
      "ul.group-member-pick-results__ul",
    );

    if (!ul) {
      ul = document.createElement("ul");
      ul.className = "messenger-modal__user-list group-member-pick-results__ul";
      ul.setAttribute("role", "listbox");
      mount.appendChild(ul);
    }

    return ul;
  }

  /** Список без Handlebars/вложенного Block — гарантированно в DOM. */
  private syncResultsMountDom(): void {
    const ul = this.ensureListUl();

    if (!ul) {
      return;
    }

    ul.replaceChildren();

    if (this.listUi.showMemberHintOnly) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = this.listUi.memberListHint;
      ul.appendChild(li);

      return;
    }

    for (const row of this.memberRows) {
      const li = document.createElement("li");

      li.className = `messenger-modal__user-row${row.picked ? " messenger-modal__user-row--picked" : ""}`;
      li.dataset.memberId = String(row.id);
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", row.picked ? "true" : "false");
      li.innerHTML = `<span class="messenger-modal__user-dot messenger-modal__user-dot--gray" aria-hidden="true"></span><span class="messenger-modal__user-meta"><span class="messenger-modal__user-name">${row.displayName}</span><span class="messenger-modal__user-login">@${row.login}</span></span><span class="messenger-modal__check" aria-hidden="true">${row.picked ? "✓" : ""}</span>`;
      ul.appendChild(li);
    }

    if (this.memberRows.length === 0) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = "No users.";
      ul.appendChild(li);
    }
  }

  private toggleMemberRow(row: HTMLElement): void {
    const id = Number(row.dataset.memberId);
    const user = this.lastMemberResults.find((u) => u.id === id);

    if (!user || Number.isNaN(id)) {
      return;
    }

    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.set(id, user);
    }

    this.pushResults({
      memberRows: this.buildMemberRows(this.lastMemberResults),
    });
  }

  private readonly onDropdownPanelClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>("[data-member-id]");

    if (row) {
      this.toggleMemberRow(row);
    }
  };

  private pushResults(
    patch: Partial<{
      showMemberHintOnly: boolean;
      memberListHint: string;
      memberRows: MemberRowVm[];
    }>,
  ): void {
    if (patch.showMemberHintOnly !== undefined) {
      this.listUi.showMemberHintOnly = patch.showMemberHintOnly;
    }

    if (patch.memberListHint !== undefined) {
      this.listUi.memberListHint = patch.memberListHint;
    }

    if (patch.memberRows !== undefined) {
      this.memberRows = patch.memberRows;
    }

    this.renderChips();
    this.syncResultsMountDom();
    this.updateMembersLabel();
    this.services.onSelectionChange();

    if (this.dropdownOpen) {
      this.syncDropdownShell();
    }
  }

  private applyMemberSearchQuery(raw: string): void {
    const login = raw.trim();

    if (login.length < 1) {
      this.lastMemberResults = [];
      this.listUi = {
        showMemberHintOnly: true,
        memberListHint: "Type a login to search.",
      };
      this.pushResults({ memberRows: [] });

      return;
    }

    void this.services
      .searchUsersByLogin(login)
      .then((response) => {
        const users = normalizeUserSearchResponse(response);

        this.lastMemberResults = users;
        this.listUi = { showMemberHintOnly: false, memberListHint: "" };
        this.pushResults({
          memberRows: this.buildMemberRows(users),
        });
      })
      .catch((err: unknown) => {
        showErrorToast(err instanceof ApiError ? err.message : String(err));
      });
  }

  private readonly onMemberSearchInput = (): void => {
    const target = this.memberSearchEl;

    if (!target) {
      return;
    }

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const value = target.value;

    this.searchTimer = setTimeout(() => {
      this.applyMemberSearchQuery(value);
    }, DEBOUNCE_MS);
  };

  private readonly onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    const removeChip = target.closest<HTMLButtonElement>("[data-chip-remove]");

    if (removeChip) {
      const id = Number(removeChip.dataset.chipRemove);

      this.selected.delete(id);
      this.pushResults({
        memberRows: this.buildMemberRows(this.lastMemberResults),
      });
    }
  };

  protected events = {
    click: this.onRootClick,
  };
}

export { GroupMemberPicker };
