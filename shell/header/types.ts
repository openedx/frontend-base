export interface LinkMenuItem {
  type: 'item' | 'menu',
  href: string,
  content: string,
  submenuContent: JSX.Element,
  disabled: boolean,
  isActive: boolean,
  onClick?: () => void,
}
