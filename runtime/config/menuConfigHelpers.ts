import { ReactElement } from 'react';
import { MessageDescriptor } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { AppMenuItemConfig, ChildMenuItemConfig, ComponentMenuItemConfig, DropdownMenuItemConfig, LabeledMenuConfig, MenuItemConfig, MenuItemName, UrlMenuItemConfig } from '../../types';

export function createUrlMenuItem(label: MenuItemName, url: string): UrlMenuItemConfig {
  return {
    id: uuid(),
    label,
    url,
  };
}

export function createAppMenuItem(label: MenuItemName, appId: string): AppMenuItemConfig {
  return {
    id: uuid(),
    label,
    appId,
  };
}

export function createDropdownMenuItem(label: MessageDescriptor | string, items: ChildMenuItemConfig[]): DropdownMenuItemConfig {
  return {
    id: uuid(),
    label,
    items,
  };
}

export function createComponentMenuItem(component: ReactElement): ComponentMenuItemConfig {
  return {
    id: uuid(),
    component,
  };
}

export function createLabeledMenu(label: MenuItemName, links: MenuItemConfig[]): LabeledMenuConfig {
  return {
    id: uuid(),
    label,
    links,
  };
}
