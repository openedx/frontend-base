import { ComponentOperation, ElementOperation, LayoutOperation, OptionsOperation, SlotOperation, WidgetOperation } from '../../types';
import { getAuthenticatedUser } from '../auth';
import { getConfig } from '../config';

export function getSlotOperations(id: string) {
  const { apps } = getConfig();
  const ops: SlotOperation[] = [];
  apps.forEach((app) => {
    if (Array.isArray(app.slots)) {
      app.slots.forEach((operation) => {
        // TODO: Absorb the slot operation types here and do the right thing when building the array.
        if (operation.slotId === id) {
          ops.push(operation);
        }
      });
    }
  });
  return ops;
}

export function isOperationConditionSatisfied(operation: SlotOperation) {
  const { condition } = operation;
  if (condition?.authenticated !== undefined) {
    const isAuthenticated = getAuthenticatedUser() !== null;
    if (condition.authenticated && isAuthenticated) {
      return true;
    }
    if (!condition.authenticated && !isAuthenticated) {
      return true;
    }
    // If the authenticated condition existed but we didn't satisfy it, return false.
    return false;
  }

  // If there was no condition, we return true.
  return true;
}

// Widget Slots

export function isWidgetSlot(id: string) {
  return id.endsWith('.widget');
}

export function isWidgetOperation(operation: SlotOperation): operation is WidgetOperation {
  return operation.slotId.endsWith('.widget');
}

export function isComponentOperation(operation: WidgetOperation): operation is ComponentOperation {
  return isWidgetOperation(operation) && 'component' in operation;
}

export function isElementOperation(operation: WidgetOperation): operation is ElementOperation {
  return isWidgetOperation(operation) && 'element' in operation;
}

export function isOptionsOperation(operation: WidgetOperation): operation is OptionsOperation {
  return isWidgetOperation(operation) && 'options' in operation;
}

export function isReplaceOperation(operation: WidgetOperation): operation is LayoutOperation {
  return isWidgetOperation(operation) && 'layout' in operation;
}
