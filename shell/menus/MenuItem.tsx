import {
  MenuItemConfig
} from '../../types';
import ChildMenuItem from './ChildMenuItem';
import {
  isDropdownMenuItem
} from './data/utils';
import MenuDropdown from './MenuDropdown';

interface MenuItemProps {
  item: MenuItemConfig,
  linkVariant?: 'hyperlink' | 'navLink',
}

export default function MenuItem({ item, linkVariant = 'hyperlink' }: MenuItemProps) {
  // If the item is falsy for whatever reason, just return null.
  if (!item) {
    return null;
  }

  if (isDropdownMenuItem(item)) {
    return (
      <MenuDropdown item={item} />
    );
  }

  return (
    <ChildMenuItem item={item} variant={linkVariant} />
  );
}
