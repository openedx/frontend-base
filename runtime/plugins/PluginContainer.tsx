import PluginContainerDirect from './PluginContainerDirect';
import PluginContainerIframe from './PluginContainerIframe';

import { ReactNode } from 'react';
import { isPluginContainerDirectConfig, isPluginContainerIframeConfig } from './data/utils';
import { PluginContainerConfig } from '../../types';

interface PluginContainerProps {
  config: PluginContainerConfig,
  loadingFallback: NonNullable<ReactNode> | null,
  slotOptions?: {
    mergeProps: boolean,
  },
}

export default function PluginContainer({ config, slotOptions = { mergeProps: false }, loadingFallback, ...props }: PluginContainerProps) {
  if (isPluginContainerDirectConfig(config)) {
    return (
      <PluginContainerDirect
        config={config}
        slotOptions={slotOptions}
        loadingFallback={loadingFallback}
        {...props}
      />
    );
  }

  if (isPluginContainerIframeConfig(config)) {
    return (
      <PluginContainerIframe
        config={config}
        loadingFallback={loadingFallback}
        {...props}
      />
    );
  }

  return null;
}
