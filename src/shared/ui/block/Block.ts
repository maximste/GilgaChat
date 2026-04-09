import Handlebars from "handlebars";

/**
 * Служебные поля контекста шаблона (совпадают с тем, что заполняет registerComponent):
 * - __children — очередь дочерних Block, созданных хелперами во время compile(); после строки HTML
 *   для каждого вызывается embed(), чтобы подменить заглушку на реальный DOM компонента.
 * - __refs — опциональные ссылки на элементы по ключу ref (если хелпер передал ref в hash).
 */
interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
}

type EventListType = Partial<
  Record<keyof HTMLElementEventMap, (e: Event) => void>
>;

/**
 * Базовый UI-компонент: шаблон Handlebars + корневой DOM-узел + жизненный цикл.
 *
 * Поток данных:
 * 1) props задают данные для {{...}} в шаблоне; вложенные компоненты подключаются через
 *    зарегистрированные хелперы (см. registerComponent), которые мутируют props.__children.
 * 2) render() → compile(): сначала получаем HTML-строку, парсим во fragment; затем для каждой
 *    записи в __children вызываем embed(fragment) — вставляем смонтированные дочерние Block.
 * 3) Корень (firstElementChild) становится domElement; вешаются события из events.
 *
 * Повторный render(): снимаем слушатели и рекурсивно размонтируем детей, обнуляем __children/__refs
 * (иначе хелперы дописывали бы в тот же массив при следующем compile — рост стека/утечки),
 * снова compile; если старый корень ещё в документе — replaceWith новым.
 */
export default abstract class Block<
  Props extends BlockOwnProps = BlockOwnProps,
> {
  protected abstract template: string;

  protected props = {} as Props;

  private domElement: Element | null = null;

  /** Снимок дочерних Block после последнего compile — нужен для unmount в обратном порядке */
  protected children: Block<object>[] = [];

  /** Ссылки на узлы с атрибутом ref в шаблоне + записи из __refs хелпера */
  protected refs: Record<string, Element> = {};

  protected events: EventListType = {};

  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  /** Ленивый первый рендер: пока нет domElement, вызывается render(). */
  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }

    return this.domElement;
  }

  /** Скрыть корень в DOM (для роутера при смене страницы без destroy у Block). */
  public hide(): void {
    const el = this.domElement;

    if (el instanceof HTMLElement) {
      el.style.display = "none";
    }
  }

  /** Показать корень после hide(). */
  public show(): void {
    const el = this.domElement;

    if (el instanceof HTMLElement) {
      el.style.display = "";
    }
  }

  /**
   * Обновление данных и полный пересчёт DOM. Сбрасываем __children/__refs в props, чтобы
   * следующий compile не наслаивал хелперы на старые записи.
   */
  public setProps(props: Partial<Props>) {
    this.props = {
      ...this.props,
      ...props,
      __children: [],
      __refs: {},
    } as Props;
    this.render();
  }

  /**
   * Снять слушатели и рекурсивно размонтировать дочерние Block (например перед сменой корня #app).
   */
  public destroy(): void {
    if (this.domElement) {
      this.unmountComponent();
    }
    this.domElement = null;
  }

  protected componentDidMount() {}

  private mountComponent() {
    this.attachListeners();
    this.componentDidMount();
  }

  protected componentWillUnmount() {}

  /** Очистка текущего поддерева: дети сначала (обратный порядок), хуки, снятие слушателей. */
  private unmountComponent() {
    if (this.domElement) {
      [...this.children].reverse().forEach((child) => {
        child.unmountComponent();
      });

      this.componentWillUnmount();
      this.removeListeners();
    }
  }

  private attachListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];

      if (typeof eventCallback == "function" && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  private removeListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName as keyof HTMLElementEventMap];

      if (typeof eventCallback === "function" && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
    }
  }

  protected render() {
    const prevRoot = this.domElement;

    if (prevRoot) {
      this.unmountComponent();
    }

    // Перед новым проходом Handlebars — пустые коллекции; иначе registerHelper только push-ит в root.
    this.props.__children = [];
    this.props.__refs = {};

    const fragment = this.compile();

    if (!fragment) {
      this.domElement = null;

      return;
    }

    if (prevRoot?.isConnected) {
      prevRoot.replaceWith(fragment);
    }

    this.domElement = fragment;
    this.mountComponent();
  }

  /**
   * 1) Компиляция шаблона с this.props (хелперы создают дочерние Block и кладут embed в __children).
   * 2) Подстановка DOM дочерних компонентов в fragment.
   * 3) Сбор refs с узлов [ref] в разметке и слияние с __refs из хелпера.
   * Возвращает корневой элемент (первый ребёнок fragment).
   */
  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement("template");

    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    if (this.props.__children) {
      this.children = this.props.__children.map((child) => child.component);

      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    const defaultRefs = this.props?.__refs ?? {};

    this.refs = Array.from(fragment.querySelectorAll("[ref]")).reduce<
      Record<string, Element>
    >((list, element) => {
      const key = element.getAttribute("ref");

      if (key) {
        list[key] = element;
        element.removeAttribute("ref");
      }

      return list;
    }, defaultRefs);

    return templateElement.content.firstElementChild;
  }
}

export { Block, type BlockOwnProps };
