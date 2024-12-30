import { Fragment, ReactNode } from 'react';
import { getAuthenticatedUser } from '../../auth';
import { getConfig } from '../../config';
import FederatedWidget from '../FederatedWidget';
import { AbsoluteWidgetOperation, ComponentOperation, ElementOperation, FederatedOperation, LayoutOptionsOperation, RelativeWidgetOperation, ReplaceLayoutOperation, SlotOperation, UiOperation, WidgetOperationTypes } from '../types';

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

export function createWidgetNode(operation: UiOperation) {
  let widget: ReactNode = null;
  if (isComponentOperation(operation)) {
    widget = (
      <operation.component key={operation.id} />
    );
  } else if (isElementOperation(operation)) {
    widget = (
      // This fragment is here so that we can use the operation ID as a key, meaning
      // developers don't need to add it to their operation's element.
      <Fragment key={operation.id}>
        {operation.element}
      </Fragment>
    );
  } else if (isFederationOperation(operation)) {
    widget = (
      <FederatedWidget key={operation.id} remoteId={operation.remoteId} moduleId={operation.moduleId} />
    );
  }
  return widget;
}

function addRelativeWidget(widget: { id: string, node: ReactNode }, widgets: { id: string, node: ReactNode }[], operation: RelativeWidgetOperation) {
  for (const candidateRelatedWidget of widgets) {
    if (candidateRelatedWidget.id === operation.relatedId) {
      const relatedIndex = widgets.indexOf(candidateRelatedWidget);
      if (operation.op === WidgetOperationTypes.INSERT_AFTER) {
        widgets.splice(relatedIndex + 1, 0, widget);
      } else if (operation.op === WidgetOperationTypes.INSERT_BEFORE) {
        widgets.splice(relatedIndex, 0, widget);
      } else if (operation.op === WidgetOperationTypes.REPLACE) {
        widgets.splice(relatedIndex, 1, widget);
      } else if (operation.op === WidgetOperationTypes.REMOVE) {
        widgets.splice(relatedIndex, 1);
      }
      break;
    }
  }
}

export function createWidgets(operations: UiOperation[]) {
  const identifiedWidgets: { id: string, node: ReactNode }[] = [];

  for (const operation of operations) {
    if (isUiOperation(operation)) {
      if (isSlotOperationConditionSatisfied(operation)) {
        const node = createWidgetNode(operation);
        const widget = {
          id: operation.id,
          node,
        };
        if (operation.op === WidgetOperationTypes.APPEND) {
          identifiedWidgets.push(widget);
        } else if (operation.op === WidgetOperationTypes.PREPEND) {
          identifiedWidgets.unshift(widget);
        } else if (isRelativelyPositionedWidgetOperation(operation)) {
          addRelativeWidget(widget, identifiedWidgets, operation);
        }
      }
    }
  }

  return identifiedWidgets.map(widget => widget.node);
}

function isAbsolutelyPositionedWidgetOperation(operation: UiOperation): operation is AbsoluteWidgetOperation {
  return operation.op === WidgetOperationTypes.APPEND || operation.op === WidgetOperationTypes.PREPEND;
}

function isRelativelyPositionedWidgetOperation(operation: UiOperation): operation is RelativeWidgetOperation {
  return operation.op === WidgetOperationTypes.INSERT_AFTER || operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function getActiveUiOperations(operations: SlotOperation[]) {
  return operations.filter((operation) => {
    return isUiOperation(operation) && isSlotOperationConditionSatisfied(operation);
  });
}

// This function sorts widget operations in an order that guarantees that any 'related' widgets
// needed by relatively positioned operations (INSERT_AFTER, INSERT_BEFORE) should already exist by
// the time the relative operations are evaluated.  It means the declaration order of operations in
// SiteConfig does not prevent an operation from interacting with a widget that was declared
// 'later'.
export function sortWidgetOperations(operations: UiOperation[]) {
  const activeOperations = getActiveUiOperations(operations);
  return activeOperations.sort((a: UiOperation, b: UiOperation) => {
    const aAbsolute = isAbsolutelyPositionedWidgetOperation(a);
    const bAbsolute = isAbsolutelyPositionedWidgetOperation(b);
    if (aAbsolute && bAbsolute) {
      return 0;
    } else if (aAbsolute) {
      return -1;
    } else if (bAbsolute) {
      return 1;
    } else if (isRelativelyPositionedWidgetOperation(a) && isRelativelyPositionedWidgetOperation(b)) {
      if (a.id === b.relatedId) {
        return -1;
      } else if (b.id === a.relatedId) {
        return 1;
      }
    }

    return 0;
  });
}

export function isUiSlot(id: string) {
  return id.endsWith('.ui');
}

export function isUiOperation(operation: SlotOperation): operation is UiOperation {
  return operation.slotId.endsWith('.ui');
}

export function isComponentOperation(operation: UiOperation): operation is ComponentOperation {
  return isUiOperation(operation) && 'component' in operation;
}

export function isElementOperation(operation: UiOperation): operation is ElementOperation {
  return isUiOperation(operation) && 'element' in operation;
}

export function isFederationOperation(operation: UiOperation): operation is FederatedOperation {
  return isUiOperation(operation) && 'remoteId' in operation;
}

export function isOptionsOperation(operation: UiOperation): operation is LayoutOptionsOperation {
  return isUiOperation(operation) && 'options' in operation;
}

export function isReplaceOperation(operation: UiOperation): operation is ReplaceLayoutOperation {
  return isUiOperation(operation) && 'layout' in operation;
}
