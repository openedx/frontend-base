import { ReactNode, useMemo, useState } from 'react';
import BarContext from './BarContext';

function getBar() {
  return 'Bar';
}

interface BarProviderProps {
  children?: ReactNode,
}

export default function BarProvider({ children }: BarProviderProps) {
  const [bar, setBar] = useState(getBar());

  const barContextValue = useMemo(() => ({
    bar,
    setBar,
  }), [bar, setBar]);

  return (
    <BarContext.Provider value={barContextValue}>
      {children}
    </BarContext.Provider>
  );
};
