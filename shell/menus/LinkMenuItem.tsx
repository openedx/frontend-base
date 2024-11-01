import { Dropdown, Hyperlink, NavDropdown, NavLink } from '@openedx/paragon';
import { useIntl } from 'react-intl';

import { getAppUrl } from '../../runtime/routing';
import {
  LinkMenuItemConfig
} from '../../types';
import {
  getItemLabel,
  isAppMenuItem,
  isUrlMenuItem
} from './data/utils';

interface LinkMenuItemProps {
  item: LinkMenuItemConfig,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function LinkMenuItem({ item, variant = 'hyperlink' }: LinkMenuItemProps) {
  const intl = useIntl();
  const label = getItemLabel(item, intl);

  let url: string | null = null;
  if (isAppMenuItem(item)) {
    url = getAppUrl(item.appId);
  } else if (isUrlMenuItem(item)) {
    url = item.url;
  }

  // The URL will only be null if the item is an "app" menu item, and if the app is not loaded.
  // We automatically hide the link if this is the case.
  if (url === null) {
    return null;
  }

  if (variant === 'hyperlink') {
    return (
      <Hyperlink destination={url}>
        {label}
      </Hyperlink>
    );
  } else if (variant === 'navLink') {
    return (
      <NavLink href={url}>
        {label}
      </NavLink>
    );
  } else if (variant === 'navDropdownItem') {
    return (
      <NavDropdown.Item href={url}>
        {label}
      </NavDropdown.Item>
    );
  } else if (variant === 'dropdownItem') {
    return (
      <Dropdown.Item href={url}>
        {label}
      </Dropdown.Item>
    );
  }

  // Just return null if the item is something we haven't accounted for above.
  return null;
}
