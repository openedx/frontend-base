import { SlotOperation } from '../types';
import { LayoutOperation, LayoutOperationTypes, LayoutOptionsOperation, LayoutReplaceOperation } from './types';

export function isLayoutOperation(operation: SlotOperation): operation is LayoutOperation {
  return Object.values(LayoutOperationTypes).includes(operation.op as LayoutOperationTypes);
}

export function isLayoutOptionsOperation(operation: SlotOperation): operation is LayoutOptionsOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.OPTIONS;
}

export function isLayoutReplaceOperation(operation: SlotOperation): operation is LayoutReplaceOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.REPLACE;
}
