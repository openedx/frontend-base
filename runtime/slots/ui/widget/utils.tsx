import { Fragment, ReactNode } from 'react';
import { UiOperation } from '../types';
import { isUiOperation, isUiOperationConditionSatisfied } from '../utils';
import FederatedWidget from './FederatedWidget';
import { IFrameWidget } from './iframe';
import { IdentifiedWidget, WidgetAbsoluteOperation, WidgetAppendOperation, WidgetComponentProps, WidgetElementProps, WidgetFederatedProps, WidgetIFrameProps, WidgetInsertAfterOperation, WidgetInsertBeforeOperation, WidgetOperation, WidgetOperationTypes, WidgetOptionsOperation, WidgetPrependOperation, WidgetRemoveOperation, WidgetRendererOperation, WidgetRendererProps, WidgetReplaceOperation } from './types';
import WidgetContext from './WidgetContext';

export function isWidgetOperation(operation: UiOperation): operation is WidgetOperation {
  return isUiOperation(operation) && Object.values(WidgetOperationTypes).includes(operation.op as WidgetOperationTypes);
}

export function isWidgetAbsoluteOperation(operation: WidgetOperation): operation is WidgetAbsoluteOperation {
  return operation.op === WidgetOperationTypes.APPEND || operation.op === WidgetOperationTypes.PREPEND;
}

export function isWidgetRelativeOperation(operation: WidgetOperation): operation is (WidgetInsertAfterOperation | WidgetInsertBeforeOperation) {
  return operation.op === WidgetOperationTypes.INSERT_AFTER || operation.op === WidgetOperationTypes.INSERT_BEFORE;
}

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

// Widget Operation props helpers

function hasWidgetComponentProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetComponentProps) {
  return isWidgetOperation(operation) && 'component' in operation;
}

function hasWidgetElementProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetElementProps) {
  return isWidgetOperation(operation) && 'element' in operation;
}

function hasWidgetFederatedProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetFederatedProps) {
  return isWidgetOperation(operation) && 'remoteId' in operation && 'moduleId' in operation;
}

function hasWidgetIFrameProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetIFrameProps) {
  return isWidgetOperation(operation) && 'url' in operation && 'title' in operation;
}

function hasWidgetRendererProps(operation: WidgetOperation): operation is (WidgetOperation & WidgetRendererProps) {
  return hasWidgetComponentProps(operation) || hasWidgetElementProps(operation) || hasWidgetFederatedProps(operation) || hasWidgetIFrameProps(operation);
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
    if (isUiOperationConditionSatisfied(operation)) {
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
