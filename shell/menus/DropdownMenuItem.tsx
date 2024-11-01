import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import {
  DropdownMenuItemConfig
} from '../../types';
import ChildMenuItem from './ChildMenuItem';
import {
  getItemLabel
} from './data/utils';

interface DropdownMenuItemProps {
  item: DropdownMenuItemConfig,
}

export default function DropdownMenuItem({ item }: DropdownMenuItemProps) {
  const intl = useIntl();
  const dropdownLabel = getItemLabel(item, intl);
  return (
    <NavDropdown key={dropdownLabel} title={dropdownLabel} id={`${dropdownLabel}-dropdown`}>
      {item.items.map((subItem, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <ChildMenuItem key={index} item={subItem} variant="navDropdownItem" />
      ))}
    </NavDropdown>
  );
}
