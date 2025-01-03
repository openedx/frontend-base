import { UiOperation } from '../types';
import { isUiOperation } from '../utils';
import { LayoutOperation, LayoutOperationTypes, LayoutOptionsOperation, LayoutReplaceOperation } from './types';

export function isLayoutOperation(operation: UiOperation): operation is LayoutOperation {
  return isUiOperation(operation) && Object.values(LayoutOperationTypes).includes(operation.op as LayoutOperationTypes);
}

export function isLayoutOptionsOperation(operation: UiOperation): operation is LayoutOptionsOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.OPTIONS;
}

export function isLayoutReplaceOperation(operation: UiOperation): operation is LayoutReplaceOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.REPLACE;
}
