import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./NoChatStub.hbs?raw";

import "./NoChatStub.scss";

export interface NoChatStubProps {
  title: string;
  description?: string;
  /** Растянуть заглушку по высоте колонки (главная область мессенджера) */
  fillVertical?: boolean;
}

type NoChatStubBlockProps = NoChatStubProps & BlockOwnProps;

export class NoChatStub extends Block<NoChatStubBlockProps> {
  static componentName = "NoChatStub";

  protected template = template;

  constructor(props: NoChatStubProps) {
    super(props as NoChatStubBlockProps);
  }
}
