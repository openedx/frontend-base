import { ComponentType, ReactChild, ReactFragment, ReactPortal } from 'react';
import DefaultSlotLayout from './layout/DefaultSlotLayout';
import { useLayoutForSlotId } from './layout/hooks';
import SlotContext from './SlotContext';

interface SlotProps {
  id: string,
  layout?: ComponentType | ReactChild | ReactFragment | ReactPortal,
}

export default function Slot({ id, layout = DefaultSlotLayout }: SlotProps) {
  const layoutElement = useLayoutForSlotId(id, layout);

  return (
    <SlotContext.Provider value={{ id }}>
      {layoutElement}
    </SlotContext.Provider>
  );
}
