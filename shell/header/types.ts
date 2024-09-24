export interface LinkMenuItem {
  type: string,
  href: string,
  content: string,
  submenuContent?: JSX.Element,
  disabled?: boolean,
  isActive?: boolean,
  onClick?: () => void,
}
