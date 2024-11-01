import { useEffect, useState } from 'react';
import { ResolvedFooterConfig } from '../../../types';
import { useActiveAppId } from '../../data/hooks';
import { resolveFooterConfig } from './utils';

export default function useResolvedFooterConfig() {
  const appId = useActiveAppId();

  const [config, setConfig] = useState<ResolvedFooterConfig>(resolveFooterConfig(appId));

  useEffect(() => {
    const footerConfig = resolveFooterConfig(appId);
    setConfig(footerConfig);
  }, [appId]);

  return config;
}
