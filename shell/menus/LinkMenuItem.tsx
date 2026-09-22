import { Dropdown, Hyperlink, NavDropdown, NavLink } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { getLinkProps, resolveRouteByRole } from '../../runtime/routing';
import {
  MenuItemName
} from '../../types';
import {
  getItemLabel
} from './data/utils';

interface LinkMenuItemProps {
  label: MenuItemName;
  role?: string;
  url?: string;
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem';
}

export default function LinkMenuItem({ label, role, url, variant = 'hyperlink' }: LinkMenuItemProps) {
  const intl = useIntl();
  const location = useLocation();
  const finalLabel = getItemLabel(label, intl);

  let finalUrl: string | null | undefined;
  if (role !== undefined) {
    finalUrl = resolveRouteByRole(role)?.url;
  } else if (url !== undefined) {
    finalUrl = url;
  }

  // The URL will only be null if the item is an "app" menu item, and if the app is not loaded.
  // We automatically hide the link if this is the case.
  if (!finalUrl) {
    return null;
  }

  // A path in this site is a react-router Link, so the navigation stays in the client; anything
  // else is a plain anchor.
  const linkProps = getLinkProps(finalUrl);

  if (variant === 'hyperlink') {
    return (
      <Hyperlink {...linkProps}>
        {finalLabel}
      </Hyperlink>
    );
  } else if (variant === 'navLink') {
    return (
      <NavLink {...linkProps} active={location.pathname.replace(/\/$/, '') === finalUrl.replace(/\/$/, '')}>
        {finalLabel}
      </NavLink>
    );
  } else if (variant === 'navDropdownItem') {
    return (
      <NavDropdown.Item {...linkProps}>
        {finalLabel}
      </NavDropdown.Item>
    );
  } else if (variant === 'dropdownItem') {
    return (
      <Dropdown.Item {...linkProps}>
        {finalLabel}
      </Dropdown.Item>
    );
  }

  // Just return null if the item is something we haven't accounted for above.
  return null;
}
