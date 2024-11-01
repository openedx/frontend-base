import { isValidElement, ReactElement, ReactNode } from 'react';
import { IntlShape, MessageDescriptor } from 'react-intl';

import {
  AppMenuItemConfig,
  DropdownMenuItemConfig,
  LinkMenuItemConfig,
  MenuItemConfig,
  UrlMenuItemConfig,
} from '../../../types';
// A name can be a string or a react-intl MessageDescriptor.
export function getItemLabel(item: LinkMenuItemConfig | DropdownMenuItemConfig, intl: IntlShape): ReactNode {
  const { label } = item;

  if (typeof label === 'string') {
    return label;
  }

  if (isValidElement(label)) {
    return label;
  }

  // If it's not a valid element, it's a MessageDescriptor.
  return intl.formatMessage(label as MessageDescriptor);
}

export function isAppMenuItem(item: MenuItemConfig): item is AppMenuItemConfig {
  return item && typeof item === 'object' && 'appId' in item;
}

export function isUrlMenuItem(item: MenuItemConfig): item is UrlMenuItemConfig {
  return item && typeof item === 'object' && 'url' in item;
}

export function isReactElementMenuItem(item: LinkMenuItemConfig | DropdownMenuItemConfig | ReactElement): item is ReactElement {
  return isValidElement(item);
}

export function isDropdownMenuItem(item: MenuItemConfig): item is DropdownMenuItemConfig {
  return item && typeof item === 'object' && 'items' in item;
}

export function isLinkMenuItem(item: MenuItemConfig) {
  return isAppMenuItem(item) || isUrlMenuItem(item);
}
