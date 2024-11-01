import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import {
  DropdownMenuItem
} from '../../../types';
import {
  getItemLabel
} from '../../menus/data/utils';
import DropdownItem from './DropdownItem';

interface NavLinkDropdownProps {
  item: DropdownMenuItem,
}

export default function NavLinkDropdown({ item }: NavLinkDropdownProps) {
  const intl = useIntl();
  const dropdownLabel = getItemLabel(item, intl);
  return (
    <NavDropdown key={dropdownLabel} title={dropdownLabel} id={`${dropdownLabel}-dropdown`}>
      {item.items.map((subItem, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <DropdownItem key={index} item={subItem} as={NavDropdown.Item} />
      ))}
    </NavDropdown>
  );
}
