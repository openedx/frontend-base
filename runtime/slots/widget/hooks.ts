import { useContext, useMemo } from 'react';
import useActiveRoles from '../../react/hooks/useActiveRoles';
import { useSlotContext, useSlotOperations } from '../hooks';
import { isSlotOperationConditionSatisfied } from '../utils';
import { WidgetList, WidgetOperation } from './types';
import { createWidgets, isWidgetAbsoluteOperation, isWidgetOperation, isWidgetOptionsOperation, isWidgetRelativeOperation } from './utils';
import WidgetContext from './WidgetContext';

export function useWidgets(): WidgetList {
  const { id, ...props } = useSlotContext();
  delete props.children;
  return useWidgetsForId(id, props);
}

export function useWidgetsForId(id: string, componentProps?: Record<string, unknown>): WidgetList {
  const operations = useSortedWidgetOperations(id);
  return createWidgets(operations, componentProps);
}

export function useWidgetOperations(id: string) {
  const operations = useSlotOperations(id);
  const activeRoles = useActiveRoles();

  return useMemo(
    () => operations.filter((operation): operation is WidgetOperation => (
      isWidgetOperation(operation) && isSlotOperationConditionSatisfied(operation, activeRoles)
    )),
    [operations, activeRoles],
  );
}

export function useSortedWidgetOperations(id: string) {
  const operations = useWidgetOperations(id);

  return useMemo(() => (
    // This sorts widget operations in an order that guarantees that any 'related' widgets
    // needed by relatively positioned operations (INSERT_AFTER, INSERT_BEFORE) should already exist
    // by the time the relative operations are evaluated.  It means the declaration order of
    // operations in SiteConfig does not prevent an operation from interacting with a widget that was
    // declared 'later'.
    [...operations].sort((a: WidgetOperation, b: WidgetOperation) => {
      const aAbsolute = isWidgetAbsoluteOperation(a);
      const bAbsolute = isWidgetAbsoluteOperation(b);
      if (aAbsolute && bAbsolute) {
        return 0;
      } else if (aAbsolute) {
        return -1;
      } else if (bAbsolute) {
        return 1;
      } else if (isWidgetRelativeOperation(a) && isWidgetRelativeOperation(b)) {
        if (a.id === b.relatedId) {
          return -1;
        } else if (b.id === a.relatedId) {
          return 1;
        }
      }
      return 0;
    })
  ), [operations]);
}

/**
 * useWidgetOptions iterates through the slot's operations to find any that are "widget options"
 * operations specific to this widget.  It merges these into a single object and returns them -
 * operations are merged in declaration order, meaning last one in wins.
 */
export function useWidgetOptions() {
  const { slotId, widgetId } = useContext(WidgetContext);
  return useWidgetOptionsForId(slotId, widgetId);
}

export function useWidgetOptionsForId(slotId: string, widgetId: string) {
  const operations = useWidgetOperations(slotId);

  return useMemo(() => {
    let options: Record<string, unknown> = {};
    for (const operation of operations) {
      if (isWidgetOptionsOperation(operation) && operation.relatedId === widgetId) {
        options = { ...options, ...operation.options };
      }
    }
    return options;
  }, [widgetId, operations]);
}
