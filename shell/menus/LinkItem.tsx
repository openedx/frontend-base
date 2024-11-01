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

interface LinkItemProps {
  item: LinkMenuItemConfig,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function LinkItem({ item, variant = 'hyperlink' }: LinkItemProps) {
  const intl = useIntl();
  const label = getItemLabel(item, intl);

  let url: string | null = null;
  if (isAppMenuItem(item)) {
    url = getAppUrl(item.appId);
  } else if (isUrlMenuItem(item)) {
    url = item.url;
  }

  // If the app in question is not loaded, then the url may be null. If this is the case,
  // we just don't bother to try to show the link.  This helps us keep configuration logic
  // simpler.
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

  // If the item is something we haven't accounted for above, we don't know
  // how to display it here.  Just return null.
  return null;
}
