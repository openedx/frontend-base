import { Dropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';

import { getAppUrl } from '../../../runtime/routing';
import {
  MenuItem
} from '../../../types';

import {
  getItemLabel,
  isAppMenuItem,
  isReactNodeMenuItem,
  isUrlMenuItem
} from '../data/utils';

interface AuthenticatedMenuItemProps {
  item: MenuItem
}

export default function AuthenticatedMenuItem({ item }: AuthenticatedMenuItemProps) {
  const intl = useIntl();

  // If the item is falsy for whatever reason, just return null.
  if (!item) {
    return null;
  }
  if (isReactNodeMenuItem(item)) {
    return item;
  }
  if (isAppMenuItem(item)) {
    const url = getAppUrl(item.appId);
    // If the app in question is not loaded, then the url may be null. If this is the case,
    // we just don't bother to try to show the link.  This helps us keep configuration logic
    // simpler.
    if (url !== null) {
      const label = getItemLabel(item, intl);
      return (
        <Dropdown.Item href={url}>
          {label}
        </Dropdown.Item>
      );
    }
    return null;
  }
  if (isUrlMenuItem(item)) {
    const label = getItemLabel(item, intl);
    return (
      <Dropdown.Item href={item.url}>
        {label}
      </Dropdown.Item>
    );
  }
  // If the item is something we haven't accounted for above, we don't know
  // how to display it here.  Just return null.
  return null;
}
