import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';

import { useLayoutOptionsForId, useWidgetsForId } from '../../runtime';
import {
  MenuItemName
} from '../../types';
import {
  getItemLabel
} from './data/utils';

interface DropdownMenuSlotProps {
  id: string,
  label: MenuItemName,
}

export default function DropdownMenuSlot({ id, label }: DropdownMenuSlotProps) {
  const intl = useIntl();
  const options = useLayoutOptionsForId(id);
  const widgets = useWidgetsForId(id);

  const finalLabel = getItemLabel(options.label ?? label, intl);

  return (
    <NavDropdown key={id} title={finalLabel} id={`${id}-dropdown`}>
      {widgets}
    </NavDropdown>
  );
}
