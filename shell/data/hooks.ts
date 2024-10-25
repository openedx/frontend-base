import { useEffect, useState } from 'react';
import { useMatches } from 'react-router';
import { AppModuleHandle } from '../../types';

function findAppIdInMatches(matches) {
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (match.handle && typeof match.handle === 'object' && 'appId' in match.handle) {
      const appHandle = match.handle as AppModuleHandle;
      return appHandle.appId;
    }
  }
  throw new Error('No active app ID found.');
}

export function useActiveAppId() {
  const matches = useMatches();
  const [appId, setAppId] = useState<string | null>(findAppIdInMatches(matches));
  useEffect(() => {
    matches.forEach((match) => {
      if (match.handle && typeof match.handle === 'object' && 'appId' in match.handle) {
        const appHandle = match.handle as AppModuleHandle;
        setAppId(appHandle.appId);
      }
    });
  }, [matches]);
  return appId;
}
