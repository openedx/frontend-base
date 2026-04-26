import { ReactNode, useMemo } from 'react';
import { App, AppProvider } from '../../types';
import { getSiteConfig } from '../config';

interface CombinedAppProviderProps {
  children: ReactNode,
}

export default function CombinedAppProvider({ children }: CombinedAppProviderProps) {
  const { apps } = getSiteConfig();

  const providers = useMemo<AppProvider[]>(() => {
    const list: AppProvider[] = [];
    if (apps) {
      apps.forEach((app: App) => {
        if (Array.isArray(app.providers)) {
          list.push(...app.providers);
        }
      });
    }
    return list;
  }, [apps]);

  return providers.reduceRight<ReactNode>(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
};
