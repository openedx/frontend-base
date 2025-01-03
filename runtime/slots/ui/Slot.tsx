import { ComponentType, createElement, isValidElement, ReactChild, ReactFragment, ReactPortal } from 'react';
import DefaultSlotLayout from './layout/DefaultSlotLayout';
import { useLayoutForSlotId } from './layout/hooks';
import SlotContext from './SlotContext';

interface SlotProps {
  id: string,
  layout?: ComponentType | ReactChild | ReactFragment | ReactPortal,
}

export default function Slot({ id, layout = DefaultSlotLayout }: SlotProps) {
  let layoutElement: ComponentType | ReactChild | ReactFragment | ReactPortal = layout;

  const overrideLayout = useLayoutForSlotId(id);
  if (overrideLayout) {
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
