import { Dropdown, NavDropdown } from '@openedx/paragon';
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

interface DropdownItemProps {
  item: ChildMenuItem,
  as?: typeof Dropdown.Item | typeof NavDropdown.Item,
}

export default function DropdownItem({ item, as = Dropdown.Item }: DropdownItemProps) {
  const intl = useIntl();

  const Component = as;

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
        <Component href={url}>
          {label}
        </Component>
      );
    }
    return null;
  }
  if (isUrlMenuItem(item)) {
    const label = getItemLabel(item, intl);
    return (
      <Component href={item.url}>
        {label}
      </Component>
    );
  }

  // If the item is something we haven't accounted for above, we don't know
  // how to display it here.  Just return null.
  return null;
}
