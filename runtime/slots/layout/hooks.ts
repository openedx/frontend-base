import { ComponentType, ReactNode, useMemo } from 'react';
import useActiveRoles from '../../react/hooks/useActiveRoles';
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
  const activeRoles = useActiveRoles();

  return useMemo<ReactNode | ComponentType>(() => {
    let layoutElement: ReactNode | ComponentType = null;
    for (const operation of operations) {
      if (isSlotOperationConditionSatisfied(operation, activeRoles) && isLayoutReplaceOperation(operation)) {
        if (hasLayoutComponentProps(operation)) {
          layoutElement = operation.component;
        } else if (hasLayoutElementProps(operation)) {
          layoutElement = operation.element;
        }
      }
    }
    return layoutElement;
  }, [operations, activeRoles]);
}

/**
 * useLayoutOptions iterates through the slot's operations to find any which are "layout
 * options" operations.  It merges these into a single object and returns them - operations are
 * merged in declaration order, meaning last one in wins.
 */
export function useLayoutOptions() {
  const { id } = useSlotContext();
  return useLayoutOptionsForId(id);
}

export function useLayoutOptionsForId(id: string) {
  const operations = useSlotOperations(id);
  const activeRoles = useActiveRoles();

  return useMemo(() => {
    let options: Record<string, unknown> = {};
    for (const operation of operations) {
      if (isSlotOperationConditionSatisfied(operation, activeRoles) && isLayoutOptionsOperation(operation)) {
        options = { ...options, ...operation.options };
      }
    }
    return options;
  }, [operations, activeRoles]);
}
