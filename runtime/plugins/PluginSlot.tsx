import { Spinner } from '@openedx/paragon';
import classNames from 'classnames';
import React, { ElementType, ReactNode } from 'react';

import { useIntl } from '../i18n';

import messages from './Plugin.messages';
import PluginContainer from './PluginContainer';
import { usePluginSlot } from './data/hooks';
import { mergeRenderWidgetPropsWithPluginContent, organizePlugins, wrapComponent } from './data/utils';

interface PluginSlotProps {
  /** Element type for the PluginSlot wrapper component */
  as?: ElementType,
  /** Default children for the PluginSlot */
  children?: ReactNode,
  /** ID of the PluginSlot configuration */
  id: string,
  /** Props that are passed down to each Plugin in the Slot */
  pluginProps?: {
    [prop: string]: any,
  },
  slotOptions?: {
    mergeProps?: boolean,
  },
  ref?: React.ForwardedRef<unknown>,
}

export default function PluginSlot({
  as = React.Fragment,
  children,
  id,
  pluginProps = {},
  slotOptions = {},
  ref,
  ...props
}: PluginSlotProps) {
  /** the plugins below are obtained by the id passed into PluginSlot by the Host MFE. See example/src/PluginsPage.jsx
  for an example of how PluginSlot is populated, and example/src/index.jsx for a dummy JS config that holds all plugins
  */

  const { keepDefault, plugins } = usePluginSlot(id);
  const { formatMessage } = useIntl();

  const defaultContents = React.useMemo(() => {
    if (!keepDefault) {
      return [];
    }
    return ([{
      id: 'default_contents',
      priority: 50,
      RenderWidget: children,
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

  const finalChildren: Array<ReactNode> = [];
  if (finalPlugins.length > 0) {
    finalPlugins.forEach((pluginConfig) => {
      // If hidden, don't push to finalChildren
      if (!pluginConfig.hidden) {
        let container;
        // If default content, render children (merging any custom defined props from
        // pluginConfig.content with any existing props on `RenderWidget`).
        if (pluginConfig.id === 'default_contents') {
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
