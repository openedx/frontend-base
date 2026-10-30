import { ReactNode, useEffect } from 'react';

import { addActiveWidgetRole, removeActiveWidgetRole } from '../../config';
import WidgetContext from './WidgetContext';

interface WidgetProviderProps {
  children: ReactNode;
  slotId: string;
  widgetId: string;
  widgetIdAliases?: string[];
  role?: string;
}

export default function WidgetProvider({ children, slotId, widgetId, widgetIdAliases, role }: WidgetProviderProps) {
  useEffect(() => {
    if (role !== undefined) {
      addActiveWidgetRole(role);
    }
    return () => {
      if (role !== undefined) {
        removeActiveWidgetRole(role);
      }
    };
  }, [role]);

  return (
    <WidgetContext.Provider value={{ slotId, widgetId, widgetIdAliases, role }}>
      {children}
    </WidgetContext.Provider>
  );
}
