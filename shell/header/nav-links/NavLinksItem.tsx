import { NavLink } from '@openedx/paragon';
import { useIntl } from 'react-intl';
import { getAppUrl } from '../../../runtime/routing';
import {
  MenuItem
} from '../../../types';
import {
  getItemLabel,
  isAppMenuItem,
  isDropdownMenuItem,
  isReactNodeMenuItem,
  isUrlMenuItem
} from '../../menus/data/utils';
import NavLinkDropdown from './NavLinkDropdown';

interface NavLinksItemProps {
  item: MenuItem,
}

export default function NavLinksItem({ item }: NavLinksItemProps) {
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
        <NavLink href={url}>
          {label}
        </NavLink>
      );
    }
    return null;
  }
  if (isUrlMenuItem(item)) {
    const label = getItemLabel(item, intl);
    return (
      <NavLink href={item.url}>
        {label}
      </NavLink>
    );
  }
  if (isDropdownMenuItem(item)) {
    return (
      <NavLinkDropdown item={item} />
    );
  }
  // If the item is something we haven't accounted for above, we don't know
  // how to display it here.  Just return null.
  return null;
}
