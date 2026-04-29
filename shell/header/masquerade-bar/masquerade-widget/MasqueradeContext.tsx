import React from 'react';

import type {
  ActiveMasqueradeData, MasqueradeStatus, Payload, Role,
} from './data/api';

export interface MasqueradeContextValue {
  active: ActiveMasqueradeData,
  onSubmit: (payload: Payload) => Promise<MasqueradeStatus>,
  onError: (error: string) => void,
  userNameInputToggle: (
    show: boolean | undefined,
    groupId: number | null,
    groupName: string,
    role: Role,
    userName: string,
    userPartitionId: number | null,
  ) => void,
}

export const MasqueradeContext = React.createContext<MasqueradeContextValue | null>(null);

export function useMasqueradeContext(): MasqueradeContextValue {
  const context = React.useContext(MasqueradeContext);
  if (context === null) {
    throw new Error('useMasqueradeContext must be used within a MasqueradeContext.Provider');
  }
  return context;
}
