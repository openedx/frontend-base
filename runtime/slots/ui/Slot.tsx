import { ComponentType } from 'react';
import DefaultSlotLayout from './layout/DefaultSlotLayout';
import { useLayoutForSlotId } from './layout/hooks';
import SlotContext from './SlotContext';

interface SlotProps {
  id: string,
  layout?: ComponentType,
}

export default function Slot({ id, layout = DefaultSlotLayout }: SlotProps) {
  const Layout = useLayoutForSlotId(id, layout);

  return (
    <SlotContext.Provider value={{ id }}>
      <Layout />
    </SlotContext.Provider>
  );
}
