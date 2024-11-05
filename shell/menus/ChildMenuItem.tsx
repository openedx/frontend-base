import {
  ChildMenuItemConfig
} from '../../types';
import {
  isComponentMenuItem,
  isLinkMenuItem
} from './data/utils';
import LinkMenuItem from './LinkMenuItem';

interface ChildMenuItemProps {
  item: ChildMenuItemConfig,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function ChildMenuItem({ item, variant = 'hyperlink' }: ChildMenuItemProps) {
  // If the item is falsy for whatever reason, just return null.
  if (!item) {
    return null;
  }

  if (isComponentMenuItem(item)) {
    return item.component;
  }

  if (isLinkMenuItem(item)) {
    return (
      <LinkMenuItem item={item} variant={variant} />
    );
  }

  return null;
}
