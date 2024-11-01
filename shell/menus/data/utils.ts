import { isValidElement, ReactElement, ReactNode } from 'react';
import { IntlShape, MessageDescriptor } from 'react-intl';

import {
  AppMenuItem,
  DropdownMenuItem,
  LinkMenuItem, MenuItem,
  UrlMenuItem
} from '../../../types';
// A name can be a string or a react-intl MessageDescriptor.
export function getItemLabel(item: LinkMenuItem | DropdownMenuItem, intl: IntlShape): ReactNode {
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

export function isAppMenuItem(item: MenuItem): item is AppMenuItem {
  return item && typeof item === 'object' && 'appId' in item;
}

export function isUrlMenuItem(item: MenuItem): item is UrlMenuItem {
  return item && typeof item === 'object' && 'url' in item;
}

export function isReactNodeMenuItem(item: LinkMenuItem | DropdownMenuItem | ReactElement): item is ReactElement {
  return isValidElement(item);
}

export function isDropdownMenuItem(item: MenuItem): item is DropdownMenuItem {
  return item && typeof item === 'object' && 'items' in item;
}
