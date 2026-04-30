import React from 'react';

import type { MasqueradeOption } from './data/api';

export interface MasqueradeContextValue {
  select: (option: MasqueradeOption) => void,
  selectedOptionName: string | null,
  showUserNameInput: boolean,
}

export const MasqueradeContext = React.createContext<MasqueradeContextValue | null>(null);

export function useMasqueradeContext(): MasqueradeContextValue {
  const context = React.useContext(MasqueradeContext);
  if (context === null) {
    throw new Error('useMasqueradeContext must be used within a MasqueradeContext.Provider');
  }
  return context;
}
