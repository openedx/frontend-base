import { useContext, useEffect, useMemo, useState } from 'react';

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

  // We have to memo on [children] so that re-renders only happen when their
  // props change.  This avoids an endless render loop.  (After all, the whole
  // point of a slot is to modify its children via slot operations.)
  const defaultOperation = useMemo(() => {
    return createWidgetAppendOperation('defaultContent', id, children);
  }, [id, children]);

  const [operations, setOperations] = useState<SlotOperation[]>(getSlotOperations(id, defaultOperation));
  useEffect(() => {
    const ops = getSlotOperations(id, defaultOperation);
    setOperations(ops);
  }, [id, defaultOperation]);

  return operations;
}

export function useSlotContext() {
  return useContext(SlotContext);
}
