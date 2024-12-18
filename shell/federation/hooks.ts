import { loadRemote } from '@module-federation/runtime';
import { ComponentType, lazy, LazyExoticComponent, useEffect, useState } from 'react';

function loadComponent(scope, module) {
  return async (): Promise<{ default: ComponentType<any> }> => {
    const Module = await loadRemote<{ default: ComponentType<any> }>(`${scope}/${module}`);
    if (Module === null) {
      throw new Error('Unable to load module.');
    }
    return Module;
  };
}

export function useRemoteComponent(remoteId, moduleId) {
  const [component, setComponent] = useState<LazyExoticComponent<ComponentType<any>>>(lazy(loadComponent(remoteId, moduleId)));

  useEffect(() => {
    const loadedComponent = lazy(loadComponent(remoteId, moduleId));
    setComponent(loadedComponent);
  }, [remoteId, moduleId]);

  return component;
}
