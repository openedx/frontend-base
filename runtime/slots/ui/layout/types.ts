/**
 * Base UI Layout Operations
 *
 * "Layout" operations are a sub-type of UI operations which affect the layout component of a UI
 * slot.  They have no effect on the widgets loaded into a UI slot.
 */

import { BaseUiOperation } from '../types';

export enum LayoutOperationTypes {
  OPTIONS = 'layoutOptions',
  LAYOUT = 'layout',
}

export interface BaseLayoutOperation extends BaseUiOperation {
  op: LayoutOperationTypes,
}

// Concrete UI Layout Operations

export type LayoutOptionsOperation = BaseLayoutOperation & {
  op: LayoutOperationTypes.OPTIONS,
  options: Record<string, any>,
};

export type ReplaceLayoutOperation = BaseLayoutOperation & {
  op: LayoutOperationTypes.LAYOUT,
  layout: React.ComponentType,
};

// Aggregate UI Layout Operations

export type LayoutOperation = LayoutOptionsOperation | ReplaceLayoutOperation;
