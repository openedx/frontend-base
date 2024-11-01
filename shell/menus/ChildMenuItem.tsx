import {
  ChildMenuItemConfig
} from '../../types';
import {
  isLinkMenuItem,
  isReactElementMenuItem
} from './data/utils';
import LinkItem from './LinkItem';

interface ChildMenuItemProps {
  item: ChildMenuItemConfig,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function ChildMenuItem({ item, variant = 'hyperlink' }: ChildMenuItemProps) {
  // If the item is falsy for whatever reason, just return null.
  if (!item) {
    return null;
  }

  if (isReactElementMenuItem(item)) {
    return item;
  }

  if (isLinkMenuItem(item)) {
    return (
      <LinkItem item={item} variant={variant} />
    );
  }

  return null;
}
