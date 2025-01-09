import { Dropdown, Hyperlink, NavDropdown, NavLink } from '@openedx/paragon';
import { useIntl } from 'react-intl';

import { getUrlByRouteRole } from '../../runtime/routing';
import {
  MenuItemName
} from '../../types';
import {
  getItemLabel
} from './data/utils';

interface LinkMenuItemProps {
  label: MenuItemName,
  role?: string,
  url?: string,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function LinkMenuItem({ label, role, url, variant = 'hyperlink' }: LinkMenuItemProps) {
  const intl = useIntl();
  const finalLabel = getItemLabel(label, intl);

  let finalUrl: string | null | undefined;
  if (role !== undefined) {
    finalUrl = getUrlByRouteRole(role);
  } else if (url !== undefined) {
    finalUrl = url;
  }

  // The URL will only be null if the item is an "app" menu item, and if the app is not loaded.
  // We automatically hide the link if this is the case.
  if (!finalUrl) {
    return null;
  }

  if (variant === 'hyperlink') {
    return (
      <Hyperlink destination={finalUrl}>
        {finalLabel}
      </Hyperlink>
    );
  } else if (variant === 'navLink') {
    return (
      <NavLink href={finalUrl}>
        {finalLabel}
      </NavLink>
    );
  } else if (variant === 'navDropdownItem') {
    return (
      <NavDropdown.Item href={finalUrl}>
        {finalLabel}
      </NavDropdown.Item>
    );
  } else if (variant === 'dropdownItem') {
    return (
      <Dropdown.Item href={finalUrl}>
        {finalLabel}
      </Dropdown.Item>
    );
  }

  // Just return null if the item is something we haven't accounted for above.
  return null;
}
