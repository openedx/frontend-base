import { ComponentType } from 'react';
import { useSlotLayoutById } from './data/hooks';
import DefaultSlotLayout from './DefaultSlotLayout';
import SlotContext from './SlotContext';

interface SlotProps {
  id: string,
  layout?: ComponentType,
}

export default function Slot({ id, layout = DefaultSlotLayout }: SlotProps) {
  const Layout = useSlotLayoutById(id, layout);

  return (
    <SlotContext.Provider value={{ id }}>
      <Layout />
    </SlotContext.Provider>
  );
}
