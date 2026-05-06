import { createContext, useContext } from 'react';

import type { MasqueradeState } from './hooks';

export const MasqueradeContext = createContext<MasqueradeState | null>(null);

export function useMasqueradeContext(): MasqueradeState {
  const context = useContext(MasqueradeContext);
  if (context === null) {
    throw new Error('useMasqueradeContext must be used within a MasqueradeContext.Provider');
  }
  return context;
}
