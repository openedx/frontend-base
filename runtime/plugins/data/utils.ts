import React, { FunctionComponent, ReactNode } from 'react';
import { DefaultContentsPluginContainerConfig, HidePlugin, InsertPlugin, ModifyPlugin, PluginChange, PluginContainerConfig, PluginContainerDirectConfig, PluginContainerIframeConfig, PluginOperationTypes, PluginTypes, WrapPlugin } from '../../../types';
import { getConfig } from '../../config';

/**
 * Called by PluginSlot to prepare the plugin changes for the given slot
 *
 * @param defaultContents - The default widgets where the plugin slot exists.
 * @param plugins - All of the changes assigned to the specific plugin slot
 * @returns A sorted array of PluginContainerConfig[] with any additional properties needed to render them in the plugin slot
 */
export function organizePlugins(defaultContents: DefaultContentsPluginContainerConfig[], plugins: PluginChange[]) {
  const newContents: PluginContainerConfig[] = [...defaultContents];
  plugins.forEach(change => {
    if (isInsertPluginChange(change)) {
      newContents.push(change.widget);
    } else if (isHidePluginChange(change)) {
      const widget = newContents.find((w) => w.id === change.widgetId);
      if (widget) {
        widget.hidden = true;
      }
    } else if (isModifyPluginChange(change)) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const widget: PluginContainerConfig = {
          content: {},
          ...newContents[widgetIdx]
        };
        newContents[widgetIdx] = change.fn(widget);
      }
    } else if (isWrapPluginChange(change)) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const newWidget: PluginContainerConfig = {
          ...newContents[widgetIdx]
        };
        if (newWidget.wrappers === undefined) {
          newWidget.wrappers = [];
        }
        newWidget.wrappers.push(change.wrapper);
        newContents[widgetIdx] = newWidget;
      }
    }
  });

  newContents.sort((a, b) => (a.priority - b.priority) * 10_000 + a.id.localeCompare(b.id));
  return newContents;
};

/**
 * Determines if the specified PluginChange is a ModifyPlugin, and narrows the type of `change` if so.
 *
 * @param change - a plugin change object to evaluate
 * @returns whether the PluginChange is a ModifyPlugin
 */
export function isModifyPluginChange(change: PluginChange): change is ModifyPlugin {
  return change.op === PluginOperationTypes.MODIFY;
}

/**
 * Determines if the specified PluginChange is a InsertPlugin, and narrows the type of `change` if so.
 *
 * @param change - a plugin change object to evaluate
 * @returns whether the PluginChange is an InsertPlugin
 */
export function isInsertPluginChange(change: PluginChange): change is InsertPlugin {
  return change.op === PluginOperationTypes.INSERT;
}

/**
 * Determines if the specified PluginChange is a WrapPlugin, and narrows the type of `change` if so.
 *
 * @param change - a plugin change object to evaluate
 * @returns whether the PluginChange is a WrapPlugin
 */
export function isWrapPluginChange(change: PluginChange): change is WrapPlugin {
  return change.op === PluginOperationTypes.WRAP;
}

/**
 * Determines if the specified PluginChange is a HidePlugin, and narrows the type of `change` if so.
 *
 * @param change - a plugin change object to evaluate
 * @returns whether the PluginChange is a HidePlugin
 */
export function isHidePluginChange(change: PluginChange): change is HidePlugin {
  return change.op === PluginOperationTypes.HIDE;
}

export function isDefaultPluginContainerConfig(config: PluginContainerConfig): config is DefaultContentsPluginContainerConfig {
  return config.id === 'default_contents';
}
/** Wraps the plugin component with number of wrappers provided.
 *
 * @param renderComponent - Function that returns JSX (i.e. React Component)
 * @param wrappers - Array of components that each use a "component" prop to render the wrapped contents
 * @returns The plugin component wrapped by any number of wrappers provided.
*/
export function wrapComponent(renderComponent, wrappers: FunctionComponent<{ component: ReactNode }>[]) {
  return wrappers.reduce(
    // Disabled lint because currently we don't have a unique identifier for this
    // The "component" and "wrapper" are both functions
    // eslint-disable-next-line react/no-array-index-key
    (component, wrapper, idx) => React.createElement(wrapper, { component, key: idx }),
    renderComponent(),
  );
}

/**
 * Called by usePluginSlot to retrieve the most up-to-date Config Document.
 *
 * @returns The pluginSlots object in SiteConfig.
 */
export function getConfigSlots() {
  return getConfig()?.pluginSlots;
}

/**
 * Merges two React props objects together with special cases for `className`, `style`, and function
 * callbacks.
 *
 * @param aProps A React "props" object to merge.
 * @param bProps A React "props" object to merge.
 * @returns A new object containing the merged props from the two objects.
 */
const mergeProps = (aProps: Record<string, any> = {}, bProps: Record<string, any> = {}) => {
  const mergedProps = { ...aProps };
  if (bProps) {
    Object.entries(bProps).forEach(([attributeName, attributeValue]) => {
      let transformedAttributeValue = !attributeValue ? '' : attributeValue;
      if (attributeName === 'className') {
      // Append the `className` to the existing `className` prop value (if any)
        transformedAttributeValue = [mergedProps.className, attributeValue].join(' ').trim();
      } else if (attributeName === 'style') {
      // Only update `style` prop if attributeValue is an object
        if (typeof attributeValue !== 'object') {
          return;
        }
        // Merge the `style` object with the existing `style` prop object (if any)
        transformedAttributeValue = { ...mergedProps.style, ...attributeValue };
      } else if (typeof attributeValue === 'function') {
      // Merge the function with the existing prop's function
        const oldFn = mergedProps[attributeName];
        transformedAttributeValue = oldFn ? (...args) => {
          oldFn(...args);
          attributeValue(...args);
        } : attributeValue;
      }
      mergedProps[attributeName] = transformedAttributeValue;
    });
  }
  return mergedProps;
};

interface MergeRenderWidgetPropsWithPluginContentParams {
  pluginSlotOptions: { mergeProps: boolean },
  pluginConfig: PluginContainerConfig,
  pluginProps?: Record<string, any>,
  renderWidgetProps: Record<string, any>,
}

/**
 * Merges the plugin content with the RenderWidget props, if any. Handles special cases
 * like merging `className`, `style`, and functions.
 *
 * @param pluginSlotOptions A slot options object containing a value for `mergeProps`
 * @param pluginConfig A PluginContainerConfig object
 * @param pluginProps Any plugin props being passed to the plugin.
 * @param renderWidgetProps
 * @returns - Updated RenderWidget props merged with custom pluginConfig.content.
 */
export const mergeRenderWidgetPropsWithPluginContent = ({
  pluginSlotOptions,
  pluginConfig,
  pluginProps,
  renderWidgetProps,
}: MergeRenderWidgetPropsWithPluginContentParams) => {
  // Always merge RenderWidget props and pluginProps and provide a `key`.
  const renderWidgetPropsWithPluginProps = mergeProps(renderWidgetProps, pluginProps);
  let updatedRenderWidgetProps: Record<string, any> = { key: pluginConfig.id, ...renderWidgetPropsWithPluginProps };

  if (!('content' in pluginConfig)) {
    // No custom plugin content; return updated props;
    return updatedRenderWidgetProps;
  }

  // Handle custom plugin content
  const { mergeProps: shouldMergeProps } = pluginSlotOptions;

  if (shouldMergeProps) {
    updatedRenderWidgetProps = mergeProps(updatedRenderWidgetProps, pluginConfig.content);
  } else {
    updatedRenderWidgetProps = {
      ...updatedRenderWidgetProps,
      // pass custom props contained with `content` prop
      content: pluginConfig.content,
    };
  }

  return updatedRenderWidgetProps;
};

/**
 * Determines if the specified PluginContainerConfig is a PluginContainerIframeConfig, and narrows the type of `config` if so.
 *
 * @param config a plugin container config object to evaluate
 * @returns whether the PluginContainerConfig is a PluginContainerIframeConfig
 */
export function isPluginContainerIframeConfig(config: PluginContainerConfig): config is PluginContainerIframeConfig {
  return config.type === PluginTypes.IFRAME;
}

/**
 * Determines if the specified PluginContainerConfig is a PluginContainerDirectConfig, and narrows the type of `config` if so.
 *
 * @param config a plugin container config object to evaluate
 * @returns whether the PluginContainerConfig is a PluginContainerDirectConfig
 */
export function isPluginContainerDirectConfig(config: PluginContainerConfig): config is PluginContainerDirectConfig {
  return config.type === PluginTypes.DIRECT;
}
