import { useContext, useMemo } from 'react';

import { getSlotOperations } from './utils';
import SlotContext from './SlotContext';
import { createWidgetAppendOperation } from './widget';

/**
 * Resolves the operations registered for a given slot id (plus any aliases),
 * prepended with a default-content operation built from the slot's children.
 */
export function useSlotOperations(id: string) {
  const { children, idAliases } = useSlotContext();

  return useMemo(() => {
    const defaultOperation = createWidgetAppendOperation('defaultContent', id, children);
    return getSlotOperations([id, ...(idAliases ?? [])], defaultOperation);
  }, [id, children, idAliases]);
}

export function useSlotContext() {
  return useContext(SlotContext);
}
