import { Spinner } from '@openedx/paragon';
import classNames from 'classnames';
import React, { ElementType, ReactNode } from 'react';

import { DefaultContentsPluginContainerConfig, PluginTypes } from '../../types';
import { useIntl } from '../i18n';
import messages from './Plugin.messages';
import PluginContainer from './PluginContainer';
import { usePluginSlot } from './data/hooks';
import {
  isDefaultPluginContainerConfig,
  mergeRenderWidgetPropsWithPluginContent,
  organizePlugins,
  wrapComponent
} from './data/utils';

interface PluginSlotProps {
  /** Element type for the PluginSlot wrapper component */
  as?: ElementType,
  /** Default children for the PluginSlot */
  children?: ReactNode,
  /** ID of the PluginSlot configuration */
  id: string,
  /** Props that are passed down to each Plugin in the Slot */
  pluginProps?: Record<string, any>,
  slotOptions?: {
    mergeProps: boolean,
  },
  ref?: React.ForwardedRef<unknown>,
}

export default function PluginSlot({
  as = React.Fragment,
  children,
  id,
  pluginProps = {},
  slotOptions = {
    mergeProps: false,
  },
  ref,
  ...props
}: PluginSlotProps) {
  // The plugins below are obtained by the id passed into PluginSlot by the Host MFE.
  // See test-project's PluginPage component for an example of how PluginSlot is populated, and
  // test-project's site config for a complete plugin configuration.

  const { keepDefault, plugins } = usePluginSlot(id);
  const { formatMessage } = useIntl();

  const defaultContents: DefaultContentsPluginContainerConfig[] = React.useMemo(() => {
    if (!keepDefault) {
      return [];
    }
    return ([{
      id: 'default_contents',
      priority: 50,
      RenderWidget: children,
      type: PluginTypes.DIRECT,
    }]);
  }, [children, keepDefault]);

  const finalPlugins = React.useMemo(() => organizePlugins(defaultContents, plugins), [defaultContents, plugins]);

  const { loadingFallback } = pluginProps;

  const defaultLoadingFallback = (
    <div className={classNames(pluginProps.className, 'd-flex justify-content-center align-items-center')}>
      <Spinner animation="border" screenReaderText={formatMessage(messages.loading)} />
    </div>
  );

  const finalLoadingFallback = loadingFallback !== undefined
    ? loadingFallback
    : defaultLoadingFallback;

  const finalChildren: ReactNode[] = [];
  if (finalPlugins.length > 0) {
    finalPlugins.forEach((pluginConfig) => {
      // If hidden, don't push to finalChildren
      if (!pluginConfig.hidden) {
        let container;
        // If default content, render children (merging any custom defined props from
        // pluginConfig.content with any existing props on `RenderWidget`).
        if (isDefaultPluginContainerConfig(pluginConfig)) {
          const propsForRenderWidget = (pluginConfig.RenderWidget && React.isValidElement(pluginConfig.RenderWidget))
            ? pluginConfig.RenderWidget.props
            : {};
          const updatedPropsForRenderWidget = mergeRenderWidgetPropsWithPluginContent({
            pluginSlotOptions: slotOptions,
            pluginConfig,
            pluginProps,
            renderWidgetProps: propsForRenderWidget,
          });
          container = React.isValidElement(pluginConfig.RenderWidget)
            ? React.cloneElement(pluginConfig.RenderWidget, { ...updatedPropsForRenderWidget, key: pluginConfig.id })
            : pluginConfig.RenderWidget;
        } else {
          container = (
            <PluginContainer
              key={pluginConfig.id}
              config={pluginConfig}
              loadingFallback={finalLoadingFallback}
              slotOptions={slotOptions}
              {...pluginProps}
            />
          );
        }
        // If wrappers are provided, wrap the Plugin
        if (pluginConfig.wrappers) {
          finalChildren.push(
            wrapComponent(
              () => container,
              pluginConfig.wrappers,
            ),
          );
        } else {
          finalChildren.push(container);
        }
      }
    });
  }

  return React.createElement(
    as,
    {
      ...props,
      ref,
    },
    finalChildren,
  );
}

PluginSlot.displayName = 'PluginSlot';
