import { ComponentType, Fragment, ReactNode, useContext, useEffect, useState } from 'react';

import { SlotOperation } from '../../types';
import { APPS_CHANGED } from '../constants';
import { useAppEvent } from '../react';
import SlotContext from './SlotContext';
import { getSlotOperations, isComponentOperation, isElementOperation, isOperationConditionSatisfied, isOptionsOperation, isReplaceOperation, isWidgetOperation, isWidgetSlot } from './utils';

export function useSlotContext() {
  return useContext(SlotContext);
}

export function useSlotOperations(id: string) {
  const [operations, setOperations] = useState<SlotOperation[]>([]);
  useAppEvent(APPS_CHANGED, () => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  });
  useEffect(() => {
    const ops = getSlotOperations(id);
    setOperations(ops);
  }, [id]);
  return operations;
}

export function useSlotWidgets() {
  const { id } = useSlotContext();
  return useSlotWidgetsById(id);
}

export function useSlotWidgetsById(id: string) {
  const operations = useSlotOperations(id);
  const widgets: ReactNode[] = [];

  if (isWidgetSlot(id)) {
    for (const operation of operations) {
      if (isWidgetOperation(operation)) {
        if (isOperationConditionSatisfied(operation)) {
          if (isComponentOperation(operation)) {
            widgets.push(<operation.component key={operation.id} />);
          } else if (isElementOperation(operation)) {
            widgets.push((
              // This fragment is here so that we can use the operation ID as a key, meaning
              // developers don't need to add it to their operation's element.
              <Fragment key={operation.id}>
                {operation.element}
              </Fragment>
            ));
          }
        }
      }
    }
  }
  return widgets;
}

export function useSlotOptions() {
  const { id } = useSlotContext();
  return useSlotOptionsById(id);
}

export function useSlotOptionsById(id: string) {
  const operations = useSlotOperations(id);
  let options: Record<string, any> = {};

  if (isWidgetSlot(id)) {
    for (const operation of operations) {
      if (isWidgetOperation(operation)) {
        if (isOperationConditionSatisfied(operation)) {
          if (isOptionsOperation(operation)) {
            options = { ...options, ...operation.options };
          }
        }
      }
    }
  }
  return options;
}

export function useSlotLayoutById(id: string, defaultLayout: ComponentType) {
  const operations = useSlotOperations(id);
  let layout: ComponentType | null = defaultLayout;
  if (isWidgetSlot(id)) {
    for (const operation of operations) {
      if (isWidgetOperation(operation)) {
        if (isOperationConditionSatisfied(operation)) {
          if (isReplaceOperation(operation)) {
            layout = operation.layout;
          }
        }
      }
    }
  }
  return layout;
}

export function useSlotLayout(defaultLayout: ComponentType) {
  const { id } = useSlotContext();
  return useSlotLayoutById(id, defaultLayout);
}
