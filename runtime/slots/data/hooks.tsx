import { ComponentType, useCallback, useContext, useEffect, useState } from 'react';

import { AUTHENTICATED_USER_CHANGED } from '../../auth';
import { APPS_CHANGED } from '../../constants';
import { useAppEvent } from '../../react';
import SlotContext from '../SlotContext';
import { SlotOperation, UiOperation } from '../types';
import WidgetContext from '../WidgetContext';
import { createWidgets, getSlotOperations, isLayoutOptionsOperation, isLayoutReplaceOperation, isSlotOperationConditionSatisfied, isUiOperation, isUiSlot, isWidgetOptionsOperation, sortUiOperations } from './utils';

export function useSlotContext() {
  return useContext(SlotContext);
}

/**
 * The useSlotOperations hook will trigger re-renders when the slot configuration changes.
 * It is a fundamental hook that is used by many of the others to ensure they're using up-to-date
 * config as it changes.
 */
export function useSlotOperations(id: string) {
  const [operations, setOperations] = useState<SlotOperation[]>([]);
  useAppEvent(APPS_CHANGED, () => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  });
  useAppEvent(AUTHENTICATED_USER_CHANGED, () => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  });
  useEffect(() => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  }, [id]);
  return operations;
}

export function useSlotWidgets() {
  const { id } = useSlotContext();
  return useSlotWidgetsById(id);
}

export function useSlotWidgetsById(id: string) {
  const operations = useSortedUiOperations(id);
  if (!isUiSlot(id)) {
    return [];
  }
  return createWidgets(operations);
}

export function useSortedUiOperations(id) {
  const operations = useSlotOperations(id);

  const [sortedOperations, setSortedOperations] = useState<UiOperation[]>(sortUiOperations(operations));

  useEffect(() => {
    const sortedActiveOperations = sortUiOperations(operations);
    setSortedOperations(sortedActiveOperations);
  }, [operations]);

  return sortedOperations;
}

/**
 * useLayoutOptions iterates through the slot's operations to find any which are "layout
 * options" operations.  It merges these into a single object and returns them - operations are
 * merged in declaration order, meaning last one in wins.  useLayoutOptions only triggers a
 * re-render when the options change.
 */
export function useLayoutOptions() {
  const { id } = useSlotContext();
  return useLayoutOptionsById(id);
}

export function useLayoutOptionsById(id: string) {
  const operations = useSlotOperations(id);

  const findOptions = useCallback(() => {
    let nextOptions: Record<string, any> = {};
    if (isUiSlot(id)) {
      for (const operation of operations) {
        if (isUiOperation(operation)) {
          if (isSlotOperationConditionSatisfied(operation)) {
            if (isLayoutOptionsOperation(operation)) {
              nextOptions = { ...nextOptions, ...operation.options };
            }
          }
        }
      }
    }
    return nextOptions;
  }, [operations, id]);

  const [options, setOptions] = useState<Record<string, any>>(findOptions());

  useEffect(() => {
    const nextOptions = findOptions();
    setOptions(nextOptions);
  }, [operations, findOptions, id]);

  return options;
}

/**
 * useWidgetOptions iterates through the slot's operations to find any that are "widget options"
 * operations specific to this widget.  It merges these into a single object and returns them -
 * operations are merged in declaration order, meaning last one in wins.  useWidgetOptions only
 * triggers a re-render when the options change.
 */
export function useWidgetOptions() {
  const { slotId, widgetId } = useContext(WidgetContext);
  return useWidgetOptionsById(slotId, widgetId);
}

export function useWidgetOptionsById(slotId: string, widgetId: string) {
  const operations = useSlotOperations(slotId);

  const findOptions = useCallback(() => {
    let nextOptions: Record<string, any> = {};
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
  }, [operations, widgetId]);

  const [options, setOptions] = useState<Record<string, any>>(findOptions());

  useEffect(() => {
    const nextOptions = findOptions();
    setOptions(nextOptions);
  }, [operations, findOptions]);

  return options;
}

export function useSlotLayout(defaultLayout: ComponentType) {
  const { id } = useSlotContext();
  return useSlotLayoutById(id, defaultLayout);
}

export function useSlotLayoutById(id: string, defaultLayout: ComponentType) {
  const operations = useSlotOperations(id);
  let layout: ComponentType | null = defaultLayout;
  if (isUiSlot(id)) {
    for (const operation of operations) {
      if (isUiOperation(operation)) {
        if (isSlotOperationConditionSatisfied(operation)) {
          if (isLayoutReplaceOperation(operation)) {
            layout = operation.layout;
          }
        }
      }
    }
  }
  return layout;
}
