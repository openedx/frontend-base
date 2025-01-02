import { ReactNode } from 'react';

/**
 * Base UI Operations
 *
 * These are properties shared by all UI operations defined below.
 */

export interface SlotCondition {
  active?: string,
  inactive?: string,
  authenticated?: boolean,
}

export interface BaseUiOperation {
  slotId: `${string}.ui`,
  condition?: SlotCondition,
}

/**
 * Base UI Widget Operations
 *
 * "Widget" operations are a sub-type of UI operations which allow manipulation of the list of widgets (UI components) loaded into the slot.  Widget operations are divided further into two sub-types: absolute and relative.
 *
 * Absolute widget operations allow simple list operations like appending and prepending which don't depend on any other list elements.
 *
 * Relative widget operations depend on a relationship to some other list element, such as "insert before" and "insert after".  Some affect those elements, some add something to the list near them.
 */

export enum WidgetOperationTypes {
  /**
   * Adds a widget to the end of the slot's list of widgets.
   */
  APPEND = 'append',

  /**
   * Adds a widget to the beginning of the slot's list of widgets.
   */
  PREPEND = 'prepend',

  /**
   * Adds a widget after the specified widget ID.  Multiple "insert after" operations on the same widget ID occur in the order they were declared.
   */
  INSERT_AFTER = 'insertAfter',

  /**
   * Adds a widget before the specified widget ID.  Multiple "insert after" operations on the same widget ID occur in the order they were declared.
   */
  INSERT_BEFORE = 'insertBefore',

  /**
   * Removes the specified widget ID and adds a widget in its place.  Multiple "replace" operations on the same widget ID occur in the order they were declared, and only the first will succeed unless the new widget's ID is the same as the one that was removed.
   */
  REPLACE = 'replace',

  /**
   * Removes the specified widget ID from the slot's list of widgets.  Subsequent relative widget operations on that widget ID will not be applied.
   */
  REMOVE = 'remove',

  /**
   * Provides options to the specified widget ID.  Multiple "options" operations on the same widget ID will merge with and override any duplicate properties in the options object - last one in wins.
   */
  OPTIONS = 'widgetOptions',
}

export type AbsoluteWidgetOperationTypes = WidgetOperationTypes.APPEND | WidgetOperationTypes.PREPEND;

export type RelativeWidgetOperationTypes = WidgetOperationTypes.INSERT_AFTER | WidgetOperationTypes.INSERT_BEFORE | WidgetOperationTypes.REPLACE | WidgetOperationTypes.OPTIONS;

export interface BaseWidgetOperation extends BaseUiOperation {
  op: WidgetOperationTypes,
}

/**
 * Base UI Layout Operations
 *
 * "Layout" operations are a sub-type of UI operations which affect the layout component of a UI
 * slot.  They have no effect on the widgets loaded into a UI slot.
 */

export enum LayoutOperationTypes {
  OPTIONS = 'layoutOptions',
  LAYOUT = 'layout',
}

export interface BaseLayoutOperation extends BaseUiOperation {
  op: LayoutOperationTypes,
}

// Widget renderer props

export interface WidgetComponentProps {
  component: React.ComponentType,
}

export interface WidgetElementProps {
  element: ReactNode,
}

export interface WidgetFederatedProps {
  remoteId: string,
  moduleId: string,
}

export interface WidgetIFrameProps {
  url: string,
  title: string,
}

export type WidgetRendererProps = (
  WidgetComponentProps | WidgetElementProps | WidgetFederatedProps | WidgetIFrameProps
);

export interface WidgetIdentityProps {
  id: string,
  role?: string,
}

export interface WidgetRelationshipProps {
  relatedId: string,
}

// Concrete UI Widget Operations

export type WidgetAppendOperation = BaseWidgetOperation & WidgetIdentityProps & WidgetRendererProps & {
  op: WidgetOperationTypes.APPEND,
};

export type WidgetPrependOperation = BaseWidgetOperation & WidgetIdentityProps & WidgetRendererProps & {
  op: WidgetOperationTypes.PREPEND,
};

export type WidgetInsertAfterOperation = BaseWidgetOperation & WidgetIdentityProps & WidgetRendererProps & WidgetRelationshipProps & {
  op: WidgetOperationTypes.INSERT_AFTER,
};

export type WidgetInsertBeforeOperation = BaseWidgetOperation & WidgetIdentityProps & WidgetRendererProps & WidgetRelationshipProps & {
  op: WidgetOperationTypes.INSERT_BEFORE,
};

export type WidgetRemoveOperation = BaseWidgetOperation & WidgetRelationshipProps & {
  op: WidgetOperationTypes.REMOVE,
};

export type WidgetOptionsOperation = BaseWidgetOperation & WidgetRelationshipProps & {
  op: WidgetOperationTypes.OPTIONS,
  options: Record<string, any>,
};

export type WidgetReplaceOperation = BaseWidgetOperation & WidgetIdentityProps & WidgetRendererProps & WidgetRelationshipProps & { op: WidgetOperationTypes.REPLACE };

export type WidgetAbsoluteOperation = WidgetAppendOperation | WidgetPrependOperation;

export type WidgetRelativeRendererOperation = WidgetInsertAfterOperation | WidgetInsertBeforeOperation | WidgetReplaceOperation;

export type WidgetRelativeOperation = WidgetRelativeRendererOperation | WidgetRemoveOperation | WidgetOptionsOperation;

export type WidgetRendererOperation = WidgetAbsoluteOperation | WidgetRelativeRendererOperation;

export type WidgetOperation = WidgetAbsoluteOperation | WidgetRelativeOperation;

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

// Aggregate UI Operations

export type UiOperation = WidgetOperation | LayoutOperation;

// Aggregate Operations

export type SlotOperation = UiOperation;
