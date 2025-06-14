import { createContext, ReactNode } from 'react';

const SlotContext = createContext<{ id: string, children?: ReactNode, [key: string]: unknown }>({
  id: '',
  children: null,
});

export default SlotContext;
