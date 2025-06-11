import { createContext } from 'react';

const WidgetContext = createContext<{ slotId: string, widgetId: string, role?: string }>({
  slotId: '',
  widgetId: '',
  role: undefined,
});

export default WidgetContext;
