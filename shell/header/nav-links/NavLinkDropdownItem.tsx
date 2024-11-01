import { NavDropdown } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import { getAppUrl } from '../../../runtime/routing';
import {
  ChildMenuItem
} from '../../../types';
import {
  getItemLabel,
  isAppMenuItem,
  isReactNodeMenuItem,
  isUrlMenuItem
} from '../../menus/data/utils';

interface NavLinkDropdownItemProps {
  item: ChildMenuItem,
}

export default function NavLinkDropdownItem({ item }: NavLinkDropdownItemProps) {
  const intl = useIntl();

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
        <NavDropdown.Item href={url}>
          {label}
        </NavDropdown.Item>
      );
    }
    return null;
  }
  if (isUrlMenuItem(item)) {
    const label = getItemLabel(item, intl);
    return (
      <NavDropdown.Item href={item.url}>
        {label}
      </NavDropdown.Item>
    );
  }

  // If the item is something we haven't accounted for above, we don't know
  // how to display it here.  Just return null.
  return null;
}
