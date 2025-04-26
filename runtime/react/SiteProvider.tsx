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

import CombinedAppProvider from './CombinedAppProvider';
import ErrorBoundary from './ErrorBoundary';
import SiteContext from './SiteContext';
import { SELECTED_THEME_VARIANT_KEY } from './constants';
import {
  useTheme,
  useSiteEvent,
  useTrackColorSchemeChoice
} from './hooks';
import { themeActions } from './reducers';

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
 * - A theme manager for Paragon.
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

  useTrackColorSchemeChoice();
  const [themeState, themeDispatch] = useTheme();

  const siteContextValue = useMemo(() => ({
    authenticatedUser,
    siteConfig,
    locale,
    theme: {
      state: themeState,
      setThemeVariant: (themeVariant: string) => {
        themeDispatch(themeActions.setThemeVariant(themeVariant));

        // Persist selected theme variant to localStorage.
        window.localStorage.setItem(SELECTED_THEME_VARIANT_KEY, themeVariant);
      },
    },
  }), [authenticatedUser, siteConfig, locale, themeState, themeDispatch]);

  if (!themeState?.isThemeLoaded) {
    return null;
  }

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <ErrorBoundary>
        <SiteContext.Provider value={siteContextValue}>
          <CombinedAppProvider>
            {children}
          </CombinedAppProvider>
        </SiteContext.Provider>
      </ErrorBoundary>
    </IntlProvider>
  );
}
