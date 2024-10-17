import { Nav, NavLink } from '@openedx/paragon';
import {
  Fragment, isValidElement
} from 'react';
import getAppUrl from '../../runtime/routing/getAppUrl';
import { AppMenuItem, DataMenuItem, MenuItem } from '../../types';
import NavLinkDropdown from './NavLinkDropdown';

interface NavLinksProps {
  items: Array<MenuItem>,
  className?: string
}

export default function NavLinks({ items, className }: NavLinksProps) {
  return (
    <Nav className={className}>
      {items.map((item, index) => {
        if (isValidElement(item)) {
          // eslint-disable-next-line react/no-array-index-key
          return <Fragment key={index}>{item}</Fragment>;
        }
        const menuItem = item as DataMenuItem;
        if ('href' in menuItem) {
          return (
            <NavLink key={menuItem.name} href={menuItem.href}>
              {menuItem.name}
            </NavLink>
          );
        }
        if ('appId' in menuItem) {
          const appMenuItem = menuItem as AppMenuItem;
          const href = getAppUrl(appMenuItem.appId);
          return (
            <NavLink key={appMenuItem.name} href={href}>
              {appMenuItem.name}
            </NavLink>
          );
        }
        if ('items' in menuItem) {
          return (
            <NavLinkDropdown item={menuItem} />
          );
        }
        return null;
      })}
    </Nav>
  );
}
