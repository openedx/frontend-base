import { useEffect, useState } from 'react';
import { ResolvedHeaderConfig } from '../../../types';
import { useActiveAppId } from '../../data/hooks';
import { resolveHeaderConfig } from './utils';

export default function useResolvedHeaderConfig() {
  const appId = useActiveAppId();

  const [config, setConfig] = useState<ResolvedHeaderConfig>(resolveHeaderConfig(appId));

  useEffect(() => {
    const headerConfig = resolveHeaderConfig(appId);
    setConfig(headerConfig);
  }, [appId]);

  return config;
}
