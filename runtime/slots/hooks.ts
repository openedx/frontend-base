import { useContext, useMemo } from 'react';

import { getSlotOperations } from './utils';
import SlotContext from './SlotContext';
import { createWidgetAppendOperation } from './widget';

/**
 * Resolves the operations registered for a given slot id (plus any aliases),
 * prepended with a default-content operation built from the slot's children.
 *
 * Children and aliases come from the enclosing slot, so they only apply when
 * that slot is the one being asked for.  Read from outside, a slot has neither.
 */
export function useSlotOperations(id: string) {
  const slotContext = useSlotContext();
  const isEnclosingSlot = slotContext.id === id;
  const children = isEnclosingSlot ? slotContext.children : undefined;
  const idAliases = isEnclosingSlot ? slotContext.idAliases : undefined;

  return useMemo(() => {
    const defaultOperation = createWidgetAppendOperation('defaultContent', id, children);
    return getSlotOperations([id, ...(idAliases ?? [])], defaultOperation);
  }, [id, children, idAliases]);
}

export function useSlotContext() {
  return useContext(SlotContext);
}
