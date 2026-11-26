import { Dropdown, Hyperlink, NavDropdown, NavLink } from '@openedx/paragon';
import { ComponentProps } from 'react';
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
  /** Where to open the link, such as `_blank` for a new tab. */
  target?: React.HTMLAttributeAnchorTarget;
  /** Link relationship. Defaults to `noopener noreferrer` when `target` is `_blank`. */
  rel?: string;
}

export default function LinkMenuItem({ label, role, url, variant = 'hyperlink', target, rel }: LinkMenuItemProps) {
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
  const linkProps = {
    ...getLinkProps(finalUrl),
    target,
    // Default rel for new tabs to protect against reverse tabnabbing: without noopener, the
    // opened page gets a window.opener handle and can redirect this one.
    rel: rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined),
  };

  if (variant === 'hyperlink') {
    return (
      // Paragon types Hyperlink's target as '_blank' | '_self', but it passes any value through to
      // the anchor.
      <Hyperlink {...linkProps} target={target as ComponentProps<typeof Hyperlink>['target']}>
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
