import { getAuthenticatedUser } from '../../auth';
import { SlotOperation } from '../types';
import { UiOperation } from './types';

export function isUiOperationConditionSatisfied(operation: UiOperation) {
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

export function isUiSlot(id: string) {
  return id.endsWith('.ui');
}

export function isUiOperation(operation: SlotOperation): operation is UiOperation {
  return operation.slotId.endsWith('.ui');
}
