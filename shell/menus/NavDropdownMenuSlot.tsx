import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import { useSlotOptionsById, useSlotWidgetsById } from '../../runtime/slots/hooks';
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
  const options = useSlotOptionsById(id);
  const widgets = useSlotWidgetsById(id);

  const finalLabel = getItemLabel(options.label ?? label, intl);

  return (
    <NavDropdown key={id} title={finalLabel} id={`${id}-dropdown`}>
      {widgets}
    </NavDropdown>
  );
}
