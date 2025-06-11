import { useContext, useEffect, useState } from 'react';

import { APPS_CHANGED } from '../constants';
import { useAppEvent } from '../react';

import { SlotOperation } from './types';
import { getSlotOperations } from './utils';
import SlotContext from './SlotContext';

/**
 * The useSlotOperations hook will trigger re-renders when the slot configuration changes.
 * It is a fundamental hook that is used by many of the others to ensure they're using up-to-date
 * config as it changes.
 */
export function useSlotOperations(id: string) {
  const [operations, setOperations] = useState<SlotOperation[]>(getSlotOperations(id));
  useAppEvent(APPS_CHANGED, () => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  });

  useEffect(() => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  }, [id]);
  return operations;
}

export function useSlotContext() {
  return useContext(SlotContext);
}
