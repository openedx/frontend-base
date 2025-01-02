import { useContext } from 'react';
import SlotContext from './SlotContext';

export function useSlotContext() {
  return useContext(SlotContext);
}
