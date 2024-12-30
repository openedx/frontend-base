import { ReactNode } from 'react';

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

// Widget slot operations

export interface BaseWidgetOperation {
  slotId: `${string}.ui`,
  id: string,
  role?: string,
  condition?: SlotCondition,
}

// Operations

export interface ComponentOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  component: React.ComponentType,
}

export interface RelativeComponentOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  component: React.ComponentType,
  relatedId: string,
}

export interface LayoutOptionsOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.OPTIONS,
  options?: Record<string, any>,
}

export interface ElementOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  element: ReactNode,
}

export interface RelativeElementOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  element: ReactNode,
  relatedId: string,
}

export interface IFrameOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  url: string,
  title: string,
}

export interface RelativeIFrameOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  url: string,
  title: string,
  relatedId: string,
}

export interface FederatedOperation extends BaseWidgetOperation {
  op: AbsoluteWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
}

export interface RelativeFederatedOperation extends BaseWidgetOperation {
  op: RelativeWidgetOperationTypes,
  remoteId: string,
  moduleId: string,
  relatedId: string,
}

export interface RemoveOperation extends BaseWidgetOperation {
  op: WidgetOperationTypes.REMOVE,
  relatedId: string,
}

export interface ReplaceLayoutOperation extends BaseWidgetOperation {
  op: LayoutOperationTypes.LAYOUT,
  layout: React.ComponentType,
}

export type AbsoluteWidgetOperations = ComponentOperation | ElementOperation | IFrameOperation | FederatedOperation;

export type RelativeWidgetOperations = RelativeComponentOperation | RelativeElementOperation | RelativeIFrameOperation | RelativeFederatedOperation | RemoveOperation;

export type LayoutOperations = LayoutOptionsOperation | ReplaceLayoutOperation;

export type WidgetOperation = AbsoluteWidgetOperations | RelativeWidgetOperations | LayoutOperations;

export type SlotOperation = WidgetOperation;
