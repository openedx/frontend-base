import { Nav } from '@openedx/paragon';
import {
  MenuItem
} from '../../../types';
import NavLinksItem from './NavLinksItem';

interface NavLinksProps {
  items: Array<MenuItem>,
  className?: string
}

export default function NavLinks({ items, className }: NavLinksProps) {
  return (
    <Nav className={className}>
      {items.map((item, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <NavLinksItem key={index} item={item} />
      ))}
    </Nav>
  );
}
