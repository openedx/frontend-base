import { Nav } from '@openedx/paragon';
import {
  MenuItem
} from '../../../types';
import NavLinkItem from './NavLinkItem';

interface NavLinksProps {
  items: MenuItem[],
  className?: string,
}

export default function NavLinks({ items, className }: NavLinksProps) {
  return (
    <Nav className={className}>
      {items.map((item, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <NavLinkItem key={index} item={item} />
      ))}
    </Nav>
  );
}
