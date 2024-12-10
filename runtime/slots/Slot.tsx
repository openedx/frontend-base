import { ComponentType } from 'react';
import DefaultSlotLayout from './DefaultSlotLayout';
import { useSlotLayoutById } from './hooks';
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
