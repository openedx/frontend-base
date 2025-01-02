import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import { useLayoutOptionsById, useSlotWidgetsById } from '../../runtime/slots/data/hooks';
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
  const options = useLayoutOptionsById(id);
  const widgets = useSlotWidgetsById(id);

  const finalLabel = getItemLabel(options.label ?? label, intl);

  return (
    <NavDropdown key={id} title={finalLabel} id={`${id}-dropdown`}>
      {widgets}
    </NavDropdown>
  );
}
