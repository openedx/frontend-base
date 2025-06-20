import { useContext, useEffect, useState } from 'react';
import { useSlotContext, useSlotOperations } from '../hooks';
import { isSlotOperationConditionSatisfied } from '../utils';
import { WidgetOperation } from './types';
import { createWidgets, isWidgetAbsoluteOperation, isWidgetOperation, isWidgetOptionsOperation, isWidgetRelativeOperation } from './utils';
import WidgetContext from './WidgetContext';

export function useWidgets() {
  const { id, ...props } = useSlotContext();
  delete props.children;
  return useWidgetsForId(id, props);
}

export function useWidgetsForId(id: string, componentProps?: Record<string, unknown>) {
  const operations = useSortedWidgetOperations(id);
  return createWidgets(operations, componentProps);
}

export function useWidgetOperations(id: string) {
  const operations = useSlotOperations(id);
  const [widgetOperations, setWidgetOperations] = useState<WidgetOperation[]>([]);

  useEffect(() => {
    const filteredOperations = operations.filter((operation): operation is WidgetOperation => {
      return isWidgetOperation(operation) && isSlotOperationConditionSatisfied(operation);
    });

    setWidgetOperations(filteredOperations);
  }, [operations]);

  return widgetOperations;
}

export function useSortedWidgetOperations(id: string) {
  const operations = useWidgetOperations(id);
  const [sortedOperations, setSortedOperations] = useState<WidgetOperation[]>([]);

  useEffect(() => {
    // This sorts widget operations in an order that guarantees that any 'related' widgets
    // needed by relatively positioned operations (INSERT_AFTER, INSERT_BEFORE) should already exist
    // by the time the relative operations are evaluated.  It means the declaration order of
    // operations in SiteConfig does not prevent an operation from interacting with a widget that was
    // declared 'later'.
    const sortedOperations = operations.sort((a: WidgetOperation, b: WidgetOperation) => {
      // If both operations are widget operations, there are special sorting rules.
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
    });

    setSortedOperations(sortedOperations);
  }, [operations]);

  return sortedOperations;
}

/**
 * useWidgetOptions iterates through the slot's operations to find any that are "widget options"
 * operations specific to this widget.  It merges these into a single object and returns them -
 * operations are merged in declaration order, meaning last one in wins.  useWidgetOptions only
 * triggers a re-render when the options change.
 */
export function useWidgetOptions() {
  const { slotId, widgetId } = useContext(WidgetContext);
  return useWidgetOptionsForId(slotId, widgetId);
}

export function useWidgetOptionsForId(slotId: string, widgetId: string) {
  const operations = useWidgetOperations(slotId);

  const [options, setOptions] = useState<Record<string, unknown>>({});
  useEffect(() => {
    const findOptions = () => {
      let nextOptions: Record<string, unknown> = {};
      for (const operation of operations) {
        if (isSlotOperationConditionSatisfied(operation)) {
          if (isWidgetOptionsOperation(operation)) {
            if (operation.relatedId === widgetId) {
              nextOptions = { ...nextOptions, ...operation.options };
            }
          }
        }
      }
      return nextOptions;
    };

    setOptions(findOptions());
  }, [widgetId, operations]);

  return options;
}
