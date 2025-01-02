/**
 * Base UI Layout Operations
 *
 * "Layout" operations are a sub-type of UI operations which affect the layout component of a UI
 * slot.  They have no effect on the widgets loaded into a UI slot.
 */

import { ReactNode } from 'react';
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

export interface LayoutComponentProps {
  component: React.ComponentType,
}

export interface LayoutElementProps {
  element: ReactNode,
}

export type LayoutRendererProps = (
  LayoutComponentProps | LayoutElementProps
);

export type ReplaceLayoutOperation = BaseLayoutOperation & LayoutRendererProps & {
  op: LayoutOperationTypes.LAYOUT,
};

// Aggregate UI Layout Operations

export type LayoutOperation = LayoutOptionsOperation | ReplaceLayoutOperation;
