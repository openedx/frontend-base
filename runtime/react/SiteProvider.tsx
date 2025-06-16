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

import SiteContext from './SiteContext';
import ErrorBoundary from './ErrorBoundary';
import { useAppEvent } from './hooks';
import LearningProvider from './learning/LearningProvider';

interface SiteProviderProps {
  children: ReactNode,
}

/**
 * A wrapper component for React-based micro-frontends to initialize a number of common data/
 * context providers.
 *
 * ```
 * subscribe(SITE_READY, () => {
 *   ReactDOM.render(
 *     <SiteProvider>
 *       <HelloWorld />
 *     </SiteProvider>
 *   )
 * });
 * ```
 *
 * This will provide the following to HelloWorld:
 * - An error boundary as described above.
 * - An `SiteContext` provider for React context data.
 * - IntlProvider for @edx/frontend-i18n internationalization
 *
 * @param {Object} props
 * @memberof module:React
 */
export default function SiteProvider({ children }: SiteProviderProps) {
  const [config, setConfig] = useState(getConfig());
  const [authenticatedUser, setAuthenticatedUser] = useState(getAuthenticatedUser());
  const [locale, setLocale] = useState(getLocale());

  useAppEvent(AUTHENTICATED_USER_CHANGED, () => {
    setAuthenticatedUser(getAuthenticatedUser());
  });

  useAppEvent(CONFIG_CHANGED, () => {
    setConfig(getConfig());
  });

  useAppEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  const appContextValue = useMemo(() => ({
    authenticatedUser,
    config,
    locale
  }), [authenticatedUser, config, locale]);

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <ErrorBoundary>
        <SiteContext.Provider value={appContextValue}>
          <LearningProvider>
            {children}
          </LearningProvider>
        </SiteContext.Provider>
      </ErrorBoundary>
    </IntlProvider>
  );
}
