import { getAuthenticatedUser } from '../../auth';
import { getActiveRoles } from '../../config';
import { SlotOperation } from '../types';
import { UiOperation } from './types';

export function isUiOperationConditionSatisfied(operation: UiOperation) {
  const { condition } = operation;
  if (condition?.authenticated !== undefined) {
    const isAuthenticated = getAuthenticatedUser() !== null;
    // If we failed the authenticated condition, return false.
    if (condition.authenticated !== isAuthenticated) {
      return false;
    }
  }

  if (condition?.active !== undefined) {
    let activeConditionRoleFound = false;
    const activeRoles: string[] = getActiveRoles();
    for (const conditionRole of condition.active) {
      if (activeRoles.includes(conditionRole)) {
        activeConditionRoleFound = true;
        break;
      }
    }
    // If we couldn't find an active role in our list, then we've failed this condition.
    if (!activeConditionRoleFound) {
      return false;
    }
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
