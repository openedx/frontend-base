import { ComponentType, ReactNode, useCallback, useEffect, useState } from 'react';
import { useSlotContext, useSlotOperations } from '../hooks';
import { isSlotOperationConditionSatisfied } from '../utils';
import { LayoutComponentProps, LayoutElementProps, LayoutOperation } from './types';
import { isLayoutOperation, isLayoutOptionsOperation, isLayoutReplaceOperation } from './utils';

function hasLayoutComponentProps(operation: LayoutOperation): operation is (LayoutOperation & LayoutComponentProps) {
  return isLayoutOperation(operation) && 'component' in operation;
}

function hasLayoutElementProps(operation: LayoutOperation): operation is (LayoutOperation & LayoutElementProps) {
  return isLayoutOperation(operation) && 'element' in operation;
}

export function useLayoutForSlotId(id: string) {
  const operations = useSlotOperations(id);
  let layoutElement: ReactNode | ComponentType = null;

  for (const operation of operations) {
    if (isSlotOperationConditionSatisfied(operation)) {
      if (isLayoutReplaceOperation(operation)) {
        if (hasLayoutComponentProps(operation)) {
          layoutElement = operation.component;
        } else if (hasLayoutElementProps(operation)) {
          layoutElement = operation.element;
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
  const operations = useSlotOperations(id);

  const findOptions = useCallback(() => {
    let nextOptions: Record<string, unknown> = {};
    for (const operation of operations) {
      if (isSlotOperationConditionSatisfied(operation)) {
        if (isLayoutOptionsOperation(operation)) {
          nextOptions = { ...nextOptions, ...operation.options };
        }
      }
    }
    return nextOptions;
  }, [operations, id]);

  const [options, setOptions] = useState<Record<string, unknown>>(findOptions());

  useEffect(() => {
    const nextOptions = findOptions();
    setOptions(nextOptions);
  }, [operations, findOptions, id]);

  return options;
}
