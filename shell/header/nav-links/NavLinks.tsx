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
      {items.map((item, index) => (
        <MenuItem
          // TODO: Do something better than using the array index here.
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          item={item}
          linkVariant="navLink"
        />
      ))}
    </Nav>
  );
}
