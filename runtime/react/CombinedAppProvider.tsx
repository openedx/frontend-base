import { ReactNode } from 'react';
import { App, AppProvider } from '../../types';
import { getSiteConfig } from '../config';

const combineProviders = (providers: AppProvider[]): AppProvider => {
  return providers.reduce(
    (AccumulatedProviders, CurrentProvider) => {
      // eslint-disable-next-line react/prop-types
      const CombinedProvider: AppProvider = ({ children }) => (
        <AccumulatedProviders>
          <CurrentProvider>{children}</CurrentProvider>
        </AccumulatedProviders>
      );
      return CombinedProvider;
    },
    ({ children }) => <>{children}</>,
  );
};

interface CombinedAppProviderProps {
  children: ReactNode,
}

export default function CombinedAppProvider({ children }: CombinedAppProviderProps) {
  const { apps } = getSiteConfig();

  let providers: AppProvider[] = [];

  if (apps) {
    apps.forEach(
      (app: App) => {
        if (Array.isArray(app.providers)) {
          providers = providers.concat(app.providers);
        }
      }
    );
  }

  const CombinedProviders = combineProviders(providers);

  return (
    <CombinedProviders>
      {children}
    </CombinedProviders>
  );
};
