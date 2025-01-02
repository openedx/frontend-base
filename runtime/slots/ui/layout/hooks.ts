import { ComponentType, useCallback, useEffect, useState } from 'react';
import { useOperations } from '../../hooks';
import { useSlotContext } from '../hooks';
import { isUiOperation, isUiOperationConditionSatisfied, isUiSlot } from '../utils';
import { isLayoutOptionsOperation, isLayoutReplaceOperation } from './utils';

export function useLayoutForSlotId(id: string, defaultLayout: ComponentType) {
  const operations = useOperations(id);
  let layout: ComponentType | null = defaultLayout;
  if (isUiSlot(id)) {
    for (const operation of operations) {
      if (isUiOperation(operation)) {
        if (isUiOperationConditionSatisfied(operation)) {
          if (isLayoutReplaceOperation(operation)) {
            layout = operation.layout;
          }
        }
      }
    }
  }
  return layout;
}

/**
 * useLayoutOptions iterates through the slot's operations to find any which are "layout
 * options" operations.  It merges these into a single object and returns them - operations are
 * merged in declaration order, meaning last one in wins.  useLayoutOptions only triggers a
 * re-render when the options change.
 */
export function useLayoutOptions() {
  const { id } = useSlotContext();
  return useLayoutOptionsForId(id);
}

export function useLayoutOptionsForId(id: string) {
  const operations = useOperations(id);

  const findOptions = useCallback(() => {
    let nextOptions: Record<string, any> = {};
    if (isUiSlot(id)) {
      for (const operation of operations) {
        if (isUiOperation(operation)) {
          if (isUiOperationConditionSatisfied(operation)) {
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
