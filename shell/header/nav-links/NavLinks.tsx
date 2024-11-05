import { Nav } from '@openedx/paragon';
import {
  MenuItemConfig
} from '../../../types';
import MenuItem from '../../menus/MenuItem';

interface NavLinksProps {
  items: MenuItemConfig[],
  className?: string,
}

export default function NavLinks({ items, className }: NavLinksProps) {
  return (
    <Nav className={className}>
      {items.map((item) => (
        <MenuItem key={item.id} item={item} linkVariant="navLink" />
      ))}
    </Nav>
  );
}
