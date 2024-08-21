import { loadRemote } from '@module-federation/runtime';
import {
  ComponentType, Suspense, useEffect, useState
} from 'react';
import { FederatedAppConfig } from '../types';

function useDynamicImport({ module, scope }) {
  const [component, setComponent] = useState<(() => ComponentType<any>) | null>(null);

  useEffect(() => {
    if (!module || !scope) { return; }

    const loadComponent = async () => {
      try {
        const loadedRemote = await loadRemote<{ default: ComponentType<any> }>(`${scope}/${module}`);
        if (loadedRemote !== null) {
          const { default: Component } = loadedRemote;
          setComponent(() => Component);
        } else {
          // TODO: There was no remote.  Throw?
        }
      } catch (error) {
        console.error(`Error loading remote module ${scope}/${module}:`, error);
      }
    };

    loadComponent();
  }, [module, scope]);

  return component;
}

export default function FederatedComponent({ federatedApp }: { federatedApp: FederatedAppConfig }) {
  const Component = useDynamicImport({ scope: federatedApp.appId, module: federatedApp.moduleId });

  return (
    <Suspense fallback="Loading...">
      {Component
        // @ts-ignore
        ? <Component />
        : null}
    </Suspense>
  );
}
