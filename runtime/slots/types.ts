/**
 * Base Slot Operations
 *
 * These are properties shared by all slot operations defined below.
 */

import { LayoutOperation } from './layout/types';
import { WidgetOperation } from './widget/types';

export interface SlotOperationCondition {
  active?: string[],
  inactive?: string[],
  authenticated?: boolean,
  callback?: () => boolean,
}

export interface BaseSlotOperation {
  slotId: string,
  condition?: SlotOperationCondition,
}

// Aggregate Slot Operations

export type SlotOperation = WidgetOperation | LayoutOperation;
