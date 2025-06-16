import { ReactNode, useMemo, useState } from 'react';

import { AUTHENTICATED_USER_CHANGED, getAuthenticatedUser } from '../auth';
import { getSiteConfig } from '../config';
import { CONFIG_CHANGED } from '../constants';
import {
  getLocale,
  getMessages,
  IntlProvider,
  LOCALE_CHANGED,
} from '../i18n';

import SiteContext from './SiteContext';
import ErrorBoundary from './ErrorBoundary';
import { useSiteEvent } from './hooks';
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
  const [siteConfig, setSiteConfig] = useState(getSiteConfig());
  const [authenticatedUser, setAuthenticatedUser] = useState(getAuthenticatedUser());
  const [locale, setLocale] = useState(getLocale());

  useSiteEvent(AUTHENTICATED_USER_CHANGED, () => {
    setAuthenticatedUser(getAuthenticatedUser());
  });

  useSiteEvent(CONFIG_CHANGED, () => {
    setSiteConfig(getSiteConfig());
  });

  useSiteEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  const siteContextValue = useMemo(() => ({
    authenticatedUser,
    siteConfig,
    locale
  }), [authenticatedUser, siteConfig, locale]);

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <ErrorBoundary>
        <SiteContext.Provider value={siteContextValue}>
          <LearningProvider>
            {children}
          </LearningProvider>
        </SiteContext.Provider>
      </ErrorBoundary>
    </IntlProvider>
  );
}
