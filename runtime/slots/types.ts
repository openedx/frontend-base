import { ReactNode } from 'react';

// UI Slots

export interface SlotCondition {
  active?: string,
  inactive?: string,
  authenticated?: boolean,
}

// Operation Types

export enum LayoutOperationTypes {
  OPTIONS = 'options',
  LAYOUT = 'layout',
}

export enum WidgetOperationTypes {
  APPEND = 'append',
  PREPEND = 'prepend',
  INSERT_AFTER = 'insertAfter',
  INSERT_BEFORE = 'insertBefore',
  REPLACE = 'replace',
  REMOVE = 'remove',
}

export type AbsoluteWidgetOperationTypes = WidgetOperationTypes.APPEND | WidgetOperationTypes.PREPEND;

export type RelativeWidgetOperationTypes = WidgetOperationTypes.INSERT_AFTER | WidgetOperationTypes.INSERT_BEFORE | WidgetOperationTypes.REPLACE;

// UI slot operations

export interface BaseUiOperation {
  slotId: `${string}.ui`,
  id: string,
  role?: string,
  condition?: SlotCondition,
}

export interface ComponentOperation extends BaseUiOperation {
  op: AbsoluteWidgetOperationTypes,
  component: React.ComponentType,
}

export interface RelativeComponentOperation extends BaseUiOperation {
  op: RelativeWidgetOperationTypes,
  component: React.ComponentType,
  relatedId: string,
}

export interface LayoutOptionsOperation extends BaseUiOperation {
  op: LayoutOperationTypes.OPTIONS,
  options?: Record<string, any>,
}

export interface ElementOperation extends BaseUiOperation {
  op: AbsoluteWidgetOperationTypes,
  element: ReactNode,
}

export interface RelativeElementOperation extends BaseUiOperation {
  op: RelativeWidgetOperationTypes,
  element: ReactNode,
  relatedId: string,
}

export interface IFrameOperation extends BaseUiOperation {
  op: AbsoluteWidgetOperationTypes,
  url: string,
  title: string,
}

export interface RelativeIFrameOperation extends BaseUiOperation {
  op: RelativeWidgetOperationTypes,
  url: string,
  title: string,
  relatedId: string,
}

export interface FederatedOperation extends BaseUiOperation {
  op: AbsoluteWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
}

export interface RelativeFederatedOperation extends BaseUiOperation {
  op: RelativeWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
  relatedId: string,
}

export interface RemoveOperation extends BaseUiOperation {
  op: WidgetOperationTypes.REMOVE,
  relatedId: string,
}

export interface ReplaceLayoutOperation extends BaseUiOperation {
  op: LayoutOperationTypes.LAYOUT,
  layout: React.ComponentType,
}

export type AbsoluteWidgetOperation = ComponentOperation | ElementOperation | IFrameOperation | FederatedOperation;

export type RelativeWidgetOperation = RelativeComponentOperation | RelativeElementOperation | RelativeIFrameOperation | RelativeFederatedOperation | RemoveOperation;

export type LayoutOperations = LayoutOptionsOperation | ReplaceLayoutOperation;

export type UiOperation = AbsoluteWidgetOperation | RelativeWidgetOperation | LayoutOperations;

export type SlotOperation = UiOperation;
