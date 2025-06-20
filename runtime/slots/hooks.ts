import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { SlotOperation } from './types';
import { getSlotOperations } from './utils';
import SlotContext from './SlotContext';
import { createWidgetAppendOperation } from './widget';

/**
 * The useSlotOperations hook will trigger re-renders when the slot configuration changes.
 * It is a fundamental hook that is used by many of the others to ensure they're using up-to-date
 * config as it changes.
 */
export function useSlotOperations(id: string) {
  const { children } = useSlotContext();
  const location = useLocation();
  const [operations, setOperations] = useState<SlotOperation[]>([]);

  useEffect(() => {
    // Setting default content has to happen inside `useEffect()` so that re-renders only happen
    // when [children] props change.  This avoids an endless render loop.  After all, the whole
    // point of a slot is to modify its children via slot operations.
    const defaultOperation = createWidgetAppendOperation('defaultContent', id, children);
    setOperations(getSlotOperations(id, defaultOperation));

    // We depend on [location] to force re-renders on navigation.  This guarantees changes in active
    // roles (and thus, changes in what conditional widgets are shown) properly.
  }, [id, children, location]);

  return operations;
}

export function useSlotContext() {
  return useContext(SlotContext);
}
