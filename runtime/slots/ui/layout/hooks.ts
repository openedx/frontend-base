import { ComponentType, ReactNode, useCallback, useEffect, useState } from 'react';
import { useOperations } from '../../hooks';
import { useSlotContext } from '../hooks';
import { isUiOperation, isUiOperationConditionSatisfied, isUiSlot } from '../utils';
import { LayoutComponentProps, LayoutElementProps, LayoutOperation } from './types';
import { isLayoutOperation, isLayoutOptionsOperation, isLayoutReplaceOperation } from './utils';

function hasLayoutComponentProps(operation: LayoutOperation): operation is (LayoutOperation & LayoutComponentProps) {
  return isLayoutOperation(operation) && 'component' in operation;
}

function hasLayoutElementProps(operation: LayoutOperation): operation is (LayoutOperation & LayoutElementProps) {
  return isLayoutOperation(operation) && 'element' in operation;
}

export function useLayoutForSlotId(id: string) {
  const operations = useOperations(id);
  let layoutElement: ReactNode | ComponentType = null;

  if (isUiSlot(id)) {
    for (const operation of operations) {
      if (isUiOperation(operation)) {
        if (isUiOperationConditionSatisfied(operation)) {
          if (isLayoutReplaceOperation(operation)) {
            if (hasLayoutComponentProps(operation)) {
              layoutElement = operation.component;
            } else if (hasLayoutElementProps(operation)) {
              layoutElement = operation.element;
            }
          }
        }
      }
    }
  }
  return layoutElement;
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
