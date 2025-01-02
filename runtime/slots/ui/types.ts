/**
 * Base UI Operations
 *
 * These are properties shared by all UI operations defined below.
 */

import { LayoutOperation } from './layout/types';
import { WidgetOperation } from './widget/types';

export interface UiOperationCondition {
  active?: string,
  inactive?: string,
  authenticated?: boolean,
}

export interface BaseUiOperation {
  slotId: `${string}.ui`,
  condition?: UiOperationCondition,
}

// Aggregate UI Operations

export type UiOperation = WidgetOperation | LayoutOperation;
