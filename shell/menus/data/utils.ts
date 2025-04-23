import { isValidElement, ReactNode } from 'react';
import { IntlShape, MessageDescriptor } from 'react-intl';

import {
  MenuItemName
} from '../../../types';
// A name can be a string or a react-intl MessageDescriptor.
export function getItemLabel(label: MenuItemName, intl: IntlShape): ReactNode {
  if (typeof label === 'string') {
    return label;
  }

  if (isValidElement(label)) {
    return label;
  }

  // If it's not a valid element, it's a MessageDescriptor.
  return intl.formatMessage(label as MessageDescriptor);
}
