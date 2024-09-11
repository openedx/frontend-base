import { ReactNode, useMemo, useState } from 'react';

import { AUTHENTICATED_USER_CHANGED, getAuthenticatedUser } from '../auth';
import { getConfig } from '../config';
import { CONFIG_CHANGED } from '../constants';
import {
  getLocale,
  getMessages,
  IntlProvider,
  LOCALE_CHANGED,
} from '../i18n';

import AppContext from './AppContext';
import ErrorBoundary from './ErrorBoundary';
import { useAppEvent, useTrackColorSchemeChoice } from './hooks';

interface AppProviderProps {
  children: ReactNode,
}

/**
 * A wrapper component for React-based micro-frontends to initialize a number of common data/
 * context providers.
 *
 * ```
 * subscribe(APP_READY, () => {
 *   ReactDOM.render(
 *     <AppProvider>
 *       <HelloWorld />
 *     </AppProvider>
 *   )
 * });
 * ```
 *
 * This will provide the following to HelloWorld:
 * - An error boundary as described above.
 * - An `AppContext` provider for React context data.
 * - IntlProvider for @edx/frontend-i18n internationalization
 * - A `Router` for react-router.
 *
 * @param {Object} props
 * @memberof module:React
 */
export default function AppProvider({ children }: AppProviderProps) {
  const [config, setConfig] = useState(getConfig());
  const [authenticatedUser, setAuthenticatedUser] = useState(getAuthenticatedUser());
  const [locale, setLocale] = useState(getLocale());

  useTrackColorSchemeChoice();

  useAppEvent(AUTHENTICATED_USER_CHANGED, () => {
    setAuthenticatedUser(getAuthenticatedUser());
  });

  useAppEvent(CONFIG_CHANGED, () => {
    setConfig(getConfig());
  });

  useAppEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  const appContextValue = useMemo(() => ({ authenticatedUser, config, locale }), [authenticatedUser, config, locale]);

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <ErrorBoundary>
        <AppContext.Provider
          value={appContextValue}
        >
          {children}
        </AppContext.Provider>
      </ErrorBoundary>
    </IntlProvider>
  );
}
