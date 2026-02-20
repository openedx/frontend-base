import { createContext, ReactNode } from 'react';

const SlotContext = createContext<{ id: string, idAliases?: string[], children?: ReactNode, [key: string]: unknown }>({
  id: '',
  children: null,
});

export default SlotContext;
