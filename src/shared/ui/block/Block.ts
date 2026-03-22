import Handlebars from "handlebars";

export default abstract class Block<Props extends object> {
  protected abstract template: string;

  protected props = {} as Props;

  private domElement: Element | null = null;

  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement("template");

    templateElement.innerHTML = html;

    return templateElement.content.firstElementChild;
  }

  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }

    return this.domElement;
  }

  /** Метод для переопределения в классе-наследнике */
  protected componentDidMount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Метод для общей mount-логики и вызова componentDidMount */
  private mountComponent() {
    /** Здесь можно будет реализовать общую для всех компонентов логику */

    /** Вызов метода, который мог быть переопределён в классе-наследнике */
    this.componentDidMount();
  }

  /** Метод для переопределения в классе-наследнике */
  protected componentWillUnmount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Метод для общей unmount-логики и вызова componentWillUnmount */
  private unmountComponent() {
    /** Проверка наличия элемента, нужно для первого рендера */
    if (this.domElement) {
      /** Вызов метода, который мог быть переопределён в классе-наследнике */
      this.componentWillUnmount();

      /** Здесь можно будет реализовать общую для всех компонентов логику */
    }
  }

  protected render() {
    this.unmountComponent();
    const fragment = this.compile();

    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }

    this.domElement = fragment;
    this.mountComponent();
  }

  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props };
    this.render();
  }
}

export { Block };
