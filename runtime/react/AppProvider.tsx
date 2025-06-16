import { ReactNode, useMemo, useState } from 'react';

import { getAppConfig } from '../config';
import { CONFIG_CHANGED } from '../constants';

import AppContext from './AppContext';
import { useSiteEvent } from './hooks';

interface AppProviderProps {
  appId: string,
  children: ReactNode,
}

/**
 * A wrapper component for React-based micro-frontends to initialize a number of common data/
 * context providers.
 *
 * ```
 * <AppProvider appId="my.app">
 *   <HelloWorld />
 * </AppProvider>
 * ```
 *
 * This will provide the following to HelloWorld:
 * - An `AppContext` provider for React context data.
 *
 * @param {Object} props
 * @memberof module:React
 */
export default function AppProvider({ appId, children }: AppProviderProps) {
  const [appConfig, setAppConfig] = useState(getAppConfig(appId));

  useSiteEvent(CONFIG_CHANGED, () => {
    setAppConfig(getAppConfig(appId));
  });

  const appContextValue = useMemo(() => ({
    appConfig,
  }), [appConfig]);

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
}
