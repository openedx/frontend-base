import { ComponentType, createElement, isValidElement, ReactNode } from 'react';
import DefaultSlotLayout from './layout/DefaultSlotLayout';
import { useLayoutForSlotId } from './layout/hooks';
import SlotContext from './SlotContext';

interface SlotProps {
  id: string,
  layout?: ComponentType | ReactNode,
}

export default function Slot({ id, layout = DefaultSlotLayout }: SlotProps) {
  let layoutElement: ComponentType | ReactNode = layout;

  const overrideLayout = useLayoutForSlotId(id);
  // Weed out any ReactNode types that aren't actually JSX.
  if (overrideLayout && overrideLayout !== null && overrideLayout !== undefined && typeof overrideLayout !== 'boolean') {
    layoutElement = overrideLayout;
  }

  if (!isValidElement(layoutElement)) {
    layoutElement = createElement(layoutElement as ComponentType);
  }

  return (
    <SlotContext.Provider value={{ id }}>
      {layoutElement}
    </SlotContext.Provider>
  );
}
