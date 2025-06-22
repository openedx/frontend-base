import { ReactNode, useMemo, useState } from 'react';

import { getAppConfig } from '../config';
import { CONFIG_CHANGED } from '../constants';

import CurrentAppContext from './CurrentAppContext';
import { useSiteEvent } from './hooks';

interface CurrentAppProviderProps {
  appId: string,
  children: ReactNode,
}

/**
 * A wrapper component for React-based micro-frontends to initialize a number of common data/
 * context providers.
 *
 * ```
 * <CurrentAppProvider appId="my.app">
 *   <HelloWorld />
 * </CurrentAppProvider>
 * ```
 *
 * This will provide the following to HelloWorld:
 * - A `CurrentAppContext` provider for React context data.
 *
 * @param {Object} props
 * @memberof module:React
 */
export default function CurrentAppProvider({ appId, children }: CurrentAppProviderProps) {
  const [appConfig, setAppConfig] = useState(getAppConfig(appId));

  useSiteEvent(CONFIG_CHANGED, () => {
    setAppConfig(getAppConfig(appId));
  });

  const appContextValue = useMemo(() => ({
    appConfig,
  }), [appConfig]);

  return (
    <CurrentAppContext.Provider value={appContextValue}>
      {children}
    </CurrentAppContext.Provider>
  );
}
