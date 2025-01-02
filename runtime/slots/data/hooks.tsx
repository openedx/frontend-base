import { ComponentType, useContext, useEffect, useState } from 'react';

import { AUTHENTICATED_USER_CHANGED } from '../../auth';
import { APPS_CHANGED } from '../../constants';
import { useAppEvent } from '../../react';
import SlotContext from '../SlotContext';
import { SlotOperation, UiOperation } from '../types';
import { createWidgets, getSlotOperations, isOptionsOperation, isReplaceOperation, isSlotOperationConditionSatisfied, isUiSlot, isUiOperation, sortWidgetOperations } from './utils';

export function useSlotContext() {
  return useContext(SlotContext);
}

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
  const operations = useSortedWidgetOperations(id);
  if (!isUiSlot(id)) {
    return [];
  }
  return createWidgets(operations);
}

export function useSortedWidgetOperations(id) {
  const operations = useSlotOperations(id);

  const [sortedOperations, setSortedOperations] = useState<UiOperation[]>(sortWidgetOperations(operations));

  useEffect(() => {
    const sortedActiveOperations = sortWidgetOperations(operations);
    setSortedOperations(sortedActiveOperations);
  }, [operations]);

  return sortedOperations;
}

export function useSlotOptions() {
  const { id } = useSlotContext();
  return useSlotOptionsById(id);
}

export function useSlotOptionsById(id: string) {
  const operations = useSlotOperations(id);
  let options: Record<string, any> = {};

  if (isUiSlot(id)) {
    for (const operation of operations) {
      if (isUiOperation(operation)) {
        if (isSlotOperationConditionSatisfied(operation)) {
          if (isOptionsOperation(operation)) {
            options = { ...options, ...operation.options };
          }
        }
      }
    }
  }
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
          if (isReplaceOperation(operation)) {
            layout = operation.layout;
          }
        }
      }
    }
  }
  return layout;
}
