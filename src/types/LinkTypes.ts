interface LinkProps {
  href: string;
  text: string;
  className?: string;
  target?: '_blank' | '_top' | '_self' | '_parent'
  rel?: string;
}

export type { LinkProps };
