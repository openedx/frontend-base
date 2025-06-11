import { ReactNode } from 'react';
import { SlotOperation } from '../types';
import { isSlotOperationConditionSatisfied } from '../utils';
import { IFrameWidget } from './iframe';
import { IdentifiedWidget, WidgetAbsoluteOperation, WidgetAppendOperation, WidgetComponentProps, WidgetElementProps, WidgetIdentityProps, WidgetIFrameProps, WidgetInsertAfterOperation, WidgetInsertBeforeOperation, WidgetOperation, WidgetOperationTypes, WidgetOptionsOperation, WidgetPrependOperation, WidgetRemoveOperation, WidgetRendererOperation, WidgetRendererProps, WidgetReplaceOperation } from './types';
import WidgetProvider from './WidgetProvider';

export function isWidgetOperation(operation: SlotOperation): operation is WidgetOperation {
  return Object.values(WidgetOperationTypes).includes(operation.op as WidgetOperationTypes);
}

export function isWidgetAbsoluteOperation(operation: WidgetOperation): operation is WidgetAbsoluteOperation {
  return operation.op === WidgetOperationTypes.APPEND || operation.op === WidgetOperationTypes.PREPEND;
}

export function isWidgetRelativeOperation(operation: WidgetOperation): operation is (WidgetInsertAfterOperation | WidgetInsertBeforeOperation) {
  return operation.op === WidgetOperationTypes.INSERT_AFTER || operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function isWidgetAppendOperation(operation: SlotOperation): operation is WidgetAppendOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.APPEND;
}

export function isWidgetInsertAfterOperation(operation: SlotOperation): operation is WidgetInsertAfterOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.INSERT_AFTER;
}

export function isWidgetInsertBeforeOperation(operation: SlotOperation): operation is WidgetInsertBeforeOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function isWidgetPrependOperation(operation: SlotOperation): operation is WidgetPrependOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.PREPEND;
}

export function isWidgetRemoveOperation(operation: SlotOperation): operation is WidgetRemoveOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.REMOVE;
}

export function isWidgetReplaceOperation(operation: SlotOperation): operation is WidgetReplaceOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.REPLACE;
}

export function isWidgetOptionsOperation(operation: SlotOperation): operation is WidgetOptionsOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.OPTIONS;
}

export function isWidgetRendererOperation(operation: SlotOperation): operation is WidgetRendererOperation {
  return isWidgetOperation(operation) && hasWidgetRendererProps(operation);
}

export function isWidgetIdentityOperation(operation: SlotOperation): operation is (WidgetOperation & WidgetIdentityProps) {
  return isWidgetOperation(operation) && hasWidgetIdentityProps(operation);
}

export function isWidgetIdentityRoleOperation(operation: SlotOperation): operation is (WidgetOperation & WidgetIdentityProps & { role: string }) {
  return isWidgetIdentityOperation(operation) && hasWidgetIdentityRoleProps(operation);
}

// Widget Operation props helpers

function hasWidgetComponentProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetComponentProps) {
  return isWidgetOperation(operation) && 'component' in operation;
}

function hasWidgetElementProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetElementProps) {
  return isWidgetOperation(operation) && 'element' in operation;
}

function hasWidgetIFrameProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIFrameProps) {
  return isWidgetOperation(operation) && 'url' in operation && 'title' in operation;
}

function hasWidgetRendererProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetRendererProps) {
  return hasWidgetComponentProps(operation) || hasWidgetElementProps(operation) || hasWidgetIFrameProps(operation);
}

function hasWidgetIdentityProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIdentityProps) {
  return isWidgetOperation(operation) && 'id' in operation;
}

function hasWidgetIdentityRoleProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIdentityProps & { role: string }) {
  return hasWidgetIdentityProps(operation) && 'role' in operation;
}

/**
 * An 'identified' widget just means a data structure with an ID and a ReactNode.
 */
function createIdentifiedWidget(operation: WidgetRendererOperation) {
  let widget: ReactNode = null;
  const { id } = operation;
  if (hasWidgetComponentProps(operation)) {
    widget = (
      <operation.component />
    );
  } else if (hasWidgetElementProps(operation)) {
    widget = operation.element;
  } else if (hasWidgetIFrameProps(operation)) {
    widget = (
      <IFrameWidget url={operation.url} title={operation.title} />
    );
  }

  return {
    id,
    node: (
      <WidgetProvider key={id} slotId={operation.slotId} widgetId={operation.id} role={operation.role}>
        {widget}
      </WidgetProvider>
    ),
  };
}

function findRelatedWidgetIndex(id: string, widgets: IdentifiedWidget[]) {
  for (const candidateRelatedWidget of widgets) {
    if (candidateRelatedWidget.id === id) {
      return widgets.indexOf(candidateRelatedWidget);
    }
  }
  return null;
}

function appendWidget(operation: WidgetAppendOperation, widgets: IdentifiedWidget[]) {
  const widget = createIdentifiedWidget(operation);
  widgets.push(widget);
}

function prependWidget(operation: WidgetPrependOperation, widgets: IdentifiedWidget[]) {
  const widget = createIdentifiedWidget(operation);
  widgets.unshift(widget);
}

function insertAfterWidget(operation: WidgetInsertAfterOperation, widgets: IdentifiedWidget[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex + 1, 0, widget);
  }
}

function insertBeforeWidget(operation: WidgetInsertBeforeOperation, widgets: IdentifiedWidget[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 0, widget);
  }
}

function replaceWidget(operation: WidgetReplaceOperation, widgets: IdentifiedWidget[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 1, widget);
  }
}

function removeWidget(operation: WidgetRemoveOperation, widgets: IdentifiedWidget[]) {
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 1);
  }
}

export function createWidgets(operations: WidgetOperation[]) {
  const identifiedWidgets: IdentifiedWidget[] = [];

  for (const operation of operations) {
    if (isSlotOperationConditionSatisfied(operation)) {
      if (isWidgetAppendOperation(operation)) {
        appendWidget(operation, identifiedWidgets);
      } else if (isWidgetPrependOperation(operation)) {
        prependWidget(operation, identifiedWidgets);
      } else if (isWidgetInsertAfterOperation(operation)) {
        insertAfterWidget(operation, identifiedWidgets);
      } else if (isWidgetInsertBeforeOperation(operation)) {
        insertBeforeWidget(operation, identifiedWidgets);
      } else if (isWidgetReplaceOperation(operation)) {
        replaceWidget(operation, identifiedWidgets);
      } else if (isWidgetRemoveOperation(operation)) {
        removeWidget(operation, identifiedWidgets);
      }
    }
  }

  // Remove the 'id' metadata and return just the nodes.
  return identifiedWidgets.map(widget => widget.node);
}
