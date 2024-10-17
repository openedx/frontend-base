import { NavDropdown } from '@openedx/paragon';
import {
  Fragment, isValidElement
} from 'react';
import getAppUrl from '../../runtime/routing/getAppUrl';
import {
  AppMenuItem,
  DropdownMenuItem, LinkMenuItem
} from '../../types';

interface NavLinkDropdownProps {
  item: DropdownMenuItem
}

export default function NavLinkDropdown({ item }: NavLinkDropdownProps) {
  return (
    <NavDropdown key={item.name} title={item.name} id={`${item.name}-dropdown`}>
      {item.items.map((subItem, index) => {
        if (isValidElement(subItem)) {
          // eslint-disable-next-line react/no-array-index-key
          return <Fragment key={index}>{subItem}</Fragment>;
        }
        let url: string | null = null;
        let name: string = '';
        if ('href' in (subItem as LinkMenuItem)) {
          const linkMenuItem = subItem as LinkMenuItem;
          url = linkMenuItem.href;
          name = linkMenuItem.name;
          return (
            <NavDropdown.Item key={linkMenuItem.name} href={linkMenuItem.href}>
              {linkMenuItem.name}
            </NavDropdown.Item>
          );
        }
        if ('appId' in (subItem as AppMenuItem)) {
          const appMenuItem = subItem as AppMenuItem;
          url = getAppUrl(appMenuItem.appId);
          name = appMenuItem.name;
        }
        if (url !== null) {
          return (
            <NavDropdown.Item key={name} href={url}>
              {name}
            </NavDropdown.Item>
          );
        }
        return null;
      })}
    </NavDropdown>
  );
}
