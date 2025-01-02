import { Fragment, ReactNode } from 'react';
import { getAuthenticatedUser } from '../../auth';
import { getConfig } from '../../config';
import FederatedWidget from '../FederatedWidget';
import IFrameWidget from '../iframes/IFrameWidget';
import {
  LayoutOperation,
  LayoutOperationTypes,
  LayoutOptionsOperation,
  ReplaceLayoutOperation,
  SlotOperation,
  UiOperation,
  WidgetAbsoluteOperation,
  WidgetAppendOperation,
  WidgetComponentProps,
  WidgetElementProps,
  WidgetFederatedProps,
  WidgetIdentityProps,
  WidgetIFrameProps,
  WidgetInsertAfterOperation,
  WidgetInsertBeforeOperation,
  WidgetOperation,
  WidgetOperationTypes,
  WidgetOptionsOperation,
  WidgetPrependOperation,
  WidgetRemoveOperation,
  WidgetRendererOperation,
  WidgetRendererProps,
  WidgetReplaceOperation
} from '../types';
import WidgetContext from '../WidgetContext';

export function getSlotOperations(id: string) {
  const { apps } = getConfig();
  const ops: SlotOperation[] = [];
  apps.forEach((app) => {
    if (Array.isArray(app.slots)) {
      app.slots.forEach((operation) => {
        if (operation.slotId === id) {
          ops.push(operation);
        }
      });
    }
  });
  return ops;
}

export function getOperationsByWidgetId(slotId: string, widgetId: string) {
  const operations = getSlotOperations(slotId);
  return operations.filter((operation) => isWidgetOperation(operation) && hasWidgetIdentityProps(operation) && operation.id === widgetId);
}

export function isSlotOperationConditionSatisfied(operation: SlotOperation) {
  const { condition } = operation;
  if (condition?.authenticated !== undefined) {
    const isAuthenticated = getAuthenticatedUser() !== null;
    if (condition.authenticated && isAuthenticated) {
      return true;
    }
    if (!condition.authenticated && !isAuthenticated) {
      return true;
    }
    // If the authenticated condition existed but we didn't satisfy it, return false.
    return false;
  }

  // If there was no condition, we return true.
  return true;
}

// Widget Slots

export function createIdentifiedWidget(operation: WidgetRendererOperation) {
  let widget: ReactNode = null;
  const { id } = operation;
  if (hasWidgetComponentProps(operation)) {
    widget = (
      <operation.component />
    );
  } else if (hasWidgetElementProps(operation)) {
    widget = (
      // This fragment is here so that we can use the operation ID as a key, meaning
      // developers don't need to add it to their operation's element.
      <Fragment>
        {operation.element}
      </Fragment>
    );
  } else if (hasWidgetFederatedProps(operation)) {
    widget = (
      <FederatedWidget remoteId={operation.remoteId} moduleId={operation.moduleId} />
    );
  } else if (hasWidgetIFrameProps(operation)) {
    widget = (
      <IFrameWidget url={operation.url} title={operation.title} />
    );
  }

  return {
    id: operation.id,
    node: (
      <WidgetContext.Provider
        key={id}
        value={{
          slotId: operation.slotId,
          widgetId: operation.id,
          role: operation.role,
        }}
      >{widget}
      </WidgetContext.Provider>
    ),
  };
}

function findRelatedWidgetIndex(id: string, widgets: { id: string, node: ReactNode }[]) {
  for (const candidateRelatedWidget of widgets) {
    if (candidateRelatedWidget.id === id) {
      return widgets.indexOf(candidateRelatedWidget);
    }
  }
  return null;
}

export function appendWidget(operation: WidgetAppendOperation, widgets: { id: string, node: ReactNode }[]) {
  const widget = createIdentifiedWidget(operation);
  widgets.push(widget);
}

export function prependWidget(operation: WidgetPrependOperation, widgets: { id: string, node: ReactNode }[]) {
  const widget = createIdentifiedWidget(operation);
  widgets.unshift(widget);
}

export function insertAfterWidget(operation: WidgetInsertAfterOperation, widgets: { id: string, node: ReactNode }[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex + 1, 0, widget);
  }
}

export function insertBeforeWidget(operation: WidgetInsertBeforeOperation, widgets: { id: string, node: ReactNode }[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 0, widget);
  }
}

export function replaceWidget(operation: WidgetReplaceOperation, widgets: { id: string, node: ReactNode }[]) {
  const widget = createIdentifiedWidget(operation);
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 1, widget);
  }
}

export function removeWidget(operation: WidgetRemoveOperation, widgets: { id: string, node: ReactNode }[]) {
  const relatedIndex = findRelatedWidgetIndex(operation.relatedId, widgets);
  if (relatedIndex !== null) {
    widgets.splice(relatedIndex, 1);
  }
}

export function createWidgets(operations: UiOperation[]) {
  const identifiedWidgets: { id: string, node: ReactNode }[] = [];

  for (const operation of operations) {
    if (isWidgetOperation(operation)) {
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
  }

  // Remove the 'id' metadata and return just the nodes.
  return identifiedWidgets.map(widget => widget.node);
}

function isWidgetAbsoluteOperation(operation: WidgetOperation): operation is WidgetAbsoluteOperation {
  return operation.op === WidgetOperationTypes.APPEND || operation.op === WidgetOperationTypes.PREPEND;
}

function isWidgetRelativeOperation(operation: WidgetOperation): operation is (WidgetInsertAfterOperation | WidgetInsertBeforeOperation) {
  return operation.op === WidgetOperationTypes.INSERT_AFTER || operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function getActiveUiOperations(operations: SlotOperation[]) {
  return operations.filter((operation) => {
    return isUiOperation(operation) && isSlotOperationConditionSatisfied(operation);
  });
}

// This function sorts UI operations in an order that guarantees that any 'related' widgets
// needed by relatively positioned operations (INSERT_AFTER, INSERT_BEFORE) should already exist by
// the time the relative operations are evaluated.  It means the declaration order of operations in
// SiteConfig does not prevent an operation from interacting with a widget that was declared
// 'later'.
export function sortUiOperations(operations: UiOperation[]) {
  const activeOperations = getActiveUiOperations(operations);
  return activeOperations.sort((a: UiOperation, b: UiOperation) => {
    // If both operations are widget operations, there are special sorting rules.
    if (isWidgetOperation(a) && isWidgetOperation(b)) {
      const aAbsolute = isWidgetAbsoluteOperation(a);
      const bAbsolute = isWidgetAbsoluteOperation(b);
      if (aAbsolute && bAbsolute) {
        return 0;
      } else if (aAbsolute) {
        return -1;
      } else if (bAbsolute) {
        return 1;
      } else if (isWidgetRelativeOperation(a) && isWidgetRelativeOperation(b)) {
        if (a.id === b.relatedId) {
          return -1;
        } else if (b.id === a.relatedId) {
          return 1;
        }
      }
    }

    return 0;
  });
}

export function isUiSlot(id: string) {
  return id.endsWith('.ui');
}

// Operation type helpers

export function isUiOperation(operation: SlotOperation): operation is UiOperation {
  return operation.slotId.endsWith('.ui');
}

export function isWidgetOperation(operation: UiOperation): operation is WidgetOperation {
  return isUiOperation(operation) && Object.values(WidgetOperationTypes).includes(operation.op as WidgetOperationTypes);
}

export function isLayoutOperation(operation: UiOperation): operation is LayoutOperation {
  return isUiOperation(operation) && Object.values(LayoutOperationTypes).includes(operation.op as LayoutOperationTypes);
}

// Widget operation type helpers

export function isWidgetAppendOperation(operation: UiOperation): operation is WidgetAppendOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.APPEND;
}

export function isWidgetInsertAfterOperation(operation: UiOperation): operation is WidgetInsertAfterOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.INSERT_AFTER;
}

export function isWidgetInsertBeforeOperation(operation: UiOperation): operation is WidgetInsertBeforeOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function isWidgetPrependOperation(operation: UiOperation): operation is WidgetPrependOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.PREPEND;
}

export function isWidgetRemoveOperation(operation: UiOperation): operation is WidgetRemoveOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.REMOVE;
}

export function isWidgetReplaceOperation(operation: UiOperation): operation is WidgetReplaceOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.REPLACE;
}

export function isWidgetOptionsOperation(operation: UiOperation): operation is WidgetOptionsOperation {
  return isWidgetOperation(operation) && operation.op === WidgetOperationTypes.OPTIONS;
}

export function isWidgetRendererOperation(operation: UiOperation): operation is WidgetRendererOperation {
  return isWidgetOperation(operation) && hasWidgetRendererProps(operation);
}

// Layout operation type helpers

export function isLayoutOptionsOperation(operation: UiOperation): operation is LayoutOptionsOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.OPTIONS;
}

export function isLayoutReplaceOperation(operation: UiOperation): operation is ReplaceLayoutOperation {
  return isLayoutOperation(operation) && operation.op === LayoutOperationTypes.LAYOUT;
}

// Widget Operation props helpers

export function hasWidgetComponentProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetComponentProps) {
  return isWidgetOperation(operation) && 'component' in operation;
}

export function hasWidgetElementProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetElementProps) {
  return isWidgetOperation(operation) && 'element' in operation;
}

export function hasWidgetFederatedProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetFederatedProps) {
  return isWidgetOperation(operation) && 'remoteId' in operation && 'moduleId' in operation;
}

export function hasWidgetIFrameProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIFrameProps) {
  return isWidgetOperation(operation) && 'url' in operation && 'title' in operation;
}

export function hasWidgetRendererProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetRendererProps) {
  return hasWidgetComponentProps(operation) || hasWidgetElementProps(operation) || hasWidgetFederatedProps(operation) || hasWidgetIFrameProps(operation);
}

export function hasWidgetIdentityProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIdentityProps) {
  return isWidgetOperation(operation) && 'id' in operation;
}
