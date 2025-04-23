import { createContext } from 'react';

const SlotContext = createContext<{ id: string }>({
  id: '',
});

export default SlotContext;
