import { ReactNode, Suspense } from 'react';

import { PluginContainerDirectConfig } from '../../types';
import { mergeRenderWidgetPropsWithPluginContent } from './data/utils';

interface PluginContainerDirectProps {
  config: PluginContainerDirectConfig,
  loadingFallback: NonNullable<ReactNode> | null,
  slotOptions: {
    mergeProps: boolean,
  },
}

export default function PluginContainerDirect({
  config, slotOptions, loadingFallback, ...props
}: PluginContainerDirectProps) {
  const { RenderWidget, id } = config;

  // When applicable, merge base RenderWidget props with custom plugin content, if any.
  const propsForRenderWidget = mergeRenderWidgetPropsWithPluginContent({
    pluginSlotOptions: slotOptions,
    pluginConfig: config,
    renderWidgetProps: props,
  });

  return (
    <Suspense fallback={loadingFallback}>
      <RenderWidget id={id} {...propsForRenderWidget} />
    </Suspense>
  );
}
