import { Fragment, ReactNode } from 'react';
import { AbsoluteWidgetOperations, ComponentOperation, ElementOperation, FederatedOperation, LayoutOptionsOperation, RelativeWidgetOperations, ReplaceLayoutOperation, SlotOperation, WidgetOperation, WidgetOperationTypes } from '../../../types';
import { getAuthenticatedUser } from '../../auth';
import { getConfig } from '../../config';
import FederatedWidget from '../FederatedWidget';

export function getSlotOperations(id: string) {
  const { apps } = getConfig();
  const ops: SlotOperation[] = [];
  apps.forEach((app) => {
    if (Array.isArray(app.slots)) {
      app.slots.forEach((operation) => {
        // TODO: Absorb the slot operation types here and do the right thing when building the array.
        if (operation.slotId === id) {
          ops.push(operation);
        }
      });
    }
  });
  return ops;
}

export function isWidgetOperationConditionSatisfied(operation: SlotOperation) {
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

export function createWidgetNode(operation: WidgetOperation) {
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

function addRelativeWidget(widget: { id: string, node: ReactNode }, widgets: { id: string, node: ReactNode }[], operation: RelativeWidgetOperations) {
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

export function createWidgets(operations: WidgetOperation[]) {
  const identifiedWidgets: { id: string, node: ReactNode }[] = [];

  for (const operation of operations) {
    if (isWidgetOperation(operation)) {
      if (isWidgetOperationConditionSatisfied(operation)) {
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

function isAbsolutelyPositionedWidgetOperation(operation: WidgetOperation): operation is AbsoluteWidgetOperations {
  return operation.op === WidgetOperationTypes.APPEND || operation.op === WidgetOperationTypes.PREPEND;
}

function isRelativelyPositionedWidgetOperation(operation: WidgetOperation): operation is RelativeWidgetOperations {
  return operation.op === WidgetOperationTypes.INSERT_AFTER || operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

export function getActiveWidgetOperations(operations: SlotOperation[]) {
  return operations.filter((operation) => {
    return isWidgetOperation(operation) && isWidgetOperationConditionSatisfied(operation);
  });
}

// This function sorts widget operations in an order that guarantees that any 'related' widgets
// needed by relatively positioned operations (INSERT_AFTER, INSERT_BEFORE) should already exist by the time
// the relative operations are evaluated.  It means the declaration order of operations in SiteConfig does
// not prevent an operation from interacting with a widget that was declared 'later'.
export function sortWidgetOperations(operations: WidgetOperation[]) {
  const activeOperations = getActiveWidgetOperations(operations);
  return activeOperations.sort((a: WidgetOperation, b: WidgetOperation) => {
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

export function isWidgetSlot(id: string) {
  return id.endsWith('.widget');
}

export function isWidgetOperation(operation: SlotOperation): operation is WidgetOperation {
  return operation.slotId.endsWith('.widget');
}

export function isComponentOperation(operation: WidgetOperation): operation is ComponentOperation {
  return isWidgetOperation(operation) && 'component' in operation;
}

export function isElementOperation(operation: WidgetOperation): operation is ElementOperation {
  return isWidgetOperation(operation) && 'element' in operation;
}

export function isFederationOperation(operation: WidgetOperation): operation is FederatedOperation {
  return isWidgetOperation(operation) && 'remoteId' in operation;
}

export function isOptionsOperation(operation: WidgetOperation): operation is LayoutOptionsOperation {
  return isWidgetOperation(operation) && 'options' in operation;
}

export function isReplaceOperation(operation: WidgetOperation): operation is ReplaceLayoutOperation {
  return isWidgetOperation(operation) && 'layout' in operation;
}
