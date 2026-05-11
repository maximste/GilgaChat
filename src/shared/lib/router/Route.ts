import type { Block, BlockOwnProps } from "@/shared/ui/block";

import { normalizeAppPath } from "./path/normalizePath";

/**
 * Класс страницы для роутера: любой наследник `Block`.
 * Аргументы конструктора не фиксируем (`connect`, экраны без пропсов, частичные пропсы).
 */
/** `any[]`: у страниц разные конструкторы (`connect`, пропсы, без аргументов). */
type BlockPageConstructor = new (...args: any[]) => Block<BlockOwnProps>;

interface RouteProps {
  rootQuery: string;
}

class Route {
  private _pathname: string;

  private readonly _blockClass: BlockPageConstructor;

  private _block: Block<BlockOwnProps> | null = null;

  private readonly _props: RouteProps;

  constructor(pathname: string, view: BlockPageConstructor, props: RouteProps) {
    this._pathname = normalizeAppPath(pathname);
    this._blockClass = view;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.destroy();
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return normalizeAppPath(pathname) === this._pathname;
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
    }
    Route.mountBlockInRoot(this._props.rootQuery, this._block);
  }

  /** Монтирует корень Block в контейнер по селектору */
  private static mountBlockInRoot(
    rootQuery: string,
    block: Block<BlockOwnProps>,
  ): void {
    const root = document.querySelector(rootQuery);

    if (!root) {
      throw new Error(`Root element not found: ${rootQuery}`);
    }
    const el = block.element();

    if (!el) {
      return;
    }
    root.replaceChildren(el);
  }
}
export { type BlockPageConstructor, Route, type RouteProps };
