import { createContext } from 'react';

const WidgetContext = createContext<{ slotId: string; widgetId: string; widgetIdAliases?: string[]; role?: string }>({
  slotId: '',
  widgetId: '',
  role: undefined,
});

export default WidgetContext;
