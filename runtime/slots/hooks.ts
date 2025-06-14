import { useContext, useEffect, useState } from 'react';

import { APPS_CHANGED } from '../constants';
import { useAppEvent } from '../react';

import { WidgetOperation, WidgetOperationTypes } from './widget';
import { SlotOperation } from './types';
import { getSlotOperations } from './utils';
import SlotContext from './SlotContext';

/**
 * The useSlotOperations hook will trigger re-renders when the slot configuration changes.
 * It is a fundamental hook that is used by many of the others to ensure they're using up-to-date
 * config as it changes.
 */
export function useSlotOperations(id: string) {
  const { children } = useSlotContext();
  let defaultOperation: WidgetOperation | undefined = undefined;
  if (children) {
    defaultOperation = {
      slotId: id,
      id: `defaultContent`,
      op: WidgetOperationTypes.APPEND,
      element: children
    };
  }

  const [operations, setOperations] = useState<SlotOperation[]>(getSlotOperations(id, defaultOperation));
  useAppEvent(APPS_CHANGED, () => {
    const ops = getSlotOperations(id, defaultOperation);
    setOperations(ops);
  });

  useEffect(() => {
    const ops = getSlotOperations(id, defaultOperation);
    setOperations(ops);
  }, [id, defaultOperation]);
  return operations;
}

export function useSlotContext() {
  return useContext(SlotContext);
}
